import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const RegisterRequestSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password must be no more than 20 characters long' }),
});

export class RegisterRequestDto extends createZodDto(RegisterRequestSchema) {}
