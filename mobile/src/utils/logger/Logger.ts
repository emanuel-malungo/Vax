import { env } from "@/config/env";
import { captureException, captureMessage } from "@/services/monitoring/sentry";

export type LogLevel = "debug" | "info" | "warn" | "error";

export class Logger {
  private static formatMessage(level: LogLevel, message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const ctxString = context ? ` | Context: ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctxString}`;
  }

  public static debug(message: string, context?: Record<string, any>): void {
    if (env.APP_ENV === "development") {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  public static info(message: string, context?: Record<string, any>): void {
    if (env.APP_ENV === "development") {
      console.info(this.formatMessage("info", message, context));
    } else {
      captureMessage(message, "info");
    }
  }

  public static warn(message: string, context?: Record<string, any>): void {
    if (env.APP_ENV === "development") {
      console.warn(this.formatMessage("warn", message, context));
    } else {
      captureMessage(message, "warning");
    }
  }

  public static error(message: string, error?: unknown, context?: Record<string, any>): void {
    if (env.APP_ENV === "development") {
      console.error(this.formatMessage("error", message, context), error || "");
    }
    if (error) {
      captureException(error, { message, ...context });
    } else {
      captureMessage(message, "error");
    }
  }
}
