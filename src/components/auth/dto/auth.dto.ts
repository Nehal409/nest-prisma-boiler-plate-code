import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { Role } from 'src/enums/roles';

const userRole = z.enum([Role.ADMIN, Role.SUPER_ADMIN, Role.USER]);

const RegisterRequestSchema = z.object({
  firstName: z.string().min(1, { message: 'field is required' }),
  lastName: z.string().min(1, { message: 'field is required' }),
  email: z.string().email({ message: 'invalid email address' }),
  phone: z.string().min(1, { message: 'field is required' }),
  password: z
    .string()
    .min(8, { message: 'must be at least 8 characters long' })
    .max(20, { message: 'must be no more than 20 characters long' }),
  role: userRole,
});

const LoginRequestSchema = z.object({
  email: z.string().email({ message: 'invalid email address' }),
  password: z.string().min(1, { message: 'field is required' }),
});

export class RegisterRequestDto extends createZodDto(RegisterRequestSchema) {}
export class LoginRequestDto extends createZodDto(LoginRequestSchema) {}
