import axios from 'axios';
import store from '~/redux/store';
import { saveAs } from 'file-saver';
// import * as APIAuth from '~/services/Auth';
import { requestRefresh } from '../auth/Auth';
const httpRequest = axios.create({
    baseURL: 'http://localhost:3500/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }, // credentials: 'include'
});

//set accessToken 
httpRequest.interceptors.request.use((config) => {
    const state = store.getState();
    const accessToken = state.auth.accesstoken; // Retrieve the access token from storage
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`; // Set the access token in the request header
    }
    return config;
});
//if accessToken expried send refrestoken   
httpRequest.interceptors.response.use(
    (response) => {
        return response;
    }, async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const response = await store.dispatch(requestRefresh());  
            console.log(response)
          //   axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.accessToken;
          return httpRequest(originalRequest);
        }
        return Promise.reject(error);
      });
      
export const get = async (path, options = {}) => {
    const respone = await httpRequest
        .get(path, options)
        .then((res) => console.log(res))
        .catch((error) => console.error(error));
    return respone.data;
};
export const searchCar = async (searchPath, parameters = {}, object = {}) => {
    try {
        // Construct the full search path with parameters
        const fullPath = Object.keys(parameters).reduce((path, key) => {
            console.log(path, key, parameters[key]);
            return path.replace(`:${key}`, parameters[key]);
        }, searchPath);
        const response = await httpRequest.post(fullPath, object);
        return response.data;
    } catch (error) {
        throw new Error('Failed to search for car');
    }
};
export const getCenter = async (searchPath, parameters = {}, object = {}) => {
    try {
        // Construct the full search path with parameters
        const fullPath = Object.keys(parameters).reduce((path, key) => {
            console.log(path, key, parameters[key]);
            return path.replace(`:${key}`, parameters[key]);
        }, searchPath);
        const response = await httpRequest.post(fullPath, object);
        return response.data;
    } catch (error) {
        throw new Error('Failed to get center');
    }
};

export const createCenter = async (searchPath, parameters = {}, object = {}) => {
    try {
        // Construct the full search path with parameters
        const fullPath = Object.keys(parameters).reduce((path, key) => {
            console.log(path, key, parameters[key]);
            return path.replace(`:${key}`, parameters[key]);
        }, searchPath);
        const response = await httpRequest.post(fullPath, object);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const post_user = async (searchPath, parameters = {}, object = {}) => {
    try {
        // Construct the full search path with parameters
        const fullPath = Object.keys(parameters).reduce((path, key) => {
            console.log(path, key, parameters[key]);
            return path.replace(`:${key}`, parameters[key]);
        }, searchPath);
        const response = await httpRequest.post(fullPath, object);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const post = async (path, object = {}) => {
    const respone = await httpRequest.post(path, object).catch((error) => {return Promise.reject(error)});
    return respone.data;
};

export const getList = async (searchPath, parameters = {}) => {
    const fullPath = Object.keys(parameters).reduce((path, key) => {
        return path.replace(`:${key}`, parameters[key]);
    }, searchPath);
    const respone = await httpRequest.get(fullPath, parameters).catch((error) => console.error(error));
    return respone.data;
};
export const Delete = async (searchPath, parameters = {}, object = {}) => {
    try {
        // Construct the full search path with parameters
        const fullPath = Object.keys(parameters).reduce((path, key) => {
            console.log(path, key, parameters[key]);
            return path.replace(`:${key}`, parameters[key]);
        }, searchPath);
        const response = await httpRequest.delete(fullPath, { data: object });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const patch = async (path, object = {}) => {
    const respone = await httpRequest.patch(path, object).catch((error) => console.error(error));
    console.log(respone);
    return respone.data;
};
export const handleFileDownload = async (path, object = {}) => {
    try {
        console.log(object,path)
      const response = await httpRequest.post(path,object);
      console.log(response)
      const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exportdata.json');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
export default httpRequest;
