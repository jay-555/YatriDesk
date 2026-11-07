CREATE TABLE "module_switches" (
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "module_switches_pkey" PRIMARY KEY ("key")
);
