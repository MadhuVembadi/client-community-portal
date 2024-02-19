import React, { useEffect } from 'react'
import {Button,Form} from "react-bootstrap"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import {useForm} from 'react-hook-form'
import LoginImg from '../../Images/login.svg'
import {useNavigate} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import { userLogin } from '../../slices/userSlice'
import {Toast} from 'bootstrap'
import './Login.css'
import {appLink} from '../../App'

function Login(props) {

  let {register,handleSubmit, formState:{errors}} = useForm()

  const navigate = useNavigate();
  let dispatch = useDispatch();

  let {userObj,isLoginError,isLoginLoading,isLoginSuccess,loginErrMsg} = useSelector(state => state.user);
  
  const onLoginup = (userObj) => {
    
    const actionObj = userLogin(userObj);
    dispatch(actionObj);
  }

  useEffect(() => {

    if(isLoginSuccess){
      props.setToastMsg('login success');
      props.toastOpen();
      navigate('/home');
    }
    if(isLoginError != ''){
      // const toastLiveExample = document.getElementById('liveToast-login');
      // const toastBootstrap = new Toast(toastLiveExample,{
      //   autohide:true,
      //   delay:3000
      // });
      // toastBootstrap.show();
      props.setToastMsg(loginErrMsg);
      props.toastOpen();
    }
  },[isLoginSuccess,isLoginError])

  return (
    <div>
      <div className='login row row-cols-md-2 row-cols-1 mx-auto border border-2 rounded-3 p-5 '>
        <div className='col d-flex justify-content-center align-items-center mb-4'>
          <img src={LoginImg} className='w-100 d-block mx-auto '/>
        </div>
        <div className='col loginForm'>
          <h3>Login</h3>
          <form className="mt-3 mb-2" onSubmit={handleSubmit(onLoginup)}>
              <div className='mb-3'>
                <div className='form-floating'>
                  <input type="text" className='form-control' id="username" placeholder='username' {
                      ...register("username",{required:true})
                  }/>
                  <label htmlFor="username">Username</label>
                  {
                    errors.username && <p className='text-danger text-start'>*required</p>
                  }
                </div>
              </div>
              
              <div>
                <div className='form-floating'>
                  <input type="password" className='form-control' id="password" placeholder='password' {
                        ...register("password",{required:true})
                    }/>
                  <label htmlFor="password">Password</label>
                  {
                    errors.password && <p className='text-danger text-start'>*required</p>
                  }
                </div>
              </div>

              <div className='mt-3'>
                <Button type="submit" className='w-100' >
                  <FontAwesomeIcon icon={faArrowRightToBracket} className=" me-2" />Login
                </Button>
              </div>
          </form>
          <p>New User? <a href="/signup">signup</a></p>
          <a href="/forgotPassword">Forgot Password?</a>
        </div>
      </div>
      {/* <div className="toast-container position-fixed top-0 end-0 p-3">
        <div id="liveToast-login" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">Message</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body" id="toastBody-login">
              {loginErrMsg}
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Login  