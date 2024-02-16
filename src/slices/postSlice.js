import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';
import {appLink} from '../App'

export const createPost = createAsyncThunk('createPost',async(post,thunkAPI) => {
    
    let response = await axios.post(`${appLink}/post/`,post);
    let data = response.data;
    console.log(data);
    if(data.message == 'success'){
        return data.post;
    }
    else{
        return thunkAPI.rejectWithValue(data);
    }
})

export const getPost = createAsyncThunk('getPost',async (post,thunkAPI) => {
    let response = await axios.get(`${appLink}/post/${post.postId}?user=${post.userId}`);
    let data = response.data;
    console.log(data);
    if(data.message == 'success'){
        return data.post;
    }
    else{
        return thunkAPI.rejectWithValue(data);
    }
})
const postSlice = createSlice({
    name:"post",
    initialState:{
        postObj:{},
        isPostSuccess:false,
        isPostLoading:false,
        isPostError:false,
        postErrMsg:'',
        isGetPostSuccess:false,
        isGetPostLoading:false,
        isGetPostError:false,
        getPostErrMsg:'',
        
    },
    reducers:{
        clearPost:(state,action) => {
            state.postObj  = {};
            state.isGetPostSuccess = false;
            state.isGetPostLoading = false;
            state.isGetPostError = false;
            state.getPostErrMsg = '';
            return state;
        }
    },
    extraReducers:(builder) => {
        builder.
        addCase(createPost.pending,(state,action) => {
            state.isPostLoading = true;
            state.isPostError = false;
            state.isPostSuccess = false;
            state.postErrMsg = ''
        })
        .addCase(createPost.fulfilled,(state,action) => {
            state.isPostLoading = false;
            state.isPostError = false;
            state.isPostSuccess = true;
            state.postErrMsg = '';
            state.postObj = action.payload;
        })
        .addCase(createPost.rejected,(state,action) => {
            state.isPostLoading = false;
            state.isPostError = true;
            state.isPostSuccess = false;
            state.postErrMsg = action.payload.message;
            state.postObj = {};
        })
        .addCase(getPost.pending,(state,action) => {
            state.isGetPostLoading = true;
            state.isGetPostError = false;
            state.isGetPostSuccess = false;
            state.getPostErrMsg = ''
        })
        .addCase(getPost.fulfilled,(state,action) => {
            state.isGetPostLoading = false;
            state.isGetPostError = false;
            state.isGetPostSuccess = true;
            state.getPostErrMsg = '';
            state.postObj = action.payload;
        })
        .addCase(getPost.rejected,(state,action) => {
            state.isGetPostLoading = false;
            state.isGetPostError = true;
            state.isGetPostSuccess = false;
            state.getPostErrMsg = action.payload.message;
            state.postObj = {};
        })
    }
})

export const {clearPost} = postSlice.actions;
export default postSlice.reducer;