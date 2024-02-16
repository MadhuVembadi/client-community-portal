import React from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { updateUser } from '../../slices/userSlice'
import { useState } from 'react';
import axios from 'axios'
import {appLink} from '../../App'

function PasswordChange(props) {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { userObj } = useSelector(state => state.user);

    let [misMatch, setMisMatch] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFormSubmit = async (obj) => {

        if (obj.newpassword !== obj.cpassword) {
            setMisMatch(true);
            return;
        }

        // let actionObj = updateDetails({ changes: obj, user: userObj });
        // dispatch(actionObj);


        let res = await axios.put(`${appLink}/user/update-password`,{
                newPassword:obj.newpassword,
                password:obj.password,
                originalPassword:userObj[0].password,
                userId:userObj[0]._id
            }
        );
        console.log(res.data);
        if(res.data.message == 'success'){
            let actionObj = updateUser({...userObj[0],password:res.data.newpassword});
            dispatch(actionObj);
            props.setToastMsg('updated');
            props.toastOpen();
            props.handleClose('password');
        }
        else{
            props.setToastMsg(res.data.message);
            props.toastOpen();
        }
    }

    return (
        <div>
            <Modal show={props.passwordShow} onHide={() => props.handleClose('password')} className="settings-modal">
                <Modal.Header>Update password</Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleSubmit(onFormSubmit)}>
                        <Form.Control type="password" className='mb-4' placeholder="Password" {...register("password", { required: true })} />
                        {
                            errors.type?.password === 'required' && <p className='text-start' style={{ color: "#e2b714" }}>
                                * This is a required field
                            </p>
                        }

                        <Form.Control type="password" className='mb-4' placeholder="New password" {...register("newpassword", { required: true })} />
                        {
                            errors.type?.newpassword === 'required' && <p className='text-start' style={{ color: "#e2b714" }}>
                                * This is a required field
                            </p>
                        }

                        <Form.Control type="password" className='mb-4' placeholder="Confirm new password" {...register("cpassword", { required: true })} />
                        {
                            errors.type?.cpassword === 'required' && <p className='text-start' style={{ color: "#e2b714" }}>
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
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default PasswordChange