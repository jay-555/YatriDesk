-- Outlet choice for the Billing start screen. Existing branches stay on the table grid.
ALTER TABLE "branches" ADD COLUMN "posDefaultService" TEXT NOT NULL DEFAULT 'DINE_IN';
