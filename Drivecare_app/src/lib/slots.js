import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import instance from "@/components/api/api_Instance";
import useAuth from "@/components/Context/useAuth";

export const getSlots = async (token) => {
  const response = await instance.get("/timeslot", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data; // { data: [...] }
};

export const createSlots = async (slotData, token) => {
  const response = await instance.post("/timeslot", slotData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getActiveSlots = async (token) => {
  const response = await instance.get("/timeslot/active", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateSlots = async (id, updatedData, token) => {
  const response = await instance.patch(`/timeslot/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteSlots = async (id, token) => {
  const response = await instance.delete(`/timeslot/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
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

export const useActiveSlots = (options = {}) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["activeSlots", token],
    queryFn: () => getActiveSlots(token),
    enabled: !!token,
    ...options,
  });
};

export const useCreateSlots = () => {
  const { token } = useAuth();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slotData) => createSlots(slotData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots", token] });
    },
  });
};

export const useUpdateSlots = () => {
  const { token } = useAuth();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSlots(id, data, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["slots", token] });
      queryClient.invalidateQueries({
        queryKey: ["slot", variables.id, token],
      });
    },
  });
};

export const useDeleteSlots = () => {
  const { token } = useAuth();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSlots(id, token),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["slots", token] });
      queryClient.removeQueries({ queryKey: ["slot", id, token] });
    },
  });
};
