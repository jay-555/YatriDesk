"use client";

import { Input } from "@/components/ui/input";
import { SavedAddressPicker } from "@/components/pos/saved-address-picker";

export interface DeliveryDetails {
  address: string;
  pincode: string;
  phone: string;
}

export function DeliveryFields({
  delivery,
  onDeliveryChange,
  branchId,
}: {
  delivery: DeliveryDetails;
  onDeliveryChange: (d: DeliveryDetails) => void;
  branchId?: string | null;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder="Delivery address"
        aria-label="Delivery address"
        value={delivery.address}
        onChange={(e) => onDeliveryChange({ ...delivery, address: e.target.value })}
      />
      <SavedAddressPicker
        branchId={branchId ?? null}
        phone={delivery.phone}
        onPick={(address, pincode) => onDeliveryChange({ ...delivery, address, pincode })}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Pincode"
          aria-label="Pincode"
          inputMode="numeric"
          value={delivery.pincode}
          onChange={(e) => onDeliveryChange({ ...delivery, pincode: e.target.value })}
        />
        <Input
          placeholder="Phone"
          aria-label="Phone"
          inputMode="tel"
          value={delivery.phone}
          onChange={(e) => onDeliveryChange({ ...delivery, phone: e.target.value })}
        />
      </div>
    </div>
  );
}
