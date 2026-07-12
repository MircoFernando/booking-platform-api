/*
  Warnings:

  - A unique constraint covering the columns `[service_id,booking_date,booking_time]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refresh_token_hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_service_id_booking_date_booking_time_key" ON "bookings"("service_id", "booking_date", "booking_time");
