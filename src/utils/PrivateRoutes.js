import React from 'react'
import {Outlet,Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux'

function PrivateRoutes(props) {

    let {isLoginSuccess} = useSelector(state => state.user);
    return (
        isLoginSuccess ? <Outlet /> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes