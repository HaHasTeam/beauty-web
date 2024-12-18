import { z } from 'zod'

import { PaymentMethod } from '@/types/enum'

const ItemSchema = z.object({
  productClassificationId: z.string().uuid(), // Must be a valid UUID
  quantity: z.number().int().positive(), // Positive integer
})

const OrderSchema = z.object({
  shopVoucherId: z.string().optional(), // Optional UUID
  items: z.array(ItemSchema).min(1), // Must have at least one item
})
const CreateOrderSchema = z.object({
  orders: z.array(OrderSchema).min(1), // Must have at least one order
  addressId: z.string().uuid(), // Must be a valid UUID
  paymentMethod: z.enum([PaymentMethod.CASH, PaymentMethod.CARD, PaymentMethod.WALLET]), // Restrict to specific payment methods
  platformVoucherId: z.string().optional(), // Optional UUID
})

export default CreateOrderSchema
