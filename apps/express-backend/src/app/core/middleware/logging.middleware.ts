import { Request, Response, NextFunction } from 'express';

export interface LogOptions {
  message?: string;
}

// Logger utility
export class Logger {
  static log(message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    console.log(`[${timestamp}]${contextStr} ${message}`);
  }

  static debug(message: string, context?: string): void {
    if (process.env.NODE_ENV === 'dev') {
      const timestamp = new Date().toISOString();
      const contextStr = context ? ` [${context}]` : '';
      console.debug(`[${timestamp}]${contextStr} DEBUG: ${message}`);
    }
  }

  static error(message: string, trace?: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    console.error(`[${timestamp}]${contextStr} ERROR: ${message}`);
    if (trace) {
      console.error(`Stack trace: ${trace}`);
    }
  }

  static warn(message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    console.warn(`[${timestamp}]${contextStr} WARNING: ${message}`);
  }
}

// Logging middleware
export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = Date.now();
  const { method, originalUrl } = req;
  const context = `${method} ${originalUrl}`;

  Logger.log(`Incoming request`, context);

  // Capture response finish event
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    const { statusCode } = res;
    Logger.log(
      `Request completed - Status: ${statusCode} - ${elapsed}ms`,
      context,
    );
  });

  next();
}

// Route-specific logging decorator (for manual use)
export function logRoute(message?: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const context = `${req.method} ${req.originalUrl}`;
    const logMessage = message || 'Route called';
    Logger.log(logMessage, context);

    if (req.body && Object.keys(req.body).length > 0) {
      Logger.debug(
        `Request body: ${JSON.stringify(req.body, null, 2)}`,
        context,
      );
    }

    next();
  };
}
