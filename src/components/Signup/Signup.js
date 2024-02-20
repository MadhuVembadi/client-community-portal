import React, { useEffect,useState } from 'react'
import {Button,Form} from "react-bootstrap"
import {getCountries} from 'country-state-picker'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUserPlus} from '@fortawesome/free-solid-svg-icons'
import {useForm} from 'react-hook-form'
import './Signup.css'
import SignupImage from '../../Images/undraw_details_8k13.svg'
import {useNavigate, userNavigate} from 'react-router-dom'
import axios from 'axios'
import {Toast} from 'bootstrap';
import {appLink} from '../../App'
import { IoIosInformationCircleOutline } from "react-icons/io";

function Signup(props) {

  let [countries,setCountries] = useState([]);

  let {register,handleSubmit, formState:{errors}} = useForm()

  const navigate = useNavigate();

  const usernamePattern = /^[a-z]+(?:[._]+?[a-z0-9]+)*[a-z0-9]$/;

  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{7,15}$/;

  const phonePattern = /^\d{10}$/;
  
  const fetchCountries = async () => {
    let res = getCountries();
    setCountries(res);
  }

  const onSignup = async (userObj) => {
    console.log(userObj);
    let res = await axios.post(`${appLink}/user/signup`,userObj)
    let data = res.data;
    console.log(res);
    if(data.message == 'success'){
        navigate('/login');
    }
    else{
      props.setToastMsg(data.message);
      props.toastOpen();
      // const toastLiveExample = document.getElementById('liveToast');
      // const toastBootstrap = new Toast(toastLiveExample,{
      //   autohide:true,
      //   delay:3000
      // });
      // const toastBody = document.getElementById('toastBody');
      // toastBody.innerHTML = data.message;
      // toastBootstrap.show();
      // console.log('opened');
    }
  }

  useEffect(() => {
    fetchCountries();
  },[])

  return (
    <div className='signupcontainer d-flex'>
      
      <img src={SignupImage} className='signupImg'/>
      <div className='signup mt-3 border shadow rounded-5 p-5'>
        <h3 className='mb-3 text-center'>Become a Change Maker!</h3>
        <form onSubmit={handleSubmit(onSignup)}>
          <div className='row'>
            <div className='col'>
              <div  className='form-floating'>
                <input type="text" className='form-control' id="firstName" placeholder='first name' {
                    ...register("firstname",{required:true})
                }/>
                <label htmlFor="firstName">First Name</label>
                {
                  errors.firstname && <p className='text-danger text-start'>*required</p>
                }
              </div>
            </div>

            <div className='col'>
              <div className='form-floating'>
                <input type="text" className='form-control' id="lastName" placeholder='last name' {
                      ...register("lastname",{required:true})
                  }/>
                <label htmlFor="lastName">Last Name</label>
                {
                  errors.lastname && <p className='text-danger text-start'>*required</p>
                }
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className='form-floating'>
                <input type="email" className='form-control' id="email" placeholder='name@example.com' {
                      ...register("email",{required:true})
                  }/>
                <label htmlFor="email">Email</label>
                {
                  errors.email && <p className='text-danger text-start'>*required</p>
                }
              </div>
            
          </div>
          
          <div className="mt-3">
            <div className='form-floating'>
                <input type="text" className='form-control' id="organisation" placeholder='name@example.com' {
                      ...register("organisation",{required:true})
                  }/>
                <label htmlFor="organisation">Organisation</label>
                {
                  errors.organisation && <p className='text-danger text-start'>*required</p>
                }
              </div>
            
          </div>

          <div className="row mt-3">

            <div className='col-4'>
              <div className='form-floating'>
                <select className="form-select" {...register("countrycode",{required:"true"})} >
                  {
                      countries.map((country,idx) => 
                        <option value={country.dial_code} key={idx}>{country.name} {country.dial_code}</option>
                      )
                  }
                </select>
                <label htmlFor="country">Code</label>
                {
                  errors.country && <p className='text-danger text-start'>*required</p>
                }
              </div>
            </div>  

            <div className='col-8'>
              
              <div className='form-floating'>
                <input type="text" className='form-control' id="phone" placeholder='Phone' {
                      ...register("phone", {
                          required:true,
                          pattern:{
                            value:phonePattern,
                            message:'Invalid phone number'
                          },
                          validate:(value) => phonePattern.test(value)
                        })
                  }/>
                <label htmlFor="phone">Phone</label>
                {
                  errors.phone?.type == "required" && <p className='text-danger text-start'>*required</p>
                }
                {
                  errors.phone && <p className='text-danger text-start'>{errors.phone.message}</p>
                }
              </div>
              
            </div>
          </div>
                    
          <div className='mt-3'>
            <div className='form-floating'>
                <input type="text" className='form-control' id="username" placeholder='user name' {
                      ...register("username", {
                          required:true,
                          pattern:{
                            value:usernamePattern,
                            message:'Invalid username format'
                          },
                          validate:(value) => usernamePattern.test(value)
                        })
                  }/>
                <label htmlFor="username">Username</label>
                {
                  errors.username?.type == 'required' && <p className='text-danger text-start'>*required</p>
                }
                {
                  errors.username && <p className='text-danger text-start'>{errors.username.message}</p>
                }
                <p className='form-text'>only lowercase letters, digits,period and an underscore are allowed</p>
              </div>
          </div>
            
          <div className='mt-3'>
              <div className='form-floating'>
                <input type="password" className='form-control' id="password" placeholder='Password' {
                      ...register("password",{
                          required:true,
                          pattern:{
                            value:passwordPattern,
                            message:'Invalid password format'
                          },
                          validate: (value) => passwordPattern.test(value)
                        })
                  }/>
                <label htmlFor="password">Password</label>
                {
                  errors.password?.type == 'required' && <p className='text-danger text-start'>*required</p>
                }
                {
                  errors.password && <p className='text-danger text-start'>{errors.password.message}</p>
                }
                <p className='form-text'>Atleast one special character, one capital case and a digit. <br/>Min of 7 and max of 15 characters</p>
              </div>
          </div>
          
          <div className='mt-3'>
            <Button type="submit" className='w-100' >
              <FontAwesomeIcon icon={faUserPlus} className="me-2" />Sign Up
            </Button>
          </div>
          
        </form>
        <p className='mt-2'>Already a user? <a href='/login'>Login</a></p> 
      </div>
      

    {/* <div className="toast-container position-fixed top-25 end-0 p-3">
      <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <strong className="me-auto">Message</strong>
          <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div className="toast-body" id="toastBody">
        </div>
      </div>
    </div> */}
    </div>
  )
}

export default Signup