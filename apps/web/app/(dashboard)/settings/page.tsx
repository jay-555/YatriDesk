"use client";

import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast as sonner } from "sonner";
import { toast } from "@/lib/toast";
import {
  RESTAURANT_NAME_MAX_LENGTH,
  TAX_REGIME_PRESETS,
  TAX_REGIMES,
  type TaxMode,
  type TaxRegime,
} from "@yatrideesk/types";
import { KioskCard } from "@/components/settings/kiosk-card";
import { MobileAppCard } from "@/components/settings/mobile-app-card";
import { PrinterDiagnosticsCard } from "@/components/settings/printer-diagnostics-card";
import { BluetoothPrinterCard } from "@/components/settings/bluetooth-printer-card";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useBranch } from "@/hooks/use-branch";
import { useFeatures } from "@/hooks/use-features";
import { useNotificationMute } from "@/hooks/use-notification-mute";
import {
  useAddBranchClosure,
  useBranchHours,
  useRemoveBranchClosure,
  useReplaceBranchHours,
  useSettings,
  useUpdateBranchSettings,
  useUpdateRestaurantSettings,
  useUploadRestaurantLogo,
  type BranchSettings,
  type RestaurantSettings,
} from "@/hooks/use-settings";
import { ApiError } from "@/lib/api";

export default function SettingsPage() {
  const { branchId } = useBranch();
  const { data, isLoading } = useSettings(branchId);
  const features = useFeatures();
  const saas = features.data?.saasMode === true;
  const kioskOn = features.data?.flags.kiosk !== false;
  const onlineOn = features.data?.flags.onlineOrdering !== false;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[32px] font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Restaurant, branch, and staff configuration</p>
      </div>

      <SettingsTabs />

      {isLoading || !data ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      ) : (
        <GeneralSettingsForm
          key={`${data.restaurant.id}-${data.branch.id}`}
          restaurant={data.restaurant}
          branch={data.branch}
          branchId={branchId}
        />
      )}

      {onlineOn && data && <OnlineOrdersCard key={data.branch.id} branchId={branchId} branch={data.branch} />}

      {kioskOn && data && <KioskCard key={`kiosk-${data.branch.id}`} branchId={branchId} branch={data.branch} />}

      <NotificationSettingsCard />

      {!saas && <BluetoothPrinterCard />}
      {!saas && <PrinterDiagnosticsCard />}
      <MobileAppCard />
    </div>
  );
}

function OnlineOrdersCard({
  branchId,
  branch,
}: {
  branchId: string | null;
  branch: { autoConfirmOrders: boolean; autoConfirmReservations: boolean };
}) {
  const update = useUpdateBranchSettings(branchId);
  const save = (dto: { autoConfirmOrders?: boolean; autoConfirmReservations?: boolean }) =>
    update.mutate(dto, {
      onSuccess: () => toast.success("Saved"),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Could not save"),
    });

  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-6">
      <div>
        <h2 className="text-[18px] font-medium text-foreground">Online orders &amp; table bookings</h2>
        <p className="text-sm text-muted-foreground">
          Choose whether orders and bookings from your website are accepted automatically or wait for
          you to accept them. You can always cancel an order or booking from its window.
        </p>
      </div>
      <div className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="auto-confirm-orders">Auto-confirm online orders</Label>
          <p className="text-xs text-muted-foreground">
            Off = each new order rings, then waits for you to Accept or Reject before it reaches the
            kitchen. On = sent to the kitchen straight away.
          </p>
        </div>
        <Switch
          id="auto-confirm-orders"
          checked={branch.autoConfirmOrders}
          disabled={update.isPending}
          onCheckedChange={(v) => save({ autoConfirmOrders: v })}
        />
      </div>
      <div className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="auto-confirm-bookings">Auto-confirm table bookings</Label>
          <p className="text-xs text-muted-foreground">
            Off = new bookings wait for you to Accept. On = confirmed automatically.
          </p>
        </div>
        <Switch
          id="auto-confirm-bookings"
          checked={branch.autoConfirmReservations}
          disabled={update.isPending}
          onCheckedChange={(v) => save({ autoConfirmReservations: v })}
        />
      </div>
    </Card>
  );
}

function NotificationSettingsCard() {
  const [muted, toggleMuted] = useNotificationMute();

  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-6">
      <div>
        <h2 className="text-[18px] font-medium text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          New orders, table reservations, and kitchen tickets on this device.
        </p>
      </div>
      <div className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="notification-sound">Notification sound</Label>
          <p className="text-xs text-muted-foreground">
            Plays a chime for new orders, reservations, and kitchen display
            tickets. This only affects this device/browser — mute the
            kitchen display separately from the office if needed.
          </p>
        </div>
        <Switch
          id="notification-sound"
          checked={!muted}
          onCheckedChange={() => toggleMuted()}
        />
      </div>
    </Card>
  );
}

function GeneralSettingsForm({
  restaurant,
  branch,
  branchId,
}: {
  restaurant: RestaurantSettings;
  branch: BranchSettings;
  branchId: string | null;
}) {
  const [name, setName] = useState(restaurant.name);
  const [legalName, setLegalName] = useState(restaurant.legalName ?? "");
  const [pan, setPan] = useState(restaurant.pan ?? "");
  const [logoUrl, setLogoUrl] = useState<string | null>(restaurant.logoUrl);
  const [currency, setCurrency] = useState(restaurant.currency);
  const [timezone, setTimezone] = useState(restaurant.timezone);
  const [upiVpa, setUpiVpa] = useState(restaurant.upiVpa ?? "");
  const [upiPayeeName, setUpiPayeeName] = useState(restaurant.upiPayeeName ?? "");
  const [loyaltyPointValue, setLoyaltyPointValue] = useState(restaurant.loyaltyPointValue);
  const [loyaltyEarnPerCurrency, setLoyaltyEarnPerCurrency] = useState(
    String(restaurant.loyaltyEarnPerCurrency),
  );
  const [referralEnabled, setReferralEnabled] = useState(!!restaurant.referralEnabled);
  const [referralSharerPoints, setReferralSharerPoints] = useState(String(restaurant.referralSharerPoints ?? 15));
  const [referralReferredPoints, setReferralReferredPoints] = useState(String(restaurant.referralReferredPoints ?? 10));
  const [referralMinPurchase, setReferralMinPurchase] = useState(String(Number(restaurant.referralMinPurchase ?? 200)));
  const [onlineMinOrder, setOnlineMinOrder] = useState(String(Number(restaurant.onlineMinOrderAmount ?? 0)));
  const initialAdjust = Number(restaurant.onlinePriceAdjustValue ?? 0);
  const [adjustKind, setAdjustKind] = useState<"PERCENT" | "AMOUNT">(restaurant.onlinePriceAdjustKind ?? "PERCENT");
  const [adjustDir, setAdjustDir] = useState<"cheaper" | "costlier">(initialAdjust < 0 ? "cheaper" : "costlier");
  const [adjustValue, setAdjustValue] = useState(String(Math.abs(initialAdjust)));
  const [maxDiscount, setMaxDiscount] = useState(String(Number(restaurant.maxManualDiscountPercent ?? 100)));
  const [requireReason, setRequireReason] = useState(!!restaurant.requireDiscountReason);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const uploadLogo = useUploadRestaurantLogo();

  const [branchName, setBranchName] = useState(branch.name);
  const [address, setAddress] = useState(branch.address ?? "");
  const [phone, setPhone] = useState(branch.phone ?? "");
  const [country, setCountry] = useState(branch.country);
  const [taxRegime, setTaxRegime] = useState<TaxRegime>(branch.taxRegime);
  const [taxMode, setTaxMode] = useState<TaxMode>(branch.taxMode);
  const [taxLabel, setTaxLabel] = useState(branch.taxLabel ?? "");
  const [taxId, setTaxId] = useState(
    branch.taxRegime === "INDIA_GST" ? branch.taxId || branch.gstNumber || "" : (branch.taxId ?? ""),
  );
  const [fssaiNumber, setFssaiNumber] = useState(branch.fssaiNumber ?? "");
  const [gstScheme, setGstScheme] = useState<"REGULAR" | "COMPOSITION">(branch.gstScheme ?? "REGULAR");
  const [invoicePrefix, setInvoicePrefix] = useState(branch.invoicePrefix ?? "");
  const [temporarilyClosed, setTemporarilyClosed] = useState(branch.temporarilyClosed);
  const [posDefaultService, setPosDefaultService] = useState<"DINE_IN" | "TAKEAWAY">(
    branch.posDefaultService === "TAKEAWAY" ? "TAKEAWAY" : "DINE_IN",
  );
  const [hourDraft, setHourDraft] = useState<{ open: string; close: string } | null>(null);
  const [closureDate, setClosureDate] = useState("");
  const hoursQuery = useBranchHours(branchId);
  const savedWindow = hoursQuery.data?.hours[0];
  const openTime = hourDraft?.open ?? (savedWindow ? savedWindow.openTime.slice(0, 5) : "");
  const closeTime = hourDraft?.close ?? (savedWindow ? savedWindow.closeTime.slice(0, 5) : "");
  const replaceHours = useReplaceBranchHours(branchId);
  const addClosure = useAddBranchClosure(branchId);
  const removeClosure = useRemoveBranchClosure(branchId);

  const preset = TAX_REGIME_PRESETS[taxRegime];
  const moduleFlags = useFeatures().data?.flags;
  const referralsOn = moduleFlags?.referrals !== false;
  const onlineOrderingOn = moduleFlags?.onlineOrdering !== false;

  const updateRestaurant = useUpdateRestaurantSettings(branchId);
  const updateBranch = useUpdateBranchSettings(branchId);
  const [restaurantErrors, setRestaurantErrors] = useState<
    Partial<Record<"name" | "currency" | "timezone" | "upiVpa", string>>
  >({});
  const [branchErrors, setBranchErrors] = useState<
    Partial<Record<"name" | "country" | "fssai" | "invoicePrefix" | "hours", string>>
  >({});

  const onSubmitRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof restaurantErrors = {};
    if (!name.trim()) next.name = "Enter the restaurant name";
    else if (name.trim().length > RESTAURANT_NAME_MAX_LENGTH) {
      next.name = `Name must be ${RESTAURANT_NAME_MAX_LENGTH} characters or fewer`;
    }
    if (!/^[A-Za-z]{3}$/.test(currency.trim())) {
      next.currency = "Currency must be 3 letters, like INR";
    }
    if (!timezone.trim()) next.timezone = "Enter a timezone, like Asia/Kolkata";
    const upi = upiVpa.trim();
    if (upi && !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9]{1,64}$/.test(upi)) {
      next.upiVpa = "Enter a valid UPI id like name@bank";
    }
    setRestaurantErrors(next);
    if (Object.keys(next).length > 0) {
      sonner.error(Object.values(next).join(". "));
      return;
    }
    updateRestaurant.mutate(
      {
        name,
        legalName: legalName || undefined,
        pan: pan.trim().toUpperCase() || null,
        logoUrl,
        currency,
        timezone,
        upiVpa: upiVpa.trim() || null,
        upiPayeeName: upiPayeeName.trim() || null,
        loyaltyPointValue: Number(loyaltyPointValue) || 0,
        loyaltyEarnPerCurrency: Number(loyaltyEarnPerCurrency) || 1,
        referralEnabled,
        referralSharerPoints: Math.max(Math.floor(Number(referralSharerPoints) || 0), 0),
        referralReferredPoints: Math.max(Math.floor(Number(referralReferredPoints) || 0), 0),
        referralMinPurchase: Math.max(Number(referralMinPurchase) || 0, 0),
        onlineMinOrderAmount: Math.max(Number(onlineMinOrder) || 0, 0),
        onlinePriceAdjustKind: adjustKind,
        onlinePriceAdjustValue: (adjustDir === "cheaper" ? -1 : 1) * Math.abs(Number(adjustValue) || 0),
        maxManualDiscountPercent: Math.min(Math.max(Number(maxDiscount) || 0, 0), 100),
        requireDiscountReason: requireReason,
      },
      {
        onSuccess: () => sonner.success("Restaurant details saved"),
        onError: (err) =>
          sonner.error(err instanceof ApiError ? err.message : "Could not save restaurant details"),
      },
    );
  };

  const onSubmitBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof branchErrors = {};
    if (!branchName.trim()) next.name = "Enter the branch name";
    if (!/^[A-Za-z]{2}$/.test(country.trim())) {
      next.country = "Country code must be 2 letters, like IN";
    }
    const fssai = fssaiNumber.trim();
    if (taxRegime === "INDIA_GST" && fssai && !/^\d{14}$/.test(fssai)) {
      next.fssai = "FSSAI must be 14 digits";
    }
    const prefix = invoicePrefix.trim().toUpperCase();
    if (prefix && !/^[A-Z0-9]{1,4}$/.test(prefix)) {
      next.invoicePrefix = "Invoice prefix must be 1 to 4 letters or digits";
    }
    if ((openTime && !closeTime) || (!openTime && closeTime)) {
      next.hours = "Enter both an opening time and a closing time";
    }
    setBranchErrors(next);
    if (Object.keys(next).length > 0) {
      sonner.error(Object.values(next).join(". "));
      return;
    }
    const registration = taxId.trim();
    updateBranch.mutate(
      {
        name: branchName,
        address: address || undefined,
        phone: phone || undefined,
        country,
        taxRegime,
        taxMode,
        taxLabel: taxLabel || null,
        taxId: registration || null,
        invoicePrefix: prefix || null,
        temporarilyClosed,
        posDefaultService,
        ...(taxRegime === "INDIA_GST"
          ? {
              gstNumber: registration,
              fssaiNumber: fssai || null,
              gstScheme,
            }
          : {}),
      },
      {
        onSuccess: () => {
          const finish = () => sonner.success("Branch details saved");
          if (!openTime || !closeTime) {
            finish();
            return;
          }
          replaceHours.mutate(
            { openTime, closeTime },
            {
              onSuccess: finish,
              onError: (err) =>
                sonner.error(err instanceof ApiError ? err.message : "Could not save opening hours"),
            },
          );
        },
        onError: (err) =>
          sonner.error(err instanceof ApiError ? err.message : "Could not save branch details"),
      },
    );
  };

  const onAddClosure = () => {
    if (!closureDate) {
      sonner.error("Choose the date this branch is closed to guests");
      return;
    }
    addClosure.mutate(closureDate, {
      onSuccess: () => {
        setClosureDate("");
        sonner.success(`Closed on ${closureDate}`);
      },
      onError: (err) =>
        sonner.error(err instanceof ApiError ? err.message : "Could not add the closure"),
    });
  };

  const onRegimeChange = (value: TaxRegime | null) => {
    if (!value) return;
    setTaxRegime(value);
    // Switching regimes resets to that regime's own mode/country by
    // default — a picker that silently kept the old mode would quietly
    // mis-price every item on this branch (see settings.service.ts).
    setTaxMode(TAX_REGIME_PRESETS[value].defaultMode);
    setCountry(TAX_REGIME_PRESETS[value].defaultCountry);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4 p-4 sm:p-6">
        <h2 className="text-[18px] font-medium text-foreground">Restaurant</h2>
        <form onSubmit={onSubmitRestaurant} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Logo</Label>
            <div className="flex items-center gap-4">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  uploadLogo.mutate(file, {
                    onSuccess: (res) => setLogoUrl(res.url),
                    onError: (err) =>
                      toast.error(err instanceof ApiError ? err.message : "Could not upload logo"),
                  });
                }}
              />
              {logoUrl ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element -- uploaded asset served from the backend, not a Next-optimizable remote source */}
                  <img src={logoUrl} alt="" className="h-full w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoUrl(null);
                      if (logoInputRef.current) logoInputRef.current.value = "";
                    }}
                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-foreground"
                    aria-label="Remove logo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadLogo.isPending}
                  className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary"
                >
                  <ImagePlus className="h-4 w-4" />
                  <span className="text-[10px]">
                    {uploadLogo.isPending ? "Uploading…" : "Upload"}
                  </span>
                </button>
              )}
              <p className="text-xs text-muted-foreground">
                Shows in the app sidebar and login screen instead of the YatriDesk mark.
                Square, at least 256×256px, PNG with a transparent background works best.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="r-name">Name</Label>
            <Input
              id="r-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value.slice(0, RESTAURANT_NAME_MAX_LENGTH));
                setRestaurantErrors((prev) => ({ ...prev, name: undefined }));
              }}
              maxLength={RESTAURANT_NAME_MAX_LENGTH}
              aria-invalid={Boolean(restaurantErrors.name)}
            />
            {restaurantErrors.name ? (
              <p className="text-xs text-destructive">{restaurantErrors.name}</p>
            ) : (
              <p className="text-right text-xs text-muted-foreground">
                {name.length}/{RESTAURANT_NAME_MAX_LENGTH}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-legal">Legal name</Label>
              <Input id="r-legal" value={legalName} onChange={(e) => setLegalName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-pan">PAN</Label>
              <Input
                id="r-pan"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                maxLength={10}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-currency">Currency</Label>
              <Input
                id="r-currency"
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value.toUpperCase());
                  setRestaurantErrors((prev) => ({ ...prev, currency: undefined }));
                }}
                maxLength={3}
                aria-invalid={Boolean(restaurantErrors.currency)}
              />
              {restaurantErrors.currency && (
                <p className="text-xs text-destructive">{restaurantErrors.currency}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-timezone">Timezone</Label>
              <Input
                id="r-timezone"
                value={timezone}
                onChange={(e) => {
                  setTimezone(e.target.value);
                  setRestaurantErrors((prev) => ({ ...prev, timezone: undefined }));
                }}
                aria-invalid={Boolean(restaurantErrors.timezone)}
              />
              {restaurantErrors.timezone && (
                <p className="text-xs text-destructive">{restaurantErrors.timezone}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <h3 className="text-sm font-medium text-foreground">Loyalty program</h3>
            <p className="text-xs text-muted-foreground">
              How customers earn and redeem points at checkout.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-loyalty-earn">Earn 1 point per</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{currency}</span>
                <Input
                  id="r-loyalty-earn"
                  type="number"
                  min="1"
                  step="1"
                  value={loyaltyEarnPerCurrency}
                  onChange={(e) => setLoyaltyEarnPerCurrency(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-loyalty-value">1 point redeems for</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{currency}</span>
                <Input
                  id="r-loyalty-value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={loyaltyPointValue}
                  onChange={(e) => setLoyaltyPointValue(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {referralsOn && <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-sm font-medium text-foreground">Referral rewards</h3>
                <p className="text-xs text-muted-foreground">
                  Customers share a dish or their personal link. Points are paid only after the new customer&apos;s
                  first purchase is paid. Points are worth the &ldquo;1 point redeems for&rdquo; amount above
                  (for 100 points = {currency} 10, enter 0.10).
                </p>
              </div>
              <Switch
                id="r-referral-enabled"
                aria-label="Enable referral rewards"
                checked={referralEnabled}
                onCheckedChange={setReferralEnabled}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="r-referral-sharer">Points for the customer who shares</Label>
                <Input
                  id="r-referral-sharer"
                  type="number"
                  min="0"
                  step="1"
                  disabled={!referralEnabled}
                  value={referralSharerPoints}
                  onChange={(e) => setReferralSharerPoints(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="r-referral-referred">Points for the new customer</Label>
                <Input
                  id="r-referral-referred"
                  type="number"
                  min="0"
                  step="1"
                  disabled={!referralEnabled}
                  value={referralReferredPoints}
                  onChange={(e) => setReferralReferredPoints(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-referral-min">Minimum food value of the first order for rewards ({currency})</Label>
              <Input
                id="r-referral-min"
                type="number"
                min="0"
                step="1"
                disabled={!referralEnabled}
                value={referralMinPurchase}
                onChange={(e) => setReferralMinPurchase(e.target.value)}
              />
            </div>
          </div>}

          {onlineOrderingOn && (<>
          <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">Website food prices</h3>
              <p className="text-xs text-muted-foreground">
                Make every dish cheaper or costlier for customers ordering on your website, by a percentage or a fixed
                amount. In-restaurant, POS and marketplace prices do not change. Leave at 0 for no change.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="r-adjust-dir">Make prices</Label>
                <select
                  id="r-adjust-dir"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={adjustDir}
                  onChange={(e) => setAdjustDir(e.target.value as "cheaper" | "costlier")}
                >
                  <option value="cheaper">Cheaper</option>
                  <option value="costlier">Costlier</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="r-adjust-kind">By</Label>
                <select
                  id="r-adjust-kind"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={adjustKind}
                  onChange={(e) => setAdjustKind(e.target.value as "PERCENT" | "AMOUNT")}
                >
                  <option value="PERCENT">Percentage (%)</option>
                  <option value="AMOUNT">Amount ({currency} per dish)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="r-adjust-value">{adjustKind === "PERCENT" ? "Percent" : `Amount (${currency})`}</Label>
                <Input
                  id="r-adjust-value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={adjustValue}
                  onChange={(e) => setAdjustValue(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {Number(adjustValue) > 0
                ? `A ${currency} 100 dish will cost ${currency} ${Math.max(
                    Math.round(
                      (adjustKind === "PERCENT"
                        ? 100 * (1 + ((adjustDir === "cheaper" ? -1 : 1) * Number(adjustValue)) / 100)
                        : 100 + (adjustDir === "cheaper" ? -1 : 1) * Number(adjustValue)) * 100,
                    ) / 100,
                    0,
                  )} on the website.`
                : "No change to website prices."}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="r-online-min">Smallest online order accepted ({currency}, 0 = no minimum)</Label>
            <Input
              id="r-online-min"
              type="number"
              min="0"
              step="1"
              value={onlineMinOrder}
              onChange={(e) => setOnlineMinOrder(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Orders from your website or the API below this amount are refused. Marketplace orders (Zomato, Swiggy)
              and table QR orders are not affected.
            </p>
          </div>
          </>)}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-max-discount">Highest cashier discount (%)</Label>
              <Input
                id="r-max-discount"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                100 means no limit. Owners, administrators and roles with “Discount Above the Cashier Limit” can go higher.
              </p>
            </div>
            <label className="flex items-start gap-2 text-sm sm:pt-7">
              <input
                type="checkbox"
                className="mt-1"
                checked={requireReason}
                onChange={(e) => setRequireReason(e.target.checked)}
              />
              Require a reason for every discount
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-upi">UPI id (for QR payments)</Label>
              <Input
                id="r-upi"
                value={upiVpa}
                onChange={(e) => {
                  setUpiVpa(e.target.value);
                  setRestaurantErrors((prev) => ({ ...prev, upiVpa: undefined }));
                }}
                placeholder="yourshop@okbank"
                autoComplete="off"
                aria-invalid={Boolean(restaurantErrors.upiVpa)}
              />
              {restaurantErrors.upiVpa && (
                <p className="text-xs text-destructive">{restaurantErrors.upiVpa}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Shown as a scannable QR at checkout and on the customer display, with the exact bill amount filled in.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-upi-name">UPI payee name</Label>
              <Input
                id="r-upi-name"
                value={upiPayeeName}
                onChange={(e) => setUpiPayeeName(e.target.value)}
                placeholder={name}
                maxLength={60}
              />
            </div>
          </div>

          <Button type="submit" disabled={updateRestaurant.isPending} className="w-full self-start sm:w-auto">
            {updateRestaurant.isPending ? "Saving…" : "Save restaurant"}
          </Button>
        </form>
      </Card>

      <Card className="flex flex-col gap-4 p-4 sm:p-6">
        <h2 className="text-[18px] font-medium text-foreground">This branch</h2>
        <form onSubmit={onSubmitBranch} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="b-name">Branch name</Label>
            <Input
              id="b-name"
              value={branchName}
              onChange={(e) => {
                setBranchName(e.target.value);
                setBranchErrors((prev) => ({ ...prev, name: undefined }));
              }}
              aria-invalid={Boolean(branchErrors.name)}
            />
            {branchErrors.name && <p className="text-xs text-destructive">{branchErrors.name}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="b-address">Address</Label>
            <Input id="b-address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="b-phone">Phone</Label>
            <Input id="b-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <h3 className="text-sm font-medium text-foreground">Tax</h3>
            <p className="text-xs text-muted-foreground">
              Picks how menu prices and receipts handle tax for this branch.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="b-tax-regime">Region / regime</Label>
              <Select value={taxRegime} onValueChange={onRegimeChange}>
                <SelectTrigger id="b-tax-regime" className="w-full">
                  <SelectValue>
                    {(value: TaxRegime | null) =>
                      value ? TAX_REGIME_PRESETS[value].displayName : "Select a region"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TAX_REGIMES.map((regime) => (
                    <SelectItem key={regime} value={regime}>
                      {TAX_REGIME_PRESETS[regime].displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="b-tax-mode">Menu prices are</Label>
              <Select value={taxMode} onValueChange={(v) => setTaxMode(v as TaxMode)}>
                <SelectTrigger id="b-tax-mode" className="w-full">
                  <SelectValue>
                    {(value: TaxMode | null) =>
                      value === "EXCLUSIVE"
                        ? "Tax-exclusive (tax added at checkout)"
                        : "Tax-inclusive"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCLUSIVE">Tax-inclusive</SelectItem>
                  <SelectItem value="EXCLUSIVE">Tax-exclusive (tax added at checkout)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {preset.exampleRates} — set the exact rate per menu item under Menu.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="b-country">Country code</Label>
              <Input
                id="b-country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value.toUpperCase());
                  setBranchErrors((prev) => ({ ...prev, country: undefined }));
                }}
                maxLength={2}
                aria-invalid={Boolean(branchErrors.country)}
              />
              {branchErrors.country && (
                <p className="text-xs text-destructive">{branchErrors.country}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="b-tax-id">{TAX_REGIME_PRESETS[taxRegime].taxIdLabel}</Label>
              <Input
                id="b-tax-id"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value.toUpperCase())}
                maxLength={50}
              />
            </div>
          </div>
          {taxRegime === "INDIA_GST" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="b-fssai">FSSAI</Label>
                <Input
                  id="b-fssai"
                  value={fssaiNumber}
                  onChange={(e) => {
                    setFssaiNumber(e.target.value.replace(/\D/g, "").slice(0, 14));
                    setBranchErrors((prev) => ({ ...prev, fssai: undefined }));
                  }}
                  inputMode="numeric"
                  maxLength={14}
                  placeholder="14 digits"
                  aria-invalid={Boolean(branchErrors.fssai)}
                />
                {branchErrors.fssai && (
                  <p className="text-xs text-destructive">{branchErrors.fssai}</p>
                )}
              </div>
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium text-foreground">GST scheme</legend>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gst-scheme"
                    checked={gstScheme === "REGULAR"}
                    onChange={() => setGstScheme("REGULAR")}
                  />
                  Regular GST
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gst-scheme"
                    checked={gstScheme === "COMPOSITION"}
                    onChange={() => setGstScheme("COMPOSITION")}
                  />
                  Composition scheme (bill of supply)
                </label>
              </fieldset>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="b-prefix">Invoice prefix</Label>
              <Input
                id="b-prefix"
                value={invoicePrefix}
                onChange={(e) => {
                  setInvoicePrefix(e.target.value.toUpperCase().slice(0, 4));
                  setBranchErrors((prev) => ({ ...prev, invoicePrefix: undefined }));
                }}
                maxLength={4}
                placeholder="BLR1"
                aria-invalid={Boolean(branchErrors.invoicePrefix)}
              />
              {branchErrors.invoicePrefix && (
                <p className="text-xs text-destructive">{branchErrors.invoicePrefix}</p>
              )}
            </div>
            <fieldset className="flex flex-col gap-2 sm:pt-1">
              <legend className="text-sm font-medium text-foreground">Billing starts on</legend>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="pos-default-service"
                  checked={posDefaultService === "DINE_IN"}
                  onChange={() => setPosDefaultService("DINE_IN")}
                />
                Dine-in (table grid)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="pos-default-service"
                  checked={posDefaultService === "TAKEAWAY"}
                  onChange={() => setPosDefaultService("TAKEAWAY")}
                />
                Takeaway (menu, no table)
              </label>
            </fieldset>
            <label className="flex items-start gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={temporarilyClosed}
                onChange={(e) => setTemporarilyClosed(e.target.checked)}
              />
              Temporarily closed to guests
            </label>
          </div>
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <h3 className="text-sm font-medium text-foreground">Guest ordering hours</h3>
            <p className="text-xs text-muted-foreground">
              The same window is saved for every day. Leave both times empty to keep the saved hours
              unchanged. Guests can order all day when no hours are saved. The counter is never blocked
              by these hours.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="b-open">Opens</Label>
                <Input
                  id="b-open"
                  type="time"
                  value={openTime}
                  onChange={(e) => {
                    setHourDraft({ open: e.target.value, close: closeTime });
                    setBranchErrors((prev) => ({ ...prev, hours: undefined }));
                  }}
                  aria-invalid={Boolean(branchErrors.hours)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="b-close">Closes</Label>
                <Input
                  id="b-close"
                  type="time"
                  value={closeTime}
                  onChange={(e) => {
                    setHourDraft({ open: openTime, close: e.target.value });
                    setBranchErrors((prev) => ({ ...prev, hours: undefined }));
                  }}
                  aria-invalid={Boolean(branchErrors.hours)}
                />
              </div>
            </div>
            {branchErrors.hours && <p className="text-xs text-destructive">{branchErrors.hours}</p>}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="b-closure">Closed date</Label>
                <Input
                  id="b-closure"
                  type="date"
                  value={closureDate}
                  onChange={(e) => setClosureDate(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={addClosure.isPending}
                onClick={onAddClosure}
              >
                Add closure
              </Button>
            </div>
            {hoursQuery.data && hoursQuery.data.closures.length > 0 && (
              <ul className="flex flex-col gap-2">
                {hoursQuery.data.closures.map((closure) => (
                  <li key={closure.id} className="flex items-center justify-between gap-3 text-sm">
                    <span>{closure.date.slice(0, 10)}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={removeClosure.isPending}
                      onClick={() =>
                        removeClosure.mutate(closure.id, {
                          onError: (err) =>
                            sonner.error(
                              err instanceof ApiError ? err.message : "Could not remove the closure",
                            ),
                        })
                      }
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="b-tax-label">Receipt label override (optional)</Label>
            <Input
              id="b-tax-label"
              value={taxLabel}
              onChange={(e) => setTaxLabel(e.target.value)}
              placeholder={preset.taxLabel}
            />
          </div>

          <Button
            type="submit"
            disabled={updateBranch.isPending || replaceHours.isPending}
            className="w-full self-start sm:w-auto"
          >
            {updateBranch.isPending || replaceHours.isPending ? "Saving…" : "Save branch"}
          </Button>
        </form>
      </Card>

      <p className="text-xs text-muted-foreground">
        YatriDesk is free software under the GNU AGPL-3.0. The source code of the version
        you are using is available to every user of this service at{" "}
        <a
          className="underline"
          href="https://github.com/jay-555/YatriDesk"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/jay-555/YatriDesk
        </a>
        .
      </p>
    </div>
  );
}
