-- DropIndex
DROP INDEX "Package_coachId_name_key";

CREATE UNIQUE INDEX "Client_coachId_phone_unique" ON "Client" ("coachId", "phone");
CREATE UNIQUE INDEX "Package_coachId_name_active_unique" ON "Package" ("coachId", "name") WHERE "isActive" = true;
CREATE UNIQUE INDEX "Subscription_clientId_active_unique" ON "Subscription" ("clientId") WHERE "status" = 'active';