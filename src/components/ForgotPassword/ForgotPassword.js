import React,{useState} from 'react'
import { UseSelector } from 'react-redux';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import OtpRender from './OtpRender';
import $ from 'jquery'
import {useNavigate} from 'react-router-dom';
import {appLink} from '../../App'

function ForgotPassword(props) {

    let [otpShow,setOtpShow] = useState(false);
    let {register,handleSubmit,formState:{errors}} = useForm();

    const navigate = useNavigate();

    const verifyOTP = async (userObj) => {
        let givenOtp = userObj.otp;
        let originalOTP = localStorage.getItem('otp');
        let res = await axios.post(`${appLink}/user/verify-otp`,{
            originalPassword:originalOTP,
            password:givenOtp
        })
        console.log(res);
        if(res.data && res.data == 'success'){
            navigate('/update-password');
        }
    }

    const onFormSubmit = async (userObj) => {
        console.log(userObj);
        if(userObj.otp != ""){
            verifyOTP(userObj);
            return;
        }
        let res = await axios.post(`${appLink}/user/send-otp/${userObj.username}`)
        console.log(res);
        if(res.data.message == 'success'){
            setOtpShow(true);
            props.setToastMsg('OTP has been set to registered email id');
            props.toastOpen();
    
            let otpButton = $('.otp-btn');
            $(otpButton).html("Submit");

            localStorage.setItem("otp",res.data.otp);
            localStorage.setItem("username",userObj.username);
        }
        else{
            props.setToastMsg(res.data.message);
            props.toastOpen();
        }
       

        // if(res.data.user){

        //     let res2 = await axios.post(`${appLink}/user/send-otp`,{to:res.data.user.email})
        //     console.log(res2);
        //     if(res2.data.message == 'success'){
                
        //     }
        //     else{
        //         props.setToastMsg(res2.data.message);
        //         props.toastOpen();
        //     }

        // }
        // else{
           
        // }

    }

    return (
        <div className='forgot-password'>
            <div className='w-50 mx-auto mt-5'>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" {...register('username',{required:true})} />
                    </div>
                    {
                        errors.type?.username == 'required' && <p className='text-danger'>* required</p>
                    }
                    <div className='mb-3'>
                        <label htmlFor="otp" className="form-label">OTP</label>
                        <input type="text" className="form-control" id="otp" {...register('otp')} />
                    </div>
                    <button type="submit" className="btn btn-primary otp-btn">Send OTP</button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword