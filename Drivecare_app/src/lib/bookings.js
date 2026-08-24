import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/components/api/api_Instance";
import useAuth from "@/components/Context/useAuth";

export const saveBooking = async (bookingData, token) => {
  const response = await instance.post("/booking", bookingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getBookings = async (token) => {
  const response = await instance.get("/booking", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getBookingById = async (id, token) => {
  const response = await instance.get(`/booking/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateBooking = async (id, updatedData, token) => {
  const response = await instance.patch(`/booking/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteBooking = async (id, token) => {
  const response = await instance.delete(`/booking/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ---------- React Query hooks ----------

export const useBookings = (options = {}) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["bookings", token],
    queryFn: () => getBookings(token),
    enabled: !!token,
    ...options,
  });
};

export const useBooking = (id, options = {}) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["booking", id, token],
    queryFn: () => getBookingById(id, token),
    enabled: !!id && !!token,
    ...options,
  });
};

export const useCreateBooking = () => {
  const { token } = useAuth();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", token] });
    },
  });
};

export const useUpdateBooking = () => {
  const { token } = useAuth();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBooking(id, data, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings", token] });
      queryClient.invalidateQueries({
        queryKey: ["booking", variables.id, token],
      });
    },
  });
};

export const useDeleteBooking = () => {
  const { token } = useAuth();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookings", token] });
      queryClient.removeQueries({ queryKey: ["booking", id, token] });
    },
  });
};
