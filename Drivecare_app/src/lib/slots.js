import { useQuery } from "@tanstack/react-query";
import instance from "@/components/api/api_Instance";
import useAuth from "@/components/Context/useAuth";

export const getSlots = async (token) => {
  const response = await instance.get("/timeslot", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // { data: [...] }
};

export const useSlots = (options = {}) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["slots", token],
    queryFn: () => getSlots(token),
    enabled: !!token,
    ...options,
  });
};
