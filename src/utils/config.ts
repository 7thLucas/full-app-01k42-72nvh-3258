// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

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

export let config: Config = {
  api: {
    keyspace: "satudesa",
    role: "dev",
    userId: "3181",
    baseUrl: "https://client-api.quantumbyte.ai/api/v1",
    bearerToken:
      "VstD5Nrcyl777MbuzzxEoYIwK3Zlcj5jkVyS6hdk6EsXkRIiLIJq4EntMrZsGsXmv4HW9RsbuFPVO7Cq8w6XOd6h9owjPfGNZ2HS",
  },
};

export const loadConfig = async (): Promise<Config> => {
  return config;
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
