import React,{useState} from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from '../../slices/userSlice';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import {appLink} from '../../App'

function DeleteAccount(props) {
    const { userObj } = useSelector(state => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const deleteData = async () => {

        let userId = userObj[0]._id;
        console.log(userId);
        let res = await axios.delete(`${appLink}/user/delete-account/${userId}`);
        console.log(res);
        props.handleClose('delete');

        if(res.data.message == 'success'){
            dispatch(clearUser({}));
            props.setToastMsg('Account deleted');
            props.toastOpen();
            navigate('/');
        }
    }

    return (
        <div>
            <Modal show={props.deleteShow} onHide={() => props.handleClose('delete')} className="settings-modal">

                <Modal.Body className='mb-0'>
                    <h3>Delete Account ?</h3>
                    <p className='text-muted'>Your account will be deleted permanently.</p>
                    <Button variant="primary" onClick={deleteData}>Delete</Button>
                </Modal.Body>

            </Modal>
        </div>
    )
}

export default DeleteAccount