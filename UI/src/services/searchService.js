import axios from 'axios';

const httpRequest = axios.create({
    baseURL: "http://localhost:3500/",
    timeout: 1000,
});

export const get = async (path, options = {}) => {
    const respone = await httpRequest.get(path, options)
    .catch(error => console.error(error));
    return respone.data;
};
export const post = async (path, object={}) => {
    const respone = await httpRequest.post(path, object)
    .catch(error => console.error(error));
    return respone.data;
};
export default httpRequest;