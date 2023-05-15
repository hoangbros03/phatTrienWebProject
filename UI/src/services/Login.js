const onRequestSuccess = (config) => {
  const auth = getCookie(Authenticate.AUTH);
  config.timeout = 10000;
  if (auth) {
    config.headers = {
      Authorization: "Bearer " + auth,
      "x-api-key": keyHearder
    };
    // Handle params for the request
    if (config.params) {
      config.paramsSerializer = (params) => queryString.stringify(params);
    }
  }
  // Other processing...
  return config;
};

const onResponseSuccess = (response) => {
  return response.data;
};

const onResponseError = (error) => {
  if (
    error.response?.status !== 401 || error.config?.url?.includes(authUrl)
  ) {
    const errMessage = error.response?.data || error?.response || error;
    return Promise.reject(errMessage);
  }
  return refreshToken(error, onUnauthenticated);
};

const refreshToken = async (error, logout) => {
  const refreshToken = getLocalStorage(Authenticate.REFRESH_TOKEN_ETC);
  if (!refreshToken) {
    logout();
    return;
  }
  try {
    const { data } = await AuthApi.refreshToken({ refreshToken });
    setLocalStorage({ key: Authenticate.REFRESH_TOKEN_ETC, value: data.refreshToken });
    setCookie(
      Authenticate.AUTH,
      JSON.stringify({
        username: data.username,
        accessToken: data.accessToken,
      }),
      0.02
    );
    error.config.headers = {
      Authorization: "Bearer " + data.accessToken,
    };
    return axios(error.config);
  } catch (error) {
    logout();
    return;
  }
};

axios.interceptors.request.use(onRequestSuccess);
axios.interceptors.response.use(onResponseSuccess, onResponseError);

export default function AxiosInterceptor(onUnauthenticated) {
  const onRequestSuccess = (config) => {
    // Handle request
  };

  const onResponseSuccess = (response) => {
    // Handle successful response
  };

  const onResponseError = (error) => {
    // Handle failed response
  };

  // Rest of the code...
}