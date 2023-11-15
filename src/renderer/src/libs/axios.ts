import Axios from 'axios';

// import { API_URL } from '@/config';

export const axios = Axios.create({
  baseURL: 'https://dev.api.refern.app',
});

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // add logging here
    // const message = error.response?.data?.message || error.message;
    // useNotificationStore.getState().addNotification({
    //   type: 'error',
    //   title: 'Error',
    //   message,
    // });

    return Promise.reject(error);
  },
);
