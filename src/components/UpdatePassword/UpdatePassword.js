import React,{useState} from 'react'
import {Form,Button} from 'react-bootstrap'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {appLink} from '../../App';


function UpdatePassword(props) {
    let {register,handleSubmit,formState:{errors}} = useForm();

    let [misMatch, setMisMatch] = useState(false);
    const navigate = useNavigate();

    const onFormSubmit = async (passwordObj) => {

        if (passwordObj.newpassword !== passwordObj.cpassword) {
            setMisMatch(true);
            return;
        }
        let username = localStorage.getItem("username");
        let res = await axios.put(`${appLink}/user/forgot-update`,{username:username,newpassword:passwordObj.newpassword})
        console.log(res);
        if(res.data.message == 'success'){
            props.setToastMsg(res.data.message);
            props.toastOpen();
            navigate('/login');
        }
        else{
            props.setToastMsg(res.data.message);
            props.toastOpen();
        }
    }

  return (
    <div className='forgot-update-password'>
        <div className='w-50 p-2 shadow mx-auto'>
            <Form onSubmit={handleSubmit(onFormSubmit)}>
                

                <Form.Control type="password" className='mb-4' placeholder="New password" {...register("newpassword", { required: true })} />
                {
                    errors.type?.newpassword === 'required' && <p className='text-start'>
                        * This is a required field
                    </p>
                }

                <Form.Control type="password" className='mb-4' placeholder="Confirm new password" {...register("cpassword", { required: true })} />
                {
                    errors.type?.cpassword === 'required' && <p className='text-start'>
                        * This is a required field
                    </p>
                }
                {
                    misMatch &&
                    <p className='text-start mb-3 text-danger' >
                        * Passwords must match
                    </p>
                }
                <Button variant="primary" type="submit" >Update</Button>
            </Form>
        </div>
    </div>
  )
}

export default UpdatePassword