import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface ResponseData {
  data?: any[];
  message: string;
  success: boolean;
  error?: any;
}

export class CustomResponseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json;
    // Override the json method
    res.json = function (res: ResponseData): any {
      const response = {
        data: res.data || [],
        message: res.message || null,
        success: res.success !== undefined ? res.success : true,
        error: res.error,
      };
      originalJson.call(this, response);
    };

    next();
  }
}
