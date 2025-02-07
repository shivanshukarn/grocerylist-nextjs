import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  password: z.string().min(6, "Password must be at least 6 characters")
}).refine(data => data.email || data.phone, {
  message: "Either email or phone must be provided",
  path: ["email"]
});

export const loginSchema = z.object({
  identifier: z.string().min(3, "Invalid email/phone"),
  password: z.string().min(6, "Invalid password")
});