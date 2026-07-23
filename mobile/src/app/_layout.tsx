import { useEffect } from "react";
import { Stack } from "expo-router";
import "../assets/styles/global.css";
import { initSentry, initAppCheck, Logger } from "@/services";

export default function RootLayout() {
  useEffect(() => {
    try {
      initSentry();
      initAppCheck();
      Logger.info("Aplicação iniciada e serviços de infraestrutura prontos.");
    } catch (error) {
      console.error("Erro na inicialização dos serviços:", error);
    }
  }, []);

  return <Stack />;
}
