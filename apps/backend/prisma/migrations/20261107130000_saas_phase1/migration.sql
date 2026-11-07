-- Phase 1 SaaS: tenant lifecycle, India tax invoices, hours, billing.

CREATE TYPE "RestaurantStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'SUSPENDED');
CREATE TYPE "GstScheme" AS ENUM ('REGULAR', 'COMPOSITION');
CREATE TYPE "BillingState" AS ENUM ('NONE', 'TRIAL', 'ACTIVE', 'PAST_DUE', 'HALTED');

ALTER TABLE "restaurants"
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "email" TEXT,
  ADD COLUMN "address" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "state" TEXT,
  ADD COLUMN "pincode" TEXT,
  ADD COLUMN "pan" TEXT,
  ADD COLUMN "status" "RestaurantStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN "plan" TEXT NOT NULL DEFAULT 'starter',
  ADD COLUMN "maxBranches" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "maxUsers" INTEGER NOT NULL DEFAULT 25;

ALTER TABLE "branches"
  ADD COLUMN "fssaiNumber" TEXT,
  ADD COLUMN "fssaiExpiresOn" TIMESTAMP(3),
  ADD COLUMN "invoicePrefix" TEXT,
  ADD COLUMN "gstScheme" "GstScheme" NOT NULL DEFAULT 'REGULAR',
  ADD COLUMN "temporarilyClosed" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "users" ADD COLUMN "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "menu_items" ADD COLUMN "hsnCode" TEXT;
ALTER TABLE "customers" ADD COLUMN "gstin" TEXT, ADD COLUMN "businessName" TEXT;

ALTER TABLE "orders"
  ADD COLUMN "invoiceNumber" TEXT,
  ADD COLUMN "invoicedAt" TIMESTAMP(3),
  ADD COLUMN "customerGstin" TEXT,
  ADD COLUMN "customerLegalName" TEXT;

CREATE UNIQUE INDEX "orders_branchId_invoiceNumber_key" ON "orders"("branchId", "invoiceNumber");

CREATE TABLE "branch_hours" (
  "id" TEXT NOT NULL,
  "branchId" TEXT NOT NULL,
  "dayOfWeek" INTEGER NOT NULL,
  "openTime" TEXT NOT NULL,
  "closeTime" TEXT NOT NULL,
  CONSTRAINT "branch_hours_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "branch_hours_branchId_dayOfWeek_idx" ON "branch_hours"("branchId", "dayOfWeek");
ALTER TABLE "branch_hours" ADD CONSTRAINT "branch_hours_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "branch_closures" (
  "id" TEXT NOT NULL,
  "branchId" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "reason" TEXT,
  CONSTRAINT "branch_closures_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "branch_closures_branchId_date_key" ON "branch_closures"("branchId", "date");
ALTER TABLE "branch_closures" ADD CONSTRAINT "branch_closures_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "invoice_sequences" (
  "id" TEXT NOT NULL,
  "branchId" TEXT NOT NULL,
  "fiscalYear" TEXT NOT NULL,
  "lastNumber" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "invoice_sequences_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "invoice_sequences_branchId_fiscalYear_key" ON "invoice_sequences"("branchId", "fiscalYear");
ALTER TABLE "invoice_sequences" ADD CONSTRAINT "invoice_sequences_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "platform_admins" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "totpSecret" TEXT,
  "totpEnabled" BOOLEAN NOT NULL DEFAULT false,
  "recoveryHashes" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "totpLastStep" INTEGER,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "platform_admins_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "platform_admins_email_key" ON "platform_admins"("email");

CREATE TABLE "platform_audit_logs" (
  "id" TEXT NOT NULL,
  "adminId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entity" TEXT,
  "entityId" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "platform_audit_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "platform_audit_logs_createdAt_idx" ON "platform_audit_logs"("createdAt");

CREATE TABLE "billing_accounts" (
  "restaurantId" TEXT NOT NULL,
  "razorpayCustomerId" TEXT,
  "razorpaySubscriptionId" TEXT,
  "status" "BillingState" NOT NULL DEFAULT 'NONE',
  "plan" TEXT NOT NULL DEFAULT 'starter',
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "billing_accounts_pkey" PRIMARY KEY ("restaurantId")
);
ALTER TABLE "billing_accounts" ADD CONSTRAINT "billing_accounts_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "saas_invoices" (
  "id" TEXT NOT NULL,
  "restaurantId" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "taxableAmount" DECIMAL(12,2) NOT NULL,
  "gstAmount" DECIMAL(12,2) NOT NULL,
  "total" DECIMAL(12,2) NOT NULL,
  "razorpayPaymentId" TEXT,
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "saas_invoices_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "saas_invoices_number_key" ON "saas_invoices"("number");
CREATE INDEX "saas_invoices_restaurantId_issuedAt_idx" ON "saas_invoices"("restaurantId", "issuedAt");
ALTER TABLE "saas_invoices" ADD CONSTRAINT "saas_invoices_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "saas_invoice_sequences" (
  "id" TEXT NOT NULL DEFAULT 'saas',
  "lastNumber" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "saas_invoice_sequences_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "feature_flags" (
  "restaurantId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("restaurantId", "key")
);
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row-level policies. The app role keeps working while app.platform is unset.
-- A session that sets app.platform = 'off' only sees the restaurant in app.restaurant_id.
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" FORCE ROW LEVEL SECURITY;
CREATE POLICY "orders_tenant" ON "orders"
  USING (
    current_setting('app.platform', true) IS DISTINCT FROM 'off'
    OR "branchId" IN (SELECT id FROM "branches" WHERE "restaurantId" = current_setting('app.restaurant_id', true))
  )
  WITH CHECK (
    current_setting('app.platform', true) IS DISTINCT FROM 'off'
    OR "branchId" IN (SELECT id FROM "branches" WHERE "restaurantId" = current_setting('app.restaurant_id', true))
  );

ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customers" FORCE ROW LEVEL SECURITY;
CREATE POLICY "customers_tenant" ON "customers"
  USING (
    current_setting('app.platform', true) IS DISTINCT FROM 'off'
    OR "branchId" IN (SELECT id FROM "branches" WHERE "restaurantId" = current_setting('app.restaurant_id', true))
  )
  WITH CHECK (
    current_setting('app.platform', true) IS DISTINCT FROM 'off'
    OR "branchId" IN (SELECT id FROM "branches" WHERE "restaurantId" = current_setting('app.restaurant_id', true))
  );

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;
CREATE POLICY "users_tenant" ON "users"
  USING (
    current_setting('app.platform', true) IS DISTINCT FROM 'off'
    OR "restaurantId" = current_setting('app.restaurant_id', true)
  )
  WITH CHECK (
    current_setting('app.platform', true) IS DISTINCT FROM 'off'
    OR "restaurantId" = current_setting('app.restaurant_id', true)
  );

ALTER TABLE "menu_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "menu_items" FORCE ROW LEVEL SECURITY;
CREATE POLICY "menu_items_tenant" ON "menu_items"
  USING (
    current_setting('app.platform', true) IS DISTINCT FROM 'off'
    OR "branchId" IN (SELECT id FROM "branches" WHERE "restaurantId" = current_setting('app.restaurant_id', true))
  )
  WITH CHECK (
    current_setting('app.platform', true) IS DISTINCT FROM 'off'
    OR "branchId" IN (SELECT id FROM "branches" WHERE "restaurantId" = current_setting('app.restaurant_id', true))
  );
