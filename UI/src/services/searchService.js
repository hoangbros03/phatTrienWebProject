import axios from 'axios';

const httpRequest = axios.create({
    baseURL: "http://localhost:3001/",
});

export const get = async (path, options = {}) => {
    const respone = await httpRequest.get(path, options);
    return respone.data;
};
export const post = async (path, object={}) => {
    const respone = await httpRequest.post(path, object);
    return respone.data;
};
export default httpRequest;


