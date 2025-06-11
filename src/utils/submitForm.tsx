/**
 * This file is auto-generated, do not edit!
 */

import { addToast } from "@heroui/react";
import axios, { AxiosError } from "axios";

import { getApiKey, getUserId, getUserToken } from "./constants";

export const submitForm = async (
  formData: FormData,
  afterSubmitSuccess?: () => void,
) => {
  const SUBMIT_URL = `https://satudesa-service-dashboard.quantumbyte.ai/api/v1/layanan-app/${getUserId()}/####VAR:FOLDER_ID####/####VAR:FOLDER_ID####/create`;

  formData.set("id_user", getUserId());
  formData.set("key", "####VAR:FOLDER_ID####");
  formData.set("form_id", "####VAR:FOLDER_ID####");
  formData.set("user_token", getUserToken());

  axios
    .post(SUBMIT_URL, formData, {
      headers: {
        apiKey: getApiKey(),
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      addToast({
        title: "Success",
        description: response.data.message,
        color: "success",
      });

      afterSubmitSuccess?.();
    })
    .catch((error) => {
      // if error is AxiosError, show error message via toast
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
          description: error.message,
          color: "danger",
        });
      }
    });
};
