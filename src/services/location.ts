import type {
  Province,
  City,
  District,
  Village,
  LocationApiResponse,
} from "@/types/auth";

import axios from "axios";

import { getApiConfig } from "@/utils/config";
import { encodeParamsAES256 } from "@/utils/aes256";

// Create axios instance for location API
const createLocationClient = async () => {
  const config = await getApiConfig();

  return axios.create({
    baseURL: config.baseUrl,
    headers: {
      Authorization: `Bearer ${config.bearerToken}`,
      "Content-Type": "application/json",
      "key-token": encodeParamsAES256(
        config.keyspace,
        config.role,
        config.userId,
      ),
    },
  });
};

// Fetch provinces
export const fetchProvinces = async (): Promise<Province[]> => {
  try {
    const config = await getApiConfig();
    const locationClient = await createLocationClient();

    const response = await locationClient.get<LocationApiResponse<Province>>(
      `/wilayah-pointing/${config.keyspace}/${config.role}/${config.userId}/provinsi`,
    );

    if (response.data.status && Array.isArray(response.data.result)) {
      return response.data.result;
    }

    return [];
  } catch (error) {
    console.error("Error fetching provinces:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch provinces: ${error.message}`);
    }
    throw new Error("Failed to fetch provinces");
  }
};

// Fetch cities by province ID
export const fetchCities = async (provinceId: string): Promise<City[]> => {
  try {
    const config = await getApiConfig();
    const locationClient = await createLocationClient();

    const params = {
      data: JSON.stringify({
        startRow: 0,
        endRow: 100,
        rowGroupCols: [],
        valueCols: [],
        pivotCols: [],
        pivotMode: false,
        groupKeys: [],
        filterModel: {},
        sortModel: [{ colId: "createdAt", sort: "desc" }],
      }),
      q: "",
      aggs: "",
      user_token: "",
    };

    const response = await locationClient.get<LocationApiResponse<City>>(
      `/wilayah-pointing/${config.keyspace}/${config.role}/${config.userId}/kota/${provinceId}`,
      { params },
    );

    if (response.data.status && Array.isArray(response.data.result)) {
      return response.data.result;
    }

    return [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch cities: ${error.message}`);
    }
    throw new Error("Failed to fetch cities");
  }
};

// Fetch districts by city ID
export const fetchDistricts = async (cityId: string): Promise<District[]> => {
  try {
    const config = await getApiConfig();
    const locationClient = await createLocationClient();

    const params = {
      data: JSON.stringify({
        startRow: 0,
        endRow: 100,
        rowGroupCols: [],
        valueCols: [],
        pivotCols: [],
        pivotMode: false,
        groupKeys: [],
        filterModel: {},
        sortModel: [{ colId: "createdAt", sort: "desc" }],
      }),
      q: "",
      aggs: "",
      user_token: "",
    };

    const response = await locationClient.get<LocationApiResponse<District>>(
      `/wilayah-pointing/${config.keyspace}/${config.role}/${config.userId}/kecamatan/${cityId}`,
      { params },
    );

    if (response.data.status && Array.isArray(response.data.result)) {
      return response.data.result;
    }

    return [];
  } catch (error) {
    console.error("Error fetching districts:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch districts: ${error.message}`);
    }
    throw new Error("Failed to fetch districts");
  }
};

// Fetch villages by district ID
export const fetchVillages = async (districtId: string): Promise<Village[]> => {
  try {
    const config = await getApiConfig();
    const locationClient = await createLocationClient();

    const params = {
      data: JSON.stringify({
        startRow: 0,
        endRow: 100,
        rowGroupCols: [],
        valueCols: [],
        pivotCols: [],
        pivotMode: false,
        groupKeys: [],
        filterModel: {},
        sortModel: [{ colId: "createdAt", sort: "desc" }],
      }),
      q: "",
      aggs: "",
      user_token: "",
    };

    const response = await locationClient.get<LocationApiResponse<Village>>(
      `/wilayah-pointing/${config.keyspace}/${config.role}/${config.userId}/kelurahan/${districtId}`,
      { params },
    );

    if (response.data.status && Array.isArray(response.data.result)) {
      return response.data.result;
    }

    return [];
  } catch (error) {
    console.error("Error fetching villages:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch villages: ${error.message}`);
    }
    throw new Error("Failed to fetch villages");
  }
};
