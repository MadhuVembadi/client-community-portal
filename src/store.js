import {configureStore} from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import postReducer from './slices/postSlice'
import commentReducer from './slices/commentSlice'
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';

const persistConfig = {
    key:"root",
    version:1,
    storage
};

const reducer = combineReducers({
    user:userReducer,
    post:postReducer,
    comment:commentReducer
})

const persistedReducer = persistReducer(persistConfig,reducer);

export const store = configureStore({
    reducer:persistedReducer
})