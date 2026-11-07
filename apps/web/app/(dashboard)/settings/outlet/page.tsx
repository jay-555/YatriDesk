"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBranch } from "@/hooks/use-branch";
import { ApiError, api } from "@/lib/api";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function OutletProfilePage() {
  const { branchId } = useBranch();
  const [legalName, setLegalName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [pan, setPan] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [fssaiNumber, setFssaiNumber] = useState("");
  const [gstScheme, setGstScheme] = useState<"REGULAR" | "COMPOSITION">("REGULAR");
  const [invoicePrefix, setInvoicePrefix] = useState("");
  const [temporarilyClosed, setTemporarilyClosed] = useState(false);
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("23:00");
  const [closureDate, setClosureDate] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchId) return;
    setMessage(null);
    try {
      await api.patch("/settings/restaurant", {
        legalName,
        phone,
        email: email || null,
        address,
        city,
        state,
        pincode,
        pan,
      });
      await api.patch(`/settings/branch?branchId=${branchId}`, {
        gstNumber,
        fssaiNumber: fssaiNumber || null,
        gstScheme,
        invoicePrefix: invoicePrefix || undefined,
        temporarilyClosed,
      });
      setMessage("Outlet profile saved");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Could not save");
    }
  };

  const saveHours = async () => {
    if (!branchId) return;
    await api.put(`/settings/hours?branchId=${branchId}`, {
      windows: DAYS.map((_, dayOfWeek) => ({ dayOfWeek, openTime, closeTime })),
    });
    setMessage("Opening hours saved");
  };

  const addClosure = async () => {
    if (!branchId || !closureDate) return;
    await api.put(`/settings/hours/closures?branchId=${branchId}`, { date: closureDate });
    setMessage(`Closed on ${closureDate}`);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Outlet</h1>
        <p className="text-sm text-muted-foreground">Legal name, tax registration, and the hours guests can order.</p>
      </div>
      <form className="grid gap-3" onSubmit={saveProfile}>
        <Label>Legal name</Label>
        <Input value={legalName} onChange={(e) => setLegalName(e.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
          <Input placeholder="PIN code" value={pincode} onChange={(e) => setPincode(e.target.value)} />
          <Input placeholder="PAN" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} />
          <Input placeholder="GSTIN" value={gstNumber} onChange={(e) => setGstNumber(e.target.value.toUpperCase())} />
          <Input placeholder="FSSAI (14 digits)" value={fssaiNumber} onChange={(e) => setFssaiNumber(e.target.value)} />
          <Input placeholder="Invoice prefix" value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" checked={gstScheme === "REGULAR"} onChange={() => setGstScheme("REGULAR")} /> Regular GST
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" checked={gstScheme === "COMPOSITION"} onChange={() => setGstScheme("COMPOSITION")} /> Composition scheme (bill of supply)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={temporarilyClosed} onChange={(e) => setTemporarilyClosed(e.target.checked)} /> Temporarily closed to guests
        </label>
        <Button type="submit">Save profile</Button>
      </form>
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Opening hours</h2>
        <p className="text-sm text-muted-foreground">The same window is saved for every day. The counter is never blocked by these hours.</p>
        <div className="flex gap-2">
          <Input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
          <Input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
          <Button type="button" variant="outline" onClick={() => void saveHours()}>Save hours</Button>
        </div>
        <div className="flex gap-2">
          <Input type="date" value={closureDate} onChange={(e) => setClosureDate(e.target.value)} />
          <Button type="button" variant="outline" onClick={() => void addClosure()}>Add closure</Button>
        </div>
      </div>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
