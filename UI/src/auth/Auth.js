import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '~/services/Auth';

export const requestLogin = createAsyncThunk('login/requestLogin', async (account) => {
    const res = await API.login('login', { ...account });
    console.log({ ...account, res });
    return { ...account, ...res };
});

export const requestRefresh = createAsyncThunk('login/requestRefresh', async (account) => {
    const res = await API.refresh('refresh').catch((error)=>{
        throw new Error('Failed to search for car');
    })
    return { ...res };
});
export const requestLogout = createAsyncThunk('login/requestLogout', async (account) => {
    const res = await API.logout('logout');
    return { ...res};
});
export const setAccessToken = createAsyncThunk('login/setAccessToken', async (respone) => {
    return { ...respone};
});
const authSlice = createSlice({
    name: 'login',
    initialState: { user: null, accesstoken: null, role: null },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setAccessToken.fulfilled, (state, action) => {
            state.role = action.payload.role;
            state.user = action.payload.user;
            state.accesstoken = action.payload.accessToken;
        });
        builder.addCase(requestLogin.fulfilled, (state, action) => {
            state.role = action.payload.role;
            state.user = action.payload.user;
            state.accesstoken = action.payload.access_token;
            const expirationHours = 1;
            const date = new Date();
            date.setTime(date.getTime() + expirationHours * 60 * 60 * 1000);
            const expires = 'expires=' + date.toUTCString();
            document.cookie = 'jwt' + '=' + action.payload.refreshToken + ';' + expires + ';path=/';
        });
        builder.addCase(requestLogout.fulfilled, (state, action) => {
            state.role = "";
            state.user = "";
            state.accesstoken = "";
            //clear cookie 
            document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        });
        builder.addCase(requestRefresh.fulfilled, (state, action) => {
            state.accesstoken = action.payload.accessToken;
        });

    },
});
export default authSlice;
