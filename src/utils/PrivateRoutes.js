import React, { useEffect,useState } from 'react'
import {Outlet,Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux'
import {appLink} from '../App'
import { clearUser,userLogout } from '../slices/userSlice';
import {useDispatch} from 'react-redux'
import axios from 'axios'

function PrivateRoutes(props) {

    let dispatch = useDispatch();

    let {userObj,isLoginSuccess} = useSelector(state => state.user);

    async function validateLogin(){

        if(isLoginSuccess){
            let res = await axios.post(`${appLink}/validate`);
            console.log(res);
            if(res.data.message == 'unauthorized access' || res.data.message == "session expired"){
                alert(res.data.message);
                dispatch(clearUser({}));
                let actionObj = userLogout(userObj);
                dispatch(actionObj);
                localStorage.clear()
            }
        }
    }

    
    validateLogin();

    return (
        isLoginSuccess ? <Outlet /> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes