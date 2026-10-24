-- AlterTable
ALTER TABLE "product_variants" ADD CONSTRAINT "stock_non_negative" CHECK ("stock_quantity" >= 0);

-- AlterTable
ALTER TABLE "cart_items" ADD CONSTRAINT "quantity_positive" CHECK ("quantity" > 0);