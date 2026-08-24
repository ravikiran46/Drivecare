import { useQuery } from "@tanstack/react-query";
import instance from "@/components/api/api_Instance";
import useAuth from "@/components/Context/useAuth";

export const getServices = async (token) => {
  const response = await instance.get("/service", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ----- React Query hooks -----
export const useServices = (options = {}) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["services", token],
    queryFn: () => getServices(token),
    enabled: !!token,
    ...options,
  });
};
