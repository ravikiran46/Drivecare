import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/components/api/api_Instance";
import useAuth from "@/components/Context/useAuth";

export const updateCurrentUser = async (updatedData, token) => {
  const response = await instance.patch("/user/me", updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const useUpdateCurrentUser = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedData) => updateCurrentUser(updatedData, token),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
    },
  });
};
