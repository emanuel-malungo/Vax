import * as Sentry from "@sentry/react-native";
import { env } from "@/config/env";

export function initSentry() {
  if (env.SENTRY_DSN && env.APP_ENV === "production") {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      environment: env.APP_ENV,
      tracesSampleRate: 1.0,
      enableAutoSessionTracking: true,
      debug: false,
    });
  }
}

export function captureException(error: unknown, context?: Record<string, any>) {
  if (env.SENTRY_DSN && env.APP_ENV === "production") {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setExtras(context);
      }
      Sentry.captureException(error);
    });
  }
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  if (env.SENTRY_DSN && env.APP_ENV === "production") {
    Sentry.captureMessage(message, level);
  }
}
