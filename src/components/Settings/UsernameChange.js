import React from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { updateUser } from '../../slices/userSlice'
import { useState } from 'react';
import axios from 'axios'
import {appLink} from '../../App'

function UsernameChange(props) {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { userObj } = useSelector(state => state.user);

    // let [misMatch, setMisMatch] = useState(false);
    const usernamePattern = /^[a-z]+(?:[._]+?[a-z0-9]+)*[a-z0-9]$/;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFormSubmit = async (obj) => {

        // if (obj.newpassword !== obj.cpassword) {
        //     setMisMatch(true);
        //     return;
        // }

        // let actionObj = updateDetails({ changes: obj, user: userObj });
        // dispatch(actionObj);


        let res = await axios.put(`${appLink}/user/update-username`,{
                newUsername:obj.newusername,
                password:obj.password,
                originalPassword:userObj[0].password,
                userId:userObj[0]._id
            }
        );
        console.log(res.data);
        if(res.data.message == 'success'){
            let actionObj = updateUser({...userObj[0],username:obj.newusername});
            dispatch(actionObj);
            props.setToastMsg('updated');
            props.toastOpen();
            props.handleClose('username');
        }
        else{
            props.setToastMsg(res.data.message);
            props.toastOpen();
        }
    }

    return (
        <div>
            <Modal show={props.usernameShow} onHide={() => props.handleClose('username')} className="settings-modal">
                <Modal.Header>Update username</Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleSubmit(onFormSubmit)}>
                        <Form.Control type="password" className='mb-4' placeholder="Password" {...register("password", { required: true })} />
                        {
                            errors.type?.password === 'required' && <p className='text-start' style={{ color: "#e2b714" }}>
                                * This is a required field
                            </p>
                        }

                        <Form.Control type="text" className='mb-4' placeholder="New username" {...register("newusername", {
                            required:true,
                            pattern:{
                                value:usernamePattern,
                                message:'Invalid username format'
                            },
                            validate:(value) => usernamePattern.test(value)
                            })} 
                        />
                        {
                            errors.type?.newusername === 'required' && <p className='text-start' style={{ color: "#e2b714" }}>
                                * This is a required field
                            </p>
                        }
                        {
                            errors.newusername && <p className='text-danger text-start'>{errors.newusername.message}</p>
                        }
                        <p className='form-text'>only lowercase letters, digits,period and an underscore are allowed</p>

                        <Button variant="primary" type="submit" >Update</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default UsernameChange