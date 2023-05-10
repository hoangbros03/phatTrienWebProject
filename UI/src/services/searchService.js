import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'http://localhost:3500/',
    timeout: 1000,
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
        console.log(fullPath);
        const response = await httpRequest.post(fullPath, object);
        return response.data;
    } catch (error) {
        console.error(error);
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
        console.log(fullPath);
        const response = await httpRequest.post(fullPath, object);
        return response.data;
    } catch (error) {
        console.error(error);
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
        console.log(fullPath);
        console.log(object);
        const response = await httpRequest.post(fullPath, object);
        return response.data;
    } catch (error) {
        console.error(error);
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
        console.log(fullPath);
        const response = await httpRequest.post(fullPath, object);
        return response.data;
    } catch (error) {
        console.error(error);
        return error.response.data;
    }
};

export const post = async (path, object = {}) => {
    console.log(object);
    const respone = await httpRequest.post(path, object).catch((error) => console.error(error));
    return respone.data;
};

export const getList = async (searchPath, parameters = {}) => {
    const fullPath = Object.keys(parameters).reduce((path, key) => {
        return path.replace(`:${key}`, parameters[key]);
    }, searchPath);
    const respone = await httpRequest.get(fullPath).catch((error) => console.error(error));
    return respone.data;
};
export const Delete = async (searchPath, parameters = {}, object = {}) => {
    try {
        // Construct the full search path with parameters
        const fullPath = Object.keys(parameters).reduce((path, key) => {
            console.log(path, key, parameters[key]);
            return path.replace(`:${key}`, parameters[key]);
        }, searchPath);
        console.log(fullPath);
        console.log(object);
        const response = await httpRequest.delete(fullPath, { data: object });
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};

export const patch = async (path, object = {}) => {
    const respone = await httpRequest
        .patch(path, object)
        .catch((error) => console.error(error));
    
    return respone.data;
};
export default httpRequest;
