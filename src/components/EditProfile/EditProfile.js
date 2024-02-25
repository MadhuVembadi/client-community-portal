import React from 'react'
import {Modal,Button} from 'react-bootstrap'
import { useSelector,useDispatch } from 'react-redux'
import './EditProfile.css'
import $ from 'jquery'
import ProfileImg from '../../Images/ProfileImg.svg'
import axios from 'axios'
import { updateUser } from '../../slices/userSlice'
import { useNavigate } from 'react-router-dom'

function EditProfile(props) {

    let {userObj}= useSelector(state => state.user);

    let navigate = useNavigate();
    let dispatch = useDispatch();
    // $(document).on('load',function(){
    //     // Prepare the preview for profile picture
    //         $("#wizard-picture").on('change',function(event){
    //             console.log(event.target);
    //             readURL(this);
    //         });
    //     });
    function readURL(event) {
        console.log(event);
        let input = event.target;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
    
            reader.onload = function (e) {
                $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    // async function onFormSubmit() {
    //     console.log('formsubmit');
    //     let username = $('#username-field')[0].value;
    //     let img = $('#wizard-picture')[0].files[0];

    //     let formData = new FormData();
    //     formData.append('image',img);
    //     formData.append('userId',userObj[0]._id);
    //     formData.append('username',username);

    //     let res = await axios.put('/user/update-profile',formData);
    //     console.log(res);
    //     props.setToastMsg(res.data.message);
    //     props.toastOpen();
    //     // props.setEditModalOpen(false);
        
    // }

    async function updateUsername() {
        let username = $('#username-field')[0].value;
        let oldUsername = userObj[0].username;
        let obj = {
            username:username,
            userId:userObj[0]._id
        }
        let res = await axios.put('/user/update-username',obj);
        console.log(res);
        props.setToastMsg(res.data.message);
        props.toastOpen();
        if(res.data.message == 'success'){
            dispatch(updateUser({
                ...userObj[0],
                username:username
            }))
            window.history.deleteUrl(`http://localhost:3000/user/${oldUsername}`)
        }
    }

    async function updateProfilePicture() {
        let img = $('#wizard-picture')[0].files[0];
        let formData = new FormData();
        formData.append('image',img);
        formData.append('userId',userObj[0]._id);

        let res = await axios.put('/user/update-profile-picture',formData);
        console.log(res);
        props.setToastMsg(res.data.message);
        props.toastOpen();
        if(res.data.message == 'success'){
            dispatch(updateUser({
                ...userObj[0],
                profilePicture:res.data.profilePicture
            }))
        }
    }

  return (
    <>
        <Modal
            show={props.editModalOpen}
            onHide={() => props.setEditModalOpen(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <div className='picture-container edit-profile-picture mb-2'>
                    <div className="picture">
                        <img src={userObj[0].profilePicture} className="picture-src" id="wizardPicturePreview" title="" />
                        <input type="file" id="wizard-picture" className="" onChange={readURL}/>
                    </div>
                    <h6 className=""><p>Choose new picture</p></h6>
                    
                </div>
                <Button onClick={updateProfilePicture} className='d-block mx-auto'>Save new profile picture</Button>
                {/* <div className='edit-username mb-2 mt-3'>
                    <p className='fw-bold'>Change username</p>
                    <input className='form-control' id="username-field" type="text" placeholder={userObj[0].username}/>
                </div>
                <Button onClick={updateUsername} className='d-block mx-auto'>Save new username</Button> */}
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={() => props.setEditModalOpen(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}

export default EditProfile