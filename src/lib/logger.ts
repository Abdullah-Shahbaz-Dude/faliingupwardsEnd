// Production-ready structured logging system
// Replaces console.log/console.error with proper logging

interface LogContext {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  environment: string;
}

class Logger {
  private environment: string;
  private isDevelopment: boolean;

  constructor() {
    this.environment = process.env.NODE_ENV || "development";
    this.isDevelopment = this.environment === "development";
  }

  private createLogEntry(
    level: LogEntry["level"],
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: this.environment,
    };

    if (context) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      };
    }

    return entry;
  }

  private output(entry: LogEntry): void {
    if (this.isDevelopment) {
      // Development: Pretty print with colors
      const timestamp = new Date(entry.timestamp).toLocaleTimeString();
      const levelColors = {
        info: "\x1b[36m", // Cyan
        warn: "\x1b[33m", // Yellow
        error: "\x1b[31m", // Red
        debug: "\x1b[90m", // Gray
      };
      const reset = "\x1b[0m";
      const color = levelColors[entry.level];

      console.log(
        `${color}[${timestamp}] ${entry.level.toUpperCase()}${reset}: ${entry.message}`
      );

      if (entry.context) {
        console.log("  Context:", entry.context);
      }

      if (entry.error) {
        console.error("  Error:", entry.error);
      }
    } else {
      // Production: Structured JSON for log aggregation
      console.log(JSON.stringify(entry));
    }
  }

  info(message: string, context?: LogContext): void {
    this.output(this.createLogEntry("info", message, context));
  }

  warn(message: string, context?: LogContext): void {
    this.output(this.createLogEntry("warn", message, context));
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.output(this.createLogEntry("error", message, context, error));
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.output(this.createLogEntry("debug", message, context));
    }
  }

  // API-specific logging helpers
  apiRequest(method: string, endpoint: string, context?: LogContext): void {
    this.info(`API ${method} ${endpoint}`, {
      method,
      endpoint,
      ...context,
    });
  }

  apiError(
    method: string,
    endpoint: string,
    error: Error,
    context?: LogContext
  ): void {
    this.error(
      `API ${method} ${endpoint} failed`,
      {
        method,
        endpoint,
        ...context,
      },
      error
    );
  }

  apiSuccess(
    method: string,
    endpoint: string,
    duration?: number,
    context?: LogContext
  ): void {
    this.info(`API ${method} ${endpoint} success`, {
      method,
      endpoint,
      duration: duration ? `${duration}ms` : undefined,
      ...context,
    });
  }

  // Database logging helpers
  dbQuery(operation: string, collection: string, duration?: number): void {
    this.debug(`DB ${operation} on ${collection}`, {
      operation,
      collection,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  dbError(operation: string, collection: string, error: Error): void {
    this.error(
      `DB ${operation} on ${collection} failed`,
      {
        operation,
        collection,
      },
      error
    );
  }

  // Email logging helpers
  emailSent(to: string, subject: string, provider: string = "resend"): void {
    this.info("Email sent successfully", {
      to: this.maskEmail(to),
      subject,
      provider,
    });
  }

  emailError(
    to: string,
    subject: string,
    error: Error,
    provider: string = "resend"
  ): void {
    this.error(
      "Email sending failed",
      {
        to: this.maskEmail(to),
        subject,
        provider,
      },
      error
    );
  }

  // Rate limiting logging
  rateLimitHit(identifier: string, endpoint: string, limit: number): void {
    this.warn("Rate limit exceeded", {
      identifier: this.maskIdentifier(identifier),
      endpoint,
      limit,
    });
  }

  // Authentication logging
  authSuccess(userId: string, method: string): void {
    this.info("Authentication successful", {
      userId,
      method,
    });
  }

  authFailure(identifier: string, method: string, reason: string): void {
    this.warn("Authentication failed", {
      identifier: this.maskIdentifier(identifier),
      method,
      reason,
    });
  }

  // Security logging
  securityEvent(
    event: string,
    severity: "low" | "medium" | "high",
    context?: LogContext
  ): void {
    this.warn(`Security event: ${event}`, {
      severity,
      ...context,
    });
  }

  // Utility methods for data masking
  private maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (local.length <= 2) return `${local}***@${domain}`;
    return `${local.substring(0, 2)}***@${domain}`;
  }

  private maskIdentifier(identifier: string): string {
    if (identifier.length <= 4) return "***";
    return `${identifier.substring(0, 2)}***${identifier.substring(identifier.length - 2)}`;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types for use in other files
export type { LogContext };

// Helper function to extract request context
export const getRequestContext = (req: Request): LogContext => {
  const url = new URL(req.url);
  return {
    method: req.method,
    endpoint: url.pathname,
    userAgent: req.headers.get("user-agent") || "unknown",
    ip:
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") ||
      "unknown",
  };
};

// Performance timing helper
export const withTiming = async <T>(
  operation: string,
  fn: () => Promise<T>,
  logFn?: (duration: number) => void
): Promise<T> => {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    if (logFn) {
      logFn(duration);
    } else {
      logger.debug(`${operation} completed`, { duration: `${duration}ms` });
    }
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`${operation} failed after ${duration}ms`, {}, error as Error);
    throw error;
  }
};
