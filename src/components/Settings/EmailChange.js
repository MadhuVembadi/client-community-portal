import React from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {  updateUser } from '../../slices/userSlice'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import axios from 'axios';
import {appLink} from '../../App'


function EmailChange(props) {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const { userObj } = useSelector(state => state.user);

    let [misMatch, setMisMatch] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFormSubmit = async (obj) => {

        if (obj.email !== obj.cemail) {
            setMisMatch(true);
            return;
        }

        let res = await axios.put(`${appLink}/user/update-email`,{
                password:obj.password,
                originalPassword:userObj[0].password,
                newEmail:obj.email,
                userId:userObj[0]._id
            }
        );
        console.log(res);
        if(res.data.message == 'success'){
            let actionObj = updateUser({...userObj[0],email:obj.email});
            dispatch(actionObj);
            props.setToastMsg('updated');
            props.toastOpen();
            props.handleClose('email');
        }
        else{
            props.setToastMsg(res.data.message);
            props.toastOpen();
        }

        
    }

    return (
        <div>
            <Modal show={props.emailShow} onHide={() => props.handleClose('email')} className="settings-modal">
                <Modal.Header>Update email</Modal.Header>
                <Modal.Body className='mb-0'>
                    <Form onSubmit={handleSubmit(onFormSubmit)}>

                        <Form.Control type="password" placeholder="Password" className='mb-4' {...register("password", { required: true })} />

                        {
                            errors.password?.type === 'required' && <p className='text-start text-danger'>* This is a required field</p>
                        }


                        <Form.Control type="email" placeholder="New email" className='mb-4' {...register("email", { required: true })} />
                        {
                            errors.password?.type === 'required' && <p className='text-start text-danger'>* This is a required field</p>
                        }


                        <Form.Control type="email" placeholder="Confirm new email" className='mb-4' {...register("cemail", { required: true })} />
                        {
                            errors.password?.type === 'required' && <p className='text-start text-danger'>* This is a required field</p>
                        }

                        {
                            misMatch &&
                            <p className='text-start mb-3 text-danger'>
                                * Emails must match
                            </p>
                        }

                        <Button type="submit" variant='primary'>Update</Button>

                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default EmailChange