import {
  integer,
  pgTable,
  varchar,
  text,
  doublePrecision,
  boolean,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const productsTable = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: varchar({ length: 255 }),
  price: doublePrecision().notNull(),
  promotion: boolean().default(false),
  liked: boolean().default(false),
});

export const createProductSchema = createInsertSchema(productsTable).omit({
  id: true,
});

export const updateProductSchema = createInsertSchema(productsTable)
  .omit({
    id: true,
  })
  .partial();
