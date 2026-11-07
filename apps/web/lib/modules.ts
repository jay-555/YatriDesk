export const MODULE_PAGES: { href: string; key: string }[] = [
  { href: "/inventory/procurement", key: "procurement" },
  { href: "/inventory/purchase-orders", key: "procurement" },
  { href: "/inventory/suppliers", key: "procurement" },
  { href: "/inventory", key: "inventory" },
  { href: "/operations", key: "equipment" },
];

/** Longest matching module page. Unlisted paths stay available. */
export function moduleKeyForPath(pathname: string): string | undefined {
  let best: { href: string; key: string } | undefined;
  for (const page of MODULE_PAGES) {
    if (pathname === page.href || pathname.startsWith(`${page.href}/`)) {
      if (!best || page.href.length > best.href.length) best = page;
    }
  }
  return best?.key;
}

export function modulePageAllowed(
  pathname: string,
  flags: Record<string, boolean> | undefined,
): boolean {
  if (!flags) return true;
  const key = moduleKeyForPath(pathname);
  return !key || flags[key] !== false;
}
