import React, { useEffect,useRef } from 'react'
import {useForm} from 'react-hook-form'
import ProfileImg from '../../Images/ProfileImg.svg'
import {Button} from 'react-bootstrap'
import { IoSend } from "react-icons/io5";
import {createComment} from '../../slices/commentSlice'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios';
import $ from 'jquery'
import { getPost } from '../../slices/postSlice';
import {appLink} from '../../App'
import './CommentsForm.css'

function CommentsForm(props) {
  let {register,handleSubmit,reset,formState:{errors}} = useForm();
  let {commentObj,isCommentSuccess,isCommentLoading,isCommentError,commentErrMsg} = useSelector(state => state.comment)
  let {userObj} = useSelector(state => state.user)
  let dispatch = useDispatch();

  const isInitial = useRef(true);

  console.log(props);

  const sendEmail = async (notifyObj) => {

    if(userObj[0].emailNotifications){
        let res = await axios.post(`${appLink}/notification/send-email`,notifyObj);
        console.log(res);
    }
  }

  const postNotification = async (post) =>{
    let d = new Date();
    console.log("post notification",props.post.user,props.user);
    let notificationObj = {
      postId:post._id,
      type:"comment",
      from:props.userObj[0]._id,
      fromUser:props.userObj[0].username,
      to: props.post.user ? props.post.user[0]._id : props.user ? props.user._id : props.userObj[0]._id,
      message:`${props.userObj[0].username} has commented on your post`,
      status:'unread',
      date:d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()
    }
    console.log(notificationObj);
    let res = await axios.put(`${appLink}/notification/`,notificationObj);
    sendEmail(notificationObj);
    console.log(res);
  }
  
  const postComment = async (comment,post) => {
    let obj = {
      comment:comment[`comment-text-${post._id}`],
      postId:post._id,
      userId:post.userId,
      username:props.userObj[0].username
    }
    console.log(obj);
    let actionObj = createComment(obj);
    dispatch(actionObj);
    dispatch(getPost({postId:post._id,userId:props.userObj[0]._id}));
    reset();
    postNotification(post);
    // let res = await axios.put(`${appLink}/post/comment`,obj);
    // console.log(res);
    // $(`form#${post._id}`).reset()
  }

  const toggleToast = (msg) => {
    props.setToastMsg(msg);
    props.toastOpen();
  }

  useEffect(() => {
    if(commentObj){
      if(isInitial.current){
        isInitial.current = false;
        // dispatch(clearPost);
      }
      else{
        if(isCommentLoading){
          toggleToast('posting...');
        }
        else if(isCommentSuccess){
          toggleToast('posted');
        }
        else if(isCommentError){
          toggleToast(commentErrMsg)
        }
      }
    }
  },[isCommentLoading,isCommentSuccess,isCommentError])

  return (
    <div className='commentForm d-flex add-comment row p-2 border-bottom border-top border-1 rounded'>
      <div className='add-comment-profile-icon col-md-1 col-2 d-flex align-items-center'>
        <img src={ProfileImg} className='w-100 d-block mx-auto comment-profile-img'/>
      </div>
      <div className='add-comment-input col-md-11 col-10'>
        <form key={props.post._id} id={props.post._id} onSubmit={handleSubmit((data) => postComment(data,props.post))}>
          <textarea className="form-control" name={`comment-text-${props.post._id}`} placeholder='Add a comment...' rows="1" {...register(`comment-text-${props.post._id}`)} />
          <Button type="submit" className='btn d-block ms-auto mt-2' >
            <IoSend/>
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CommentsForm