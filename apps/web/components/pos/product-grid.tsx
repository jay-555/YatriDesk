"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { QueryError } from "@/components/ui/query-error";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadImage } from "@/components/ui/upload-image";
import { useCategories, useMenuItems, type MenuItem } from "@/hooks/use-menu";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const SPICE_LABEL: Record<MenuItem["spiceLevel"], string | null> = {
  NONE: null,
  MILD: "Mild",
  MEDIUM: "Medium",
  HOT: "Hot",
  EXTRA_HOT: "Extra hot",
};

function minutesNow(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

function parseClock(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** True when both ends are set and the current minute is outside the window. An overnight window (22:00–06:00) stays open across midnight. */
function outsideServingWindow(from: string | null, to: string | null, nowMin: number) {
  if (!from || !to) return false;
  const start = parseClock(from);
  const end = parseClock(to);
  if (start == null || end == null || start === end) return false;
  if (start < end) return nowMin < start || nowMin >= end;
  return nowMin < start && nowMin >= end;
}

function extraDiet(item: MenuItem): string | null {
  return item.isVegan ? "Vegan" : null;
}

function DietMark({ veg }: { veg: boolean }) {
  if (veg) {
    return (
      <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full border border-green-800 bg-green-600" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center" aria-hidden>
      <span className="h-0 w-0 border-x-[5px] border-b-[9px] border-x-transparent border-b-amber-900" />
    </span>
  );
}

export function ProductGrid({
  branchId,
  search,
  quantities = {},
  onSelect,
  onDecrease,
}: {
  branchId: string | null;
  search: string;
  /** Units of each dish already on the open bill, keyed by menu item id. */
  quantities?: Record<string, number>;
  onSelect: (item: MenuItem) => void;
  /** Remove one of this dish. At one, the line leaves the bill. */
  onDecrease: (item: MenuItem) => void;
}) {
  const { data: categories } = useCategories(branchId);
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(undefined);
  const [nowMin, setNowMin] = useState(minutesNow);
  const { data: items, isLoading, isError, error, refetch, isFetching } = useMenuItems(branchId, activeCategoryId);

  useEffect(() => {
    const id = setInterval(() => setNowMin(minutesNow()), 30_000);
    return () => clearInterval(id);
  }, []);

  const filtered = items?.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  const categoryChoices = [
    { id: undefined as string | undefined, name: "All", count: undefined as number | undefined },
    ...(categories ?? []).map((c) => ({
      id: c.id as string | undefined,
      name: c.name,
      count: c._count.items as number | undefined,
    })),
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {categories && categories.length > 0 && (
        <div
          className="flex gap-2 overflow-x-auto overscroll-x-contain"
          role="group"
          aria-label="Category"
        >
          {categoryChoices.map((c) => {
            const active = c.id === activeCategoryId;
            return (
              <button
                key={c.id ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveCategoryId(c.id)}
                className={cn(
                  "flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 text-sm font-medium",
                  active
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground",
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col">
            {isError && !items ? (
              <QueryError error={error} what="the menu" onRetry={() => void refetch()} retrying={isFetching} />
            ) : (
              <div className="grid flex-1 auto-rows-min grid-cols-2 gap-3 overflow-y-auto pb-24 sm:grid-cols-3 sm:gap-4 lg:grid-cols-[repeat(auto-fill,minmax(168px,1fr))] lg:pb-4">
                {isLoading &&
                  Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
                {filtered?.map((item) => {
                  const unavailable =
                    !item.isActive || outsideServingWindow(item.availableFrom, item.availableTo, nowMin);
                  const qty = quantities[item.id] ?? 0;
                  const hasOptions = item.modifierGroups.length > 0;
                  const half = item.halfPrice != null && item.halfPrice !== "" ? item.halfPrice : null;
                  const choice = hasOptions ? "Options" : half != null ? "Half" : null;
                  const detail = extraDiet(item) ?? SPICE_LABEL[item.spiceLevel];
                  const prep = item.prepTimeMinutes != null && item.prepTimeMinutes > 0 ? item.prepTimeMinutes : null;
                  const dietWord = item.isVeg ? "Veg" : "Non-veg";
                  const onBill = qty > 0 && !unavailable;
                  const body = (
                    <>
                      {item.imageUrl ? (
                        <UploadImage
                          src={item.imageUrl}
                          alt=""
                          width={320}
                          height={200}
                          sizes="(min-width: 640px) 240px, 1px"
                          className="hidden aspect-[16/10] w-full object-cover sm:block"
                        />
                      ) : null}
                      <span className="flex min-w-0 flex-1 flex-col gap-1.5 p-3 text-left">
                        <span className="flex w-full min-w-0 items-start gap-2">
                          <DietMark veg={item.isVeg} />
                          <span className="line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-tight text-foreground">
                            {item.name}
                          </span>
                          {onBill ? (
                            <span className="flex shrink-0 items-center">
                              <button
                                type="button"
                                aria-label={`Remove one ${item.name}`}
                                onClick={() => onDecrease(item)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border"
                              >
                                <Minus className="h-4 w-4" aria-hidden />
                              </button>
                              <span className="w-6 text-center text-sm font-medium tabular-nums text-primary">{qty}</span>
                              <button
                                type="button"
                                aria-label={hasOptions || half != null ? `Choose ${item.name}` : `Add one ${item.name}`}
                                onClick={() => onSelect(item)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border"
                              >
                                <Plus className="h-4 w-4" aria-hidden />
                              </button>
                            </span>
                          ) : null}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {unavailable ? (
                            "Unavailable"
                          ) : (
                            <>
                              {dietWord}
                              {detail ? <span className="hidden sm:inline"> · {detail}</span> : null}
                              {choice === "Options" ? <span> · Options</span> : null}
                              {choice === "Half" ? <span className="sm:hidden"> · Half</span> : null}
                            </>
                          )}
                        </span>
                        <span className="mt-auto flex w-full items-baseline justify-between gap-2">
                          <span className="text-sm font-semibold tabular-nums text-foreground">
                            {formatCurrency(item.price)}
                          </span>
                          {half != null && !unavailable ? (
                            <span className="hidden text-xs tabular-nums text-muted-foreground sm:inline">
                              Half {formatCurrency(half)}
                            </span>
                          ) : null}
                        </span>
                        {prep != null && !unavailable ? (
                          <span className="hidden text-xs text-muted-foreground lg:block">{prep} min</span>
                        ) : null}
                      </span>
                    </>
                  );
                  const shell = cn(
                    "flex min-h-24 min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm",
                    unavailable && "cursor-not-allowed opacity-60",
                    onBill && "relative border-primary",
                  );
                  if (onBill) {
                    return (
                      <article key={item.id} className={shell}>
                        <button
                          type="button"
                          onClick={() => onSelect(item)}
                          aria-label={`${item.name}, ${formatCurrency(item.price)}, ${qty} on the bill`}
                          className="flex min-w-0 flex-1 flex-col text-left"
                        >
                          {item.imageUrl ? (
                            <UploadImage
                              src={item.imageUrl}
                              alt=""
                              width={320}
                              height={200}
                              sizes="(min-width: 640px) 240px, 1px"
                              className="hidden aspect-[16/10] w-full object-cover sm:block"
                            />
                          ) : null}
                          <span className="flex min-w-0 flex-1 flex-col gap-1.5 p-3 pr-[7.5rem] text-left">
                            <span className="flex w-full min-w-0 items-start gap-2">
                              <DietMark veg={item.isVeg} />
                              <span className="line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-tight text-foreground">
                                {item.name}
                              </span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {dietWord}
                              {detail ? <span className="hidden sm:inline"> · {detail}</span> : null}
                              {choice === "Options" ? <span> · Options</span> : null}
                              {choice === "Half" ? <span className="sm:hidden"> · Half</span> : null}
                            </span>
                            <span className="mt-auto flex w-full items-baseline justify-between gap-2">
                              <span className="text-sm font-semibold tabular-nums text-foreground">
                                {formatCurrency(item.price)}
                              </span>
                              {half != null ? (
                                <span className="hidden text-xs tabular-nums text-muted-foreground sm:inline">
                                  Half {formatCurrency(half)}
                                </span>
                              ) : null}
                            </span>
                            {prep != null ? (
                              <span className="hidden text-xs text-muted-foreground lg:block">{prep} min</span>
                            ) : null}
                          </span>
                        </button>
                        <span className="absolute right-2 top-3 z-10 flex items-center">
                          <button
                            type="button"
                            aria-label={`Remove one ${item.name}`}
                            onClick={() => onDecrease(item)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card"
                          >
                            <Minus className="h-4 w-4" aria-hidden />
                          </button>
                          <span className="w-6 text-center text-sm font-medium tabular-nums text-primary">{qty}</span>
                          <button
                            type="button"
                            aria-label={hasOptions || half != null ? `Choose ${item.name}` : `Add one ${item.name}`}
                            onClick={() => onSelect(item)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card"
                          >
                            <Plus className="h-4 w-4" aria-hidden />
                          </button>
                        </span>
                      </article>
                    );
                  }
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={unavailable}
                      onClick={() => onSelect(item)}
                      aria-label={unavailable ? `${item.name}, unavailable` : `${item.name}, ${formatCurrency(item.price)}`}
                      className={cn(shell, "transition-colors active:scale-[0.98] disabled:cursor-not-allowed")}
                    >
                      {body}
                    </button>
                  );
                })}
                {filtered?.length === 0 && !isLoading && (
                  <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
                    {search ? <>No items match &quot;{search}&quot;</> : "No items in this category yet"}
                  </p>
                )}
              </div>
            )}
          </div>
    </div>
  );
}
