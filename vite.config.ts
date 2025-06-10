import { readFileSync } from "fs";
import { resolve } from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Manually read and parse .env file
function loadEnvManually(): Record<string, string> {
  const envPath = resolve(process.cwd(), ".env");
  const env: Record<string, string> = {};

  try {
    const envFile = readFileSync(envPath, "utf8");
    const lines = envFile.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith("#")) {
        continue;
      }

      // Parse key=value pairs
      const equalIndex = trimmedLine.indexOf("=");

      if (equalIndex > 0) {
        const key = trimmedLine.substring(0, equalIndex).trim();
        let value = trimmedLine.substring(equalIndex + 1).trim();

        // Remove quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        env[key] = value;
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Could not read .env file:", error);
  }

  return env;
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = loadEnvManually();

  let BASE_PATH = env.VITE_BASE_PATH;

  // Make sure it's prefixed and suffixed with a slash
  BASE_PATH = BASE_PATH.startsWith("/") ? BASE_PATH : `/${BASE_PATH}`;
  BASE_PATH = BASE_PATH.endsWith("/") ? BASE_PATH : `${BASE_PATH}/`;

  return {
    base: BASE_PATH || "/",
    plugins: [react(), tsconfigPaths()],
    build: {
      // Don't fail build on warnings, only on errors
      rollupOptions: {
        onwarn(warning, warn) {
          // Skip certain warnings
          if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
          if (warning.code === "CIRCULAR_DEPENDENCY") return;

          // Show warning but don't fail build
          warn(warning);
        },
      },
    },
  };
});
