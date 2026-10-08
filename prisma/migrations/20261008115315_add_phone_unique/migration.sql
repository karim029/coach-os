/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Coach` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Coach_phone_key" ON "Coach"("phone");
