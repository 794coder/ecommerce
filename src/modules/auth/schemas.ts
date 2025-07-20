import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z
    .string()
    .min(3, "Username must be atleast 3 characters")
    .max(55, "Username cannot be longer than 55 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters,numbers and hyphens. It must start and end with a letter or a symbol"
    )
    .refine(
      (val) => !val.includes("--"),
      "Username cannot contain consecutive hypehens"
    )
    .transform((val) => val.toLowerCase()),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
