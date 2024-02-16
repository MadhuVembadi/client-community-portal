import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'


//http post req to login user
export const userLogin = createAsyncThunk('loginuser', async (userCred, thunkAPI) => {

    let response = await axios.post('/user/login', userCred);
    let data = response.data;
    if (data.message == 'login successful') {

        //store token in local storage
        localStorage.setItem("token", data.payload);
        return data.user;

    }
    else if (data.message == 'user not found' || data.message == 'Incorrect Password') {
        return thunkAPI.rejectWithValue(data);
    }
})

export const userLogout = createAsyncThunk('logoutuser',async(userCred,thunkAPI) => {
    let response = await axios.post('/user/logout',userCred);
    let data = response.data;
    if(data.message == 'logout successful'){

        localStorage.removeItem("token");
        return 'success;'
    }
    else{
        return thunkAPI.rejectWithValue(data)
    }
})

const userSlice = createSlice({
    name:"user",
    initialState:{
        userObj:{},
        isLoginError:false,
        isLoginLoading:false,
        isLoginSuccess:false,
        loginErrMsg:''
    },
    reducers:{
        // clearLoginStatus: (state, action) => {
        //     state.userObj = {};
        //     state.isLoginError = false;
        //     state.loginErrMsg = '';
        //     state.isLoginLoading = false;
        //     state.isLoginSuccess = false;
        //     return state;
        // }
        toggleEmailNotification:(state,actionObj) => {
            console.log(state.userObj,actionObj.payload);
            state.userObj[0] = actionObj.payload;
            console.log(state.userObj);
            return state;
        },
        clearUser:(state,actionObj) => {
            state.userObj[0] = actionObj.payload;
            state.isLoginError=false;
            state.isLoginLoading=false;
            state.isLoginSuccess=false;
            state.loginErrMsg='';
            return state;
        },
        updateUser:(state,actionObj) => {
            console.log(state.userObj,actionObj.payload);
            state.userObj[0] = actionObj.payload;
            console.log(state.userObj);
            return state;
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase(userLogin.pending,(state, action) => {
            state.isLoginLoading = true;
            state.isLoginError = false;
            state.isLoginSuccess = false;
            state.loginErrMsg = '';
        })
        .addCase(userLogin.fulfilled, (state, action) => {
            state.isLoginLoading = false;
            state.isLoginError = false;
            state.isLoginSuccess = true;
            state.loginErrMsg = '';
            state.userObj = action.payload;
        })
        .addCase(userLogin.rejected, (state, action) => {
            state.isLoginLoading = false;
            state.isLoginError = true;
            state.isLoginSuccess = false;
            state.loginErrMsg = action.payload.message;
        })
        .addCase(userLogout.pending,(state,action) => {
            state.isLoginLoading = true;
            state.isLoginError = false;
            state.isLoginSuccess = false;
            state.loginErrMsg = '';
        })
        .addCase(userLogout.fulfilled,(state,action) => {
            state.userObj = {};
            state.isLoginError = false;
            state.loginErrMsg = '';
            state.isLoginLoading = false;
            state.isLoginSuccess = false;
        })
        .addCase(userLogout.rejected,(state,action) => {
            state.isLoginLoading = false;
            state.isLoginError = true;
            state.isLoginSuccess = false;
            state.loginErrMsg = action.payload.message;
        })
    }
})

export const {toggleEmailNotification,clearUser,updateUser } = userSlice.actions;
export default userSlice.reducer;