import * as yaml from "js-yaml";

interface ApiConfig {
  keyspace: string;
  role: string;
  userId: string;
  baseUrl: string;
  bearerToken: string;
}

interface Config {
  api: ApiConfig;
}

let config: Config | null = null;

export const loadConfig = async (): Promise<Config> => {
  if (config) {
    return config;
  }

  try {
    // Browser environment - use fetch with relative URL
    let configPath = "/config.yml";

    if (
      window.location.origin.includes("localhost") ||
      window.location.origin.includes("0.0.0.0") ||
      window.location.origin.includes("127.0.0.1")
    ) {
      configPath = import.meta.env.VITE_BASE_PATH + "/config.yml";
    }
    const response = await fetch(configPath);

    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.statusText}`);
    }

    const yamlText = await response.text();

    config = yaml.load(yamlText) as Config;

    if (!config || !config.api) {
      throw new Error("Invalid config format");
    }

    return config;
  } catch (error) {
    console.error("Error loading config:", error);
    throw new Error("Failed to load application configuration");
  }
};

export const getApiConfig = async (): Promise<ApiConfig> => {
  const config = await loadConfig();

  return config.api;
};

// Synchronous version that throws if config is not loaded
export const getApiConfigSync = (): ApiConfig => {
  if (!config) {
    throw new Error("Config not loaded. Call loadConfig() first.");
  }

  return config.api;
};

// Initialize config on module load
loadConfig().catch(console.error);
