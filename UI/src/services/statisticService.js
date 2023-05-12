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

