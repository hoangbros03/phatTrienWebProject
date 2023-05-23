import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'http://localhost:3500/',
    timeout: 5000,
    withCredentials: true
});
export const login = async (path, object = {}) => {
  console.log(object)
  const respone = await httpRequest
      .post(path, object)
      .catch((error) => console.error(error));
  return respone.data;
};
export const refresh = async (path) => {
  const respone = await httpRequest
      .get(path)
      .catch((error) => console.error(error));
  return respone?.data;
};
export const logout = async (path) => {
  const respone = await httpRequest
      .get(path)
      .catch((error) => console.error(error));
  return respone?.data;
};
export default httpRequest;