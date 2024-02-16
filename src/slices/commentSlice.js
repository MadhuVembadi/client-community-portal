import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';
import {appLink} from '../App'

export const createComment = createAsyncThunk('createcomment',async(comment,thunkAPI) => {
    
    let response = await axios.put(`${appLink}/post/comment`,comment);
    let data = response.data;
    if(data.message == 'success'){
        return data.comment;
    }
    else{
        return thunkAPI.rejectWithValue(data);
    }
})
const commentSlice = createSlice({
    name:"comment",
    initialState:{
        commentObj:{},
        isCommentSuccess:false,
        isCommentLoading:false,
        isCommentError:false,
        commentErrMsg:''
    },
    reducers:{

    },
    extraReducers:(builder) => {
        builder.
        addCase(createComment.pending,(state,action) => {
            state.isCommentLoading = true;
            state.isCommentError = false;
            state.isCommentSuccess = false;
            state.commentErrMsg = ''
        })
        .addCase(createComment.fulfilled,(state,action) => {
            state.isCommentLoading = false;
            state.isCommentError = false;
            state.isCommentSuccess = true;
            state.commentErrMsg = '';
            state.commentObj = action.payload;
        })
        .addCase(createComment.rejected,(state,action) => {
            state.isCommentLoading = false;
            state.isCommentError = true;
            state.isCommentSuccess = false;
            state.commentErrMsg = action.payload.message;
            state.commentObj = {};
        })
    }
})

export const {} = commentSlice.actions;
export default commentSlice.reducer;