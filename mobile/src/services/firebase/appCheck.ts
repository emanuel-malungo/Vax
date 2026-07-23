import { initializeAppCheck, CustomProvider } from "firebase/app-check";
import { app } from "./index";
import { Logger } from "@/utils/logger/Logger";

export function initAppCheck() {
  try {
    // Prepared for Firebase App Check integration
    // When ready, replace debug token provider with Play Integrity / App Attest provider
    initializeAppCheck(app, {
      provider: new CustomProvider({
        getToken: () => {
          return Promise.resolve({
            token: "DEBUG_APP_CHECK_TOKEN",
            expireTimeMillis: Date.now() + 3600 * 1000,
          });
        },
      }),
      isTokenAutoRefreshEnabled: true,
    });
    Logger.info("Firebase App Check preparado/inicializado.");
  } catch (error) {
    Logger.warn("Firebase App Check não pôde ser ativado:", { error });
  }
}
