import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { axiosInstance } from '@/utils/axios';
import { UseApiMutationProps } from '@/types/dashboard/hook';

export default function useApiMutation<
  TData = unknown,
  TVariables = unknown
>({
  url,
  method,
  options,
  isFormData,
}: UseApiMutationProps<TData, TVariables>) {
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables) => {
      const isFullUrl = /^https?:\/\//i.test(url);
      const client = isFullUrl ? axios : axiosInstance;

      let payload: any = variables;
      if (
        isFormData &&
        typeof window !== 'undefined' &&
        !(variables instanceof FormData) &&
        variables &&
        typeof variables === 'object'
      ) {
        const formData = new FormData();
        Object.entries(variables as Record<string, any>).forEach(
          ([key, val]) => {
            if (val !== undefined && val !== null) {
              formData.append(key, val);
            }
          },
        );
        payload = formData;
      }

      const { data } = await client.request<TData>({
        url,
        method: method.toUpperCase(),
        data: payload,
      });

      return data;
    },

    ...options, // 👈 اول spread

    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });
}