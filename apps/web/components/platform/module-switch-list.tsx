"use client";

import { Switch } from "@/components/ui/switch";

export interface ModuleSwitchRow {
  key: string;
  label: string;
  enabled: boolean;
  globalEnabled?: boolean;
}

export function ModuleSwitchList({
  rows,
  pendingKey,
  onToggle,
}: {
  rows: ModuleSwitchRow[];
  pendingKey: string | null;
  onToggle: (key: string, enabled: boolean) => void;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => {
        const locked = row.globalEnabled === false;
        return (
          <li
            key={row.key}
            className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-medium text-foreground">{row.label}</p>
              {locked && (
                <p className="text-xs text-muted-foreground">Off for every restaurant</p>
              )}
            </div>
            <Switch
              checked={locked ? false : row.enabled}
              disabled={locked || pendingKey === row.key}
              onCheckedChange={(enabled) => onToggle(row.key, enabled)}
              aria-label={row.label}
            />
          </li>
        );
      })}
    </ul>
  );
}
