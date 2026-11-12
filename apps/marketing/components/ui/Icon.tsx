import {
  BarChart3,
  Bike,
  BookOpen,
  Calculator,
  ChefHat,
  Cloud,
  CloudCog,
  Coffee,
  CreditCard,
  Croissant,
  Gift,
  Headset,
  Heart,
  Hotel,
  IndianRupee,
  LayoutGrid,
  Package,
  Plug,
  Receipt,
  ShoppingBag,
  Sparkles,
  Users,
  UtensilsCrossed,
  Wifi,
  WifiOff,
  Wine,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/config/site";

const icons: Record<IconName, LucideIcon> = {
  utensils: UtensilsCrossed,
  coffee: Coffee,
  "cloud-kitchen": CloudCog,
  croissant: Croissant,
  zap: Zap,
  wine: Wine,
  hotel: Hotel,
  receipt: Receipt,
  "layout-grid": LayoutGrid,
  "chef-hat": ChefHat,
  package: Package,
  "book-open": BookOpen,
  "bar-chart": BarChart3,
  users: Users,
  heart: Heart,
  "shopping-bag": ShoppingBag,
  "credit-card": CreditCard,
  calculator: Calculator,
  bike: Bike,
  gift: Gift,
  "wifi-off": WifiOff,
  cloud: Cloud,
  sparkles: Sparkles,
  "indian-rupee": IndianRupee,
  headset: Headset,
  plug: Plug,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = icons[name] ?? Wifi;
  return <Cmp className={className} aria-hidden />;
}

/** Icon in a soft rounded tile. */
export function IconTile({
  name,
  tone = "saffron",
  className,
}: {
  name: IconName;
  tone?: "saffron" | "herb";
  className?: string;
}) {
  return (
    <span
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-[14px] ${
        tone === "saffron" ? "bg-saffron-soft text-brand" : "bg-herb-soft text-herb"
      } ${className ?? ""}`}
    >
      <Icon name={name} className="size-5" />
    </span>
  );
}
