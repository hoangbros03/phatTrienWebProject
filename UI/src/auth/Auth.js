import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const authSlice = createSlice({
    name: 'login',
    initialState: { user:null,accesstoken:null,role:null},
    reducers: {
      // 
    },
    extraReducers: (builder) => {
      builder
        .addCase(requestLogin.fulfilled, (state, action) => {
            
            state.role=action.payload.role;
            state.user=action.payload.user;
            state.accesstoken=action.payload.accesstoken;
        })

    },
  });
  
  export const requestLogin = createAsyncThunk('login', async (account) => {
    const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(account),
      });
      const data = await res.json();
      console.log({ data });
      return data;
  });
  
  export default authSlice;
  
  
 
  

