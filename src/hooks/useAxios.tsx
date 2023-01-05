import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = "https://pokeapi.co/api/v2/";

const useAxios = (
  axiosParams: AxiosRequestConfig<any>,
  options?: {
    callLater?: boolean;
  }
) => {
  const isCallLater = options?.callLater || false;
  const [response, setResponse] = useState(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!isCallLater);

  const fetchData = async (params: AxiosRequestConfig<any>) => {
    try {
      const result = await axios.request(params);
      setResponse(result.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options?.callLater) {
      fetchData(axiosParams);
    }
  }, []); // execute once only

  return { response, error, loading, ...(isCallLater && { fetchData }) };
};

export { useAxios };
