import { z } from "zod";

const envSchema = z.object({
  FIREBASE_API_KEY: z.string().default(process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyAwuCFDjUTnz9BPmyDXuLCLnaSHWGhOXx0"),
  FIREBASE_AUTH_DOMAIN: z.string().default(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "vaxapp-d1f53.firebaseapp.com"),
  FIREBASE_PROJECT_ID: z.string().default(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "vaxapp-d1f53"),
  FIREBASE_STORAGE_BUCKET: z.string().default(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "vaxapp-d1f53.firebasestorage.app"),
  FIREBASE_MESSAGING_SENDER_ID: z.string().default(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "992787408017"),
  FIREBASE_APP_ID: z.string().default(process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:992787408017:web:0a1b5a9f711116f09a4b30"),
  FIREBASE_MEASUREMENT_ID: z.string().optional().default(process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-ZV90DS1VHS"),
  CLOUDINARY_CLOUD_NAME: z.string().default(process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "de7pp8857"),
  CLOUDINARY_UPLOAD_PRESET: z.string().default(process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "vax_unsigned_preset"),
  CLOUDINARY_API_KEY: z.string().default(process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || "615757168621321"),
  CLOUDINARY_API_SECRET: z.string().optional().default(process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET || "QK4oh0fenoBFoiOXWr4W5wIgv7s"),
  RESEND_API_KEY: z.string().optional().default(process.env.EXPO_PUBLIC_RESEND_API_KEY || ""),
  SENTRY_DSN: z.string().optional().default(process.env.EXPO_PUBLIC_SENTRY_DSN || ""),
  APP_ENV: z.enum(["development", "staging", "production"]).default((process.env.EXPO_PUBLIC_APP_ENV as any) || "development"),
});

const _env = envSchema.safeParse({
  FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  CLOUDINARY_CLOUD_NAME: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_API_KEY: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET,
  RESEND_API_KEY: process.env.EXPO_PUBLIC_RESEND_API_KEY,
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
});

if (!_env.success) {
  console.warn("⚠️ Warning: Environment variables validation failed:", _env.error.format());
}

export const env = _env.success ? _env.data : envSchema.parse({});
