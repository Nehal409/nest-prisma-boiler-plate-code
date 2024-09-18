import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const winstonLogger = winston.createLogger({
  format: winston.format.cli(),

  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ level, message, context, module }) => {
          return `${new Date().toISOString()} [${context || 'App'}${module ? ` - ${module}` : ''}] ${level}: 🚀 ~ ${message}`;
        }),
      ),
    }),
    new DailyRotateFile({
      dirname: 'logs',
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
