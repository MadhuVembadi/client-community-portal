import React from 'react'
import {useForm} from 'react-hook-form';
import axios from 'axios';
function OtpRender() {

    let {register,handleSubmit,formState:{errors}} = useForm();

    const verifyOTP = async (givenOtp,originalOTP) => {
        let res = await axios.post('http://localhost:3000/user/verify-otp',{
            originalPassword:originalOTP,
            password:givenOtp
        })
        return res;
    }
    const onOTPSubmit = (userObj) => {
    
        let givenOtp = userObj.otp;
        let originalOTP = localStorage.getItem('otp');
        let res = verifyOTP(givenOtp,originalOTP);
        
        alert(res.data);
        console.log(res);

    }

    return (
        <div className='otp-render'>
            <form onSubmit={handleSubmit(onOTPSubmit)}>
                <div className='mb-3'>
                    <label htmlFor="otp" className="form-label">OTP</label>
                    <input type="text" className="form-control" id="otp" {...register('otp',{required:true})} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
  )
}

export default OtpRender