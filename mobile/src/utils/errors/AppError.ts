export enum ErrorCode {
  // Auth Errors
  AUTH_INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
  AUTH_USER_NOT_FOUND = "AUTH_USER_NOT_FOUND",
  AUTH_EMAIL_IN_USE = "AUTH_EMAIL_IN_USE",
  AUTH_WEAK_PASSWORD = "AUTH_WEAK_PASSWORD",
  AUTH_REQUIRES_RECENT_LOGIN = "AUTH_REQUIRES_RECENT_LOGIN",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",

  // Firestore / Database Errors
  FIRESTORE_PERMISSION_DENIED = "FIRESTORE_PERMISSION_DENIED",
  FIRESTORE_NOT_FOUND = "FIRESTORE_NOT_FOUND",
  FIRESTORE_ALREADY_EXISTS = "FIRESTORE_ALREADY_EXISTS",

  // Cloudinary / Upload Errors
  CLOUDINARY_UPLOAD_FAILED = "CLOUDINARY_UPLOAD_FAILED",
  CLOUDINARY_DELETE_FAILED = "CLOUDINARY_DELETE_FAILED",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",

  // Email / External Service Errors
  EMAIL_SEND_FAILED = "EMAIL_SEND_FAILED",

  // System & Network Errors
  NETWORK_ERROR = "NETWORK_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export class AppError extends Error {
  public readonly code: ErrorCode | string;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode | string = ErrorCode.INTERNAL_ERROR,
    statusCode: number = 500,
    details?: Record<string, any>,
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }

  public static fromError(error: unknown, fallbackMessage = "Ocorreu um erro inesperado."): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      const errAny = error as any;
      if (errAny.code) {
        switch (errAny.code) {
          case "auth/invalid-credential":
          case "auth/wrong-password":
            return new AppError("E-mail ou palavra-passe incorretos.", ErrorCode.AUTH_INVALID_CREDENTIALS, 401);
          case "auth/user-not-found":
            return new AppError("Utilizador não encontrado.", ErrorCode.AUTH_USER_NOT_FOUND, 404);
          case "auth/email-already-in-use":
            return new AppError("Este e-mail já está em uso.", ErrorCode.AUTH_EMAIL_IN_USE, 409);
          case "auth/weak-password":
            return new AppError("A palavra-passe deve ter pelo menos 6 caracteres.", ErrorCode.AUTH_WEAK_PASSWORD, 400);
          case "permission-denied":
            return new AppError("Não tem permissão para realizar esta operação.", ErrorCode.FIRESTORE_PERMISSION_DENIED, 403);
          case "not-found":
            return new AppError("Recurso não encontrado.", ErrorCode.FIRESTORE_NOT_FOUND, 404);
          default:
            return new AppError(error.message || fallbackMessage, errAny.code || ErrorCode.UNKNOWN_ERROR, 500);
        }
      }
      return new AppError(error.message, ErrorCode.UNKNOWN_ERROR, 500);
    }

    return new AppError(fallbackMessage, ErrorCode.UNKNOWN_ERROR, 500);
  }
}
