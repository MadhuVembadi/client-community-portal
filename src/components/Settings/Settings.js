import React,{useState} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {Button} from 'react-bootstrap'
import axios from 'axios'
import {toggleEmailNotification,clearUser} from '../../slices/userSlice'
import { useNavigate } from 'react-router-dom'
import DeleteAccount from './DeleteAccount'
import EmailChange from './EmailChange'
import PasswordChange from './PasswordChange'
import {appLink} from '../../App'



function Settings(props) {

    let {userObj} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let [emailShow, setEmailShow] = useState(false);
    let [passwordShow, setPasswordShow] = useState(false);
    let [deleteShow, setDeleteShow] = useState(false);

    const handleShow = (type) => {

        if (type == 'email') {
            setEmailShow(true);
            setPasswordShow(false);
            setDeleteShow(false);
        }
        else if (type == 'password') {
            setEmailShow(false);
            setPasswordShow(true);
            setDeleteShow(false);
        }
        else if (type == 'delete') {
            setDeleteShow(true);
            setEmailShow(false);
            setPasswordShow(false);
        }
    }

    const handleClose = (type) => {
        if (type == 'email') {
            setEmailShow(false);
        }
        else if (type == 'password') {
            setPasswordShow(false);
        }
        else if (type == 'delete') {
            setDeleteShow(false);
        }
    }


    // const deleteAccount = async (userId) => {
    //     console.log(userId);
    //     let res = await axios.delete(`${appLink}/user/delete-account/${userId}`);
    //     console.log(res);
    //     if(res.data.message == 'success'){
    //         dispatch(clearUser({}));
    //         props.setToastMsg('Account deleted');
    //         props.toastOpen();
    //         navigate('/');
    //     }
    // }
    
    const toggleNotifications = async (userId) => {
        let obj = {
            userId:userId,
            changeTo:!userObj[0].emailNotifications
        }

        let res = await axios.put(`${appLink}/user/toggle-notifications`,obj);
        
        if(res.data.message == 'success'){
            let actionObj = toggleEmailNotification({...userObj[0],emailNotifications:!userObj[0].emailNotifications});
            dispatch(actionObj);
            props.setToastMsg('updated');
            props.toastOpen();
        }
        else{
            props.setToastMsg(res.data.message);
            props.toastOpen();
        }
        console.log(obj);
        
    }

    
    
    return (
        <div className='settings mt-5'>
            <div className='settings-account'>
                <h3 className='text-primary'>Account</h3>
                <div className='row row-cols-md-2 row-cols-1 mb-4'>
                    <div className='col col-md-8'>
                        <p className='mb-0'>Update email</p>
                        <p className='text-muted'>Change the email address connected to your account.</p>
                    </div>
                    <div className='col col-md-4'>
                        <Button onClick={() => handleShow('email')} className='w-50 d-block rounded-2'>update email</Button>
                    </div>
                    {/*Email Modal*/}
                    {
                        emailShow && <EmailChange handleClose={handleClose} handleShow={handleShow} emailShow={emailShow} setToastMsg={props.setToastMsg} toastOpen={props.toastOpen} />
                    }
                </div>

                <div className='row row-cols-md-2 row-cols-1 mb-4'>
                    <div className='col col-md-8'>
                        <p className='mb-0'>Update password</p>
                        <p className='text-muted'>Change your password.</p>
                    </div>
                    <div className='col col-md-4'>
                        <Button onClick={() => handleShow('password')} className='w-50 d-block rounded-2'>update password</Button>
                    </div>
                    {/*Email Modal*/}
                    {
                        passwordShow && <PasswordChange handleClose={handleClose} handleShow={handleShow} passwordShow={passwordShow} setToastMsg={props.setToastMsg} toastOpen={props.toastOpen} />
                    }
                </div>

                <div className='row row-cols-md-2 row-cols-1 mb-4'>
                    <div className='col col-md-8'>
                        <p className='mb-0'>Delete account</p>
                        <p className='text-muted'>Deletes your account and all data connected to it.</p>
                    </div>
                    <div className='col col-md-4'>
                        <Button onClick={() => handleShow('delete')} className='w-50 d-block rounded-2'>Delete account</Button>
                    </div>
                    {
                        deleteShow && <DeleteAccount handleClose={handleClose} handleShow={handleShow} deleteShow={deleteShow} setToastMsg={props.setToastMsg} toastOpen={props.toastOpen}/>
                    }
                </div>
                    
            </div>
            <div className='settings-notification'>
                <h3 className='text-primary'>Notifications</h3>
                <div className='row row-cols-md-2 row-cols-1 mb-4'>
                    <div className='col col-md-8'>
                        <p className='mb-0'>Email notifications</p>
                        <p className='text-muted'>Enable/Disable email notifications</p>
                    </div>
                    <div className='col col-md-4'>
                        <Button onClick={() => toggleNotifications(userObj[0]._id)} className='w-50 d-block rounded-2'>
                            {
                                !userObj[0].emailNotifications ? <>Enable</> : <>Disable</> 
                            }
                        </Button>
                    </div>
                    {/*Email Modal*/}
                    {/* {
                        emailShow && <Email handleClose={handleClose} handleShow={handleShow} emailShow={emailShow} />
                    } */}
                </div>
            </div>
        </div>
    )
}

export default Settings