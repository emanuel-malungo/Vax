import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from "firebase/auth";
import { auth } from "../index";
import { AppError } from "@/utils/errors/AppError";
import { Logger } from "@/utils/logger/Logger";

export async function signInWithEmail(email: string, pass: string): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    Logger.info("Utilizador autenticado com sucesso", { uid: credential.user.uid });
    return credential.user;
  } catch (error) {
    Logger.error("Erro ao autenticar com email/senha", error);
    throw AppError.fromError(error, "Falha ao iniciar sessão.");
  }
}

export async function signUpWithEmail(email: string, pass: string, displayName?: string): Promise<User> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName && credential.user) {
      await updateProfile(credential.user, { displayName });
    }
    Logger.info("Novo utilizador registado com sucesso", { uid: credential.user.uid });
    return credential.user;
  } catch (error) {
    Logger.error("Erro ao registar novo utilizador", error);
    throw AppError.fromError(error, "Falha ao criar conta.");
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    Logger.info("E-mail de recuperação enviado", { email });
  } catch (error) {
    Logger.error("Erro ao enviar e-mail de recuperação de senha", error);
    throw AppError.fromError(error, "Falha ao enviar e-mail de recuperação.");
  }
}

export async function sendEmailVerification(user?: User | null): Promise<void> {
  try {
    const targetUser = user || auth.currentUser;
    if (!targetUser) {
      throw new AppError("Nenhum utilizador autenticado.", "AUTH_USER_NOT_FOUND", 401);
    }
    await firebaseSendEmailVerification(targetUser);
    Logger.info("E-mail de verificação enviado", { uid: targetUser.uid });
  } catch (error) {
    Logger.error("Erro ao enviar e-mail de verificação", error);
    throw AppError.fromError(error, "Falha ao enviar e-mail de verificação.");
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
    Logger.info("Sessão encerrada com sucesso.");
  } catch (error) {
    Logger.error("Erro ao terminar sessão", error);
    throw AppError.fromError(error, "Falha ao terminar sessão.");
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export async function getIdToken(forceRefresh = false): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken(forceRefresh);
  } catch (error) {
    Logger.error("Erro ao obter token de autenticação", error);
    return null;
  }
}

export function onAuthStateChangedListener(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
