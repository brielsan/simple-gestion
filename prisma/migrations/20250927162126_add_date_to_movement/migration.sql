-- AlterTable
ALTER TABLE "public"."movements" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "movements_date_idx" ON "public"."movements"("date");
