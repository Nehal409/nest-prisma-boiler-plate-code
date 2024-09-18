import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const LoginRequestSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export class LoginRequestDto extends createZodDto(LoginRequestSchema) {}
