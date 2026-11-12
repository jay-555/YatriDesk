import assert from "node:assert/strict";
import { test } from "node:test";
import { demoRequestSchema, fieldErrors, integrationRequestSchema } from "./schemas.ts";
import { formatInr, planPrice } from "./pricing.ts";

const demo = {
  name: "Asha Rao",
  phone: "98765 43210",
  restaurant: "Udupi Corner",
  city: "Mysuru",
  businessType: "restaurant",
};

test("a complete demo request is accepted and the phone normalised", () => {
  const r = demoRequestSchema.safeParse(demo);
  assert.equal(r.success, true);
  if (r.success) assert.equal(r.data.phone, "+919876543210");
});

test("+91 and leading 0 forms are accepted", () => {
  for (const phone of ["+91 98765-43210", "09876543210", "919876543210"]) {
    assert.equal(demoRequestSchema.safeParse({ ...demo, phone }).success, true, phone);
  }
});

test("bad phones, empty fields and unknown business types are refused", () => {
  const r = demoRequestSchema.safeParse({
    name: "A",
    phone: "12345",
    restaurant: "",
    city: "",
    businessType: "spaceship",
  });
  assert.equal(r.success, false);
  if (!r.success) {
    assert.deepEqual(Object.keys(fieldErrors(r.error)).sort(), [
      "businessType",
      "city",
      "name",
      "phone",
      "restaurant",
    ]);
  }
});

test("a filled honeypot is refused", () => {
  assert.equal(demoRequestSchema.safeParse({ ...demo, website: "spam.example" }).success, false);
});

test("integration requests take an email or a mobile", () => {
  const base = { name: "Asha", category: "Payments" };
  assert.equal(integrationRequestSchema.safeParse({ ...base, contact: "asha@example.com" }).success, true);
  assert.equal(integrationRequestSchema.safeParse({ ...base, contact: "9876543210" }).success, true);
  assert.equal(integrationRequestSchema.safeParse({ ...base, contact: "nope" }).success, false);
});

test("yearly pricing charges ten months and shows the effective monthly rate", () => {
  assert.deepEqual(planPrice(1499, "yearly"), { perMonth: 1249, billed: 14990, saving: 2998 });
  assert.deepEqual(planPrice(1499, "monthly"), { perMonth: 1499, billed: 1499, saving: 0 });
  assert.equal(formatInr(149900), "₹1,49,900");
});
