import { env } from "@/config/env";
import { AppError, ErrorCode } from "@/utils/errors/AppError";
import { Logger } from "@/utils/logger/Logger";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendTransactionalEmail(params: SendEmailParams): Promise<{ id: string }> {
  try {
    if (!env.RESEND_API_KEY) {
      Logger.warn("Resend API Key não configurada. Envio de e-mail simulado em desenvolvimento.", { params });
      return { id: "mock_resend_email_id_" + Date.now() };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: params.from || "Vax App <no-reply@vax.app>",
        to: Array.isArray(params.to) ? params.to : [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new AppError(
        errorBody?.message || "Falha ao enviar e-mail transacional via Resend.",
        ErrorCode.EMAIL_SEND_FAILED,
        response.status
      );
    }

    const data = await response.json();
    Logger.info("E-mail transacional enviado com sucesso via Resend", { id: data.id, to: params.to });
    return data;
  } catch (error) {
    Logger.error("Erro no envio de e-mail via Resend", error);
    throw AppError.fromError(error, "Falha ao enviar e-mail.");
  }
}
