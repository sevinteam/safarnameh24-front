// import { authApi } from '@/lib/axios';
// import { User } from '@/types/general';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type ApiResponse = {
  // user: User;
  user: any;
  message: string;
  success: boolean;
};

// ------------------------------

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['auth', 'me'],

    queryFn: async () => {
      // const { data } = await authApi.get<ApiResponse>(
      const { data } = await axios.get<ApiResponse>(
        '/auth/profile/sync-whmcs/',
      );

      console.log('user-data', data);
      return data.user;
    },

    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
