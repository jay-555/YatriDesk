import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const CLOSED = 'BRANCH_CLOSED';

function minutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map((n) => Number(n));
  return h * 60 + m;
}

function localParts(at: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const bag: Record<string, string> = {};
  for (const p of fmt.formatToParts(at)) bag[p.type] = p.value;
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(bag.weekday);
  return {
    dayOfWeek: weekday < 0 ? at.getDay() : weekday,
    minute: Number(bag.hour) * 60 + Number(bag.minute),
    date: `${bag.year}-${bag.month}-${bag.day}`,
  };
}

@Injectable()
export class BranchHoursService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Guest channels (QR, kiosk, website, reservations) call this.
   * The POS does not. No hours rows means the outlet is open all day,
   * so existing installs keep accepting orders.
   */
  async assertOpen(branchId: string, at: Date = new Date()) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        restaurant: { select: { status: true, timezone: true } },
        hours: true,
        closures: true,
      },
    });
    if (!branch) return;
    if (branch.restaurant.status === 'SUSPENDED') {
      throw new ConflictException({
        code: CLOSED,
        message: 'This restaurant is not accepting orders',
      });
    }
    if (branch.temporarilyClosed) {
      throw new ConflictException({
        code: CLOSED,
        message: 'This outlet is temporarily closed',
      });
    }
    const tz = branch.restaurant.timezone || 'Asia/Kolkata';
    const local = localParts(at, tz);
    const closed = branch.closures.some(
      (c) => c.date.toISOString().slice(0, 10) === local.date,
    );
    if (closed) {
      throw new ConflictException({
        code: CLOSED,
        message: 'This outlet is closed today',
      });
    }
    if (branch.hours.length === 0) return;
    const windows = branch.hours.filter((h) => h.dayOfWeek === local.dayOfWeek);
    const yesterday = branch.hours.filter(
      (h) => h.dayOfWeek === (local.dayOfWeek + 6) % 7 && minutes(h.closeTime) <= minutes(h.openTime),
    );
    const inside = (open: string, close: string, now: number, fromPreviousDay: boolean) => {
      const start = minutes(open);
      const end = minutes(close);
      if (end > start) return !fromPreviousDay && now >= start && now < end;
      if (fromPreviousDay) return now < end;
      return now >= start;
    };
    const openNow =
      windows.some((w) => inside(w.openTime, w.closeTime, local.minute, false)) ||
      yesterday.some((w) => inside(w.openTime, w.closeTime, local.minute, true));
    if (!openNow) {
      throw new ConflictException({
        code: CLOSED,
        message: 'This outlet is closed right now',
      });
    }
  }

  async isOpen(branchId: string, at?: Date): Promise<boolean> {
    try {
      await this.assertOpen(branchId, at);
      return true;
    } catch {
      return false;
    }
  }
}
