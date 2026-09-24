import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/components/api/api_Instance";
import useAuth from "@/components/Context/useAuth";

export const getServices = async (token) => {
  const response = await instance.get("/service", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const createService = async (serviceData, token) => {
  const response = await instance.post("/service", serviceData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getServiceById = async (id, token) => {
  const response = await instance.get(`/service/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateService = async (id, updatedData, token) => {
  const response = await instance.patch(`/service/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteService = async (id, token) => {
  const response = await instance.delete(`/service/${id}`, {
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

export const useCreateService = () => {
  const { token } = useAuth();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceData) => createService(serviceData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", token] });
    },
  });
};

export const useService = (id, options = {}) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["service", id, token],
    queryFn: () => getServiceById(id, token),
    enabled: !!id && !!token,
    ...options,
  });
};

export const useUpdateService = () => {
  const { token } = useAuth();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateService(id, data, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services", token] });
      queryClient.invalidateQueries({
        queryKey: ["service", variables.id, token],
      });
    },
  });
};

export const useDeleteService = () => {
  const { token } = useAuth();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteService(id, token),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["services", token] });
      queryClient.removeQueries({ queryKey: ["service", id, token] });
    },
  });
};
