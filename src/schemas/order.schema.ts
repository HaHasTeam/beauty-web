import { z } from 'zod'

import { PaymentMethod } from '@/types/enum'

const ItemSchema = z.object({
  productClassificationId: z.string(),
  quantity: z.number().int(),
})

const OrderSchema = z.object({
  shopVoucherId: z.string().optional(), // Optional
  // items: z.array(ItemSchema).min(1), // Must have at least one item
  items: z.array(ItemSchema).optional(), // Create items manually
  message: z.string().optional(), // Optional message for brand
})
const CreateOrderSchema = z.object({
  orders: z.array(OrderSchema).min(1), // Must have at least one order
  addressId: z.string().uuid(), // Must be a valid UUID
  paymentMethod: z.enum([PaymentMethod.CASH, PaymentMethod.CARD, PaymentMethod.WALLET]), // Restrict to specific payment methods
  platformVoucherId: z.string().optional(), // Optional UUID
})

export default CreateOrderSchema
