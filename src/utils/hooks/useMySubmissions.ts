/**
 * This file is auto-generated, do not edit!
 */

import { addToast } from "@heroui/react";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { getApiKey, getUserId } from "../constants";

type SubmissionResponse = {
  data: {
    total: number;
    data: Record<string, any>[];
  };
};

export const useMySubmissions = () => {
  const [submissionResponse, setSubmissionResponse] =
    useState<SubmissionResponse>();
  const [isLoading, setIsLoading] = useState(false);

  const LIST_URL = `https://satudesa-service-dashboard.quantumbyte.ai/api/v1/layanan-app/${getUserId()}/####VAR:FOLDER_ID####/####VAR:FOLDER_ID####/list?data={"startRow":0,"endRow":100,"rowGroupCols":[],"valueCols":[],"pivotCols":[],"pivotMode":false,"groupKeys":[],"filterModel":{},"sortModel":[{"colId":"createdAt","sort":"desc"}]}`;

  const fetchSubmissions = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get<SubmissionResponse>(LIST_URL, {
        headers: {
          apiKey: getApiKey(),
        },
      });

      response.data.data.data = response.data.data.data.filter(
        (e) => e.id_user === getUserId(),
      );

      setSubmissionResponse(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.message === "Not Found") {
          addToast({
            title: "Error",
            description:
              "Aplikasi perlu di-simpan terlebih dahulu sebelum dapat digunakan",
            color: "danger",
          });
        } else {
          addToast({
            title: "Error",
            description: error.response?.data.message,
            color: "danger",
          });
        }
      } else {
        addToast({
          title: "Error",
          description: "Terjadi kesalahan saat mengambil data",
          color: "danger",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return { submissionResponse, refresh: fetchSubmissions, isLoading };
};
