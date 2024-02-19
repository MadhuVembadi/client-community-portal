import React, { useEffect,useState,useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {Button} from 'react-bootstrap';
import { FaComment } from "react-icons/fa";
import { BiSolidUpvote } from "react-icons/bi";
import { IoNotifications } from "react-icons/io5";
import NotificationImg from '../../Images/notificationsImg.svg'
import './Notification.css'
import $ from 'jquery'
import axios from 'axios';
import {getPost,clearPost} from '../../slices/postSlice';
import {appLink} from '../../App'

function Notification(props) {

  let {userObj} = useSelector(state => state.user);
  let {postObj,isGetPostSuccess,isGetPostLoading} = useSelector(state => state.post);

  const isInitial = useRef(true);

  let [notifications,setNotifications] = useState([]);
  let [filter,setFilter] = useState('all');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeSelected = (event) => {
    let buttons = $('.filter-btn');
    buttons.toArray().forEach(btn => $(btn).removeClass('selected'));
    let selectedBtn = event.target;
    $(selectedBtn).addClass('selected')
  }

  const fetchNotifications = async (userId,filter) => {
    let res = await axios.get(`${appLink}/notification/${userId}?filter=${filter}`)
    console.log(res);
    setNotifications(res.data.notifications)
   
  }

  const applyFilter = (event,filter) => {
    console.log(filter);
    changeSelected(event);
    setFilter(filter);
    fetchNotifications(userObj[0]._id,filter);
    // retrieve notifications of type filter from the database
  }

  const markAllRead = async () => {

    let userId = userObj[0]._id;
    let res = await axios.put(`${appLink}/notification/change-status/${userId}`);
    console.log(res);
    if(res.data.message == 'success'){
      props.setToastMsg('Marked all as read');
      props.toastOpen();
    }
    else{
      props.setToastMsg('Failed to mark all as read');
      props.toastOpen();
    }
    fetchNotifications(userObj[0]._id,filter);
  }

  const fetchPost = async (postId) => {
        let userId = userObj[0]._id;
        let obj = {
          userId:userId,
          postId:postId
        }
        let actionObj = getPost(obj);
        dispatch(actionObj);
        // let res = await axios.get(`${appLink}/post/${postId}?user=${userId}`);
        // console.log(res.data.post);
        // navigate(`/view?post=${postId}`)
  }

  const markNotificationRead = async (notificationId,userId) => {

    let res = await axios.put(`${appLink}/notification/mark-read`,{notificationId:notificationId,userId:userId});
    console.log(res);
    return;
  }

  const renderPost = (notificationId,postId) => {
    fetchPost(postId);
    markNotificationRead(notificationId,userObj[0]._id)
  }

  const gotoUser = (event,username) => {
    event.stopPropagation();
    navigate(`/user/${username}`)
  }
  
  useEffect(() => {
    fetchNotifications(userObj[0]._id,'all');
  },[])

  useEffect(() => {
    if(isInitial.current){
      isInitial.current = false;
      dispatch(clearPost);
    }
    else{
      if(isGetPostSuccess){
        navigate(`/view?post=${postObj._id}`)
      }
    }
  },[isGetPostSuccess]);

  return (
    <div className='notifications row mt-4 d-flex flex-column'>
      <div className='col-2 w-100 border border-1 rounded-2 shadow p-4'>
          <h6>Filters</h6>
          <div className='w-100 d-flex justify-content-around'>
            <div>
              <Button variant="none" className='filter-btn selected ps-0' onClick={(event) => applyFilter(event,"all")}>All notifications</Button>
            </div>
            <div>
              <Button variant="none" className="filter-btn ps-0" onClick={(event) => applyFilter(event,"like")}>Upvotes</Button>
            </div>
            <div>
              <Button variant="none" className="filter-btn ps-0" onClick={(event) => applyFilter(event,"comment")}>Comments</Button>
            </div>
          </div>
      </div>
      <div className='col-10 mt-4 w-75 mx-auto'>
        <div className='d-flex justify-content-between mb-2'>
          <h6 className='d-flex align-items-center mb-0'>Notifications</h6>
          <Button variant='primary' onClick={markAllRead}>Mark all as read</Button>
        </div>
        
        <div className=''>
          {/* render all the notifications fetched from the database */}
          {
            notifications.length != 0 &&
            notifications.map((notification,idx) => 
            <div key={idx} className={`notification w-100 p-4 mb-2 rounded shadow d-flex ${notification.status}`} onClick={() => renderPost(notification._id,notification.postId)}>
              <div className='me-4'>
                {notification.type == "like" && <BiSolidUpvote color='blue' size={25}/>}
                {notification.type == "comment" && <FaComment color='blue' size={25}/>}
                {notification.type == 'other' && <IoNotifications color='blue' size={25} />}
              </div>
              <div>
                  {
                    notification.type == 'like' && 
                    <p>
                      <span className='notification-username' onClick={(event) => gotoUser(event,notification.fromUser)}>{notification.fromUser}</span> has upvoted your <span className='notification-post'>post</span>
                    </p>
                  }
                  {
                    notification.type == 'comment' && 
                    <p>
                      <span className='notification-username' onClick={(event) => gotoUser(event,notification.fromUser)}>{notification.fromUser}</span> has commented your <span className='notification-post'>post</span>
                    </p>
                  }
                  {
                    notification.type == 'other' && 
                    <p>
                      {notification.message}
                    </p>
                  }
                  <span className='fs-6 fw-lighter'>{notification.date}</span>
              </div>
              {
                    notification.status == 'unread' && 
                    <span className='badge rounded-pill bg-danger border border-light rounded-circle p-2'>
                      <span class="visually-hidden">New alerts</span>
                    </span>
              }
            </div>
            
            )
          }
          {
            notifications.length == 0 && 
            <div className='mt-5'>
              <img src={NotificationImg} className='w-50 d-block mx-auto'/>
              <h6 className='text-center'>No notifications</h6>
            </div>
          }
          {/*
          <div className='notification w-100 p-4 mb-2 rounded shadow unread d-flex'>
            <div className='me-4'>
                <BiSolidUpvote color='blue' size={25}/>
              </div>
              <div>
                <p>Congratulations! Madhu Vembadi has upvoted your post.</p>
                <span className='fs-6 fw-lighter'>2 days ago</span>
          </div>
          </div>  
          <div className='notification w-100 p-4 mb-2 rounded shadow d-flex'>
            <div className='me-4'>
              <FaComment color='blue' size={25}/>
            </div>
            <div>
              <p>Madhu Vembadi has commented on your post</p>
              <span className='fs-6 fw-lighter'>2 days ago</span>
            </div>
            
          </div>
          <div className='notification w-100 p-4 mb-2 rounded shadow'>
            <p>There is one new comment on your post</p>
            <span className='fs-6 fw-lighter'>2 days ago</span>
          </div>
          <div className='notification w-100 p-4 mb-2 rounded shadow'>
            <p>Darwinbox has replied to your post</p>
            <span className='fs-6 fw-lighter'>2 days ago</span>
          </div>
          <div className='notification w-100 p-4 mb-2 rounded shadow unread'>
            <p>Congratulations! Madhu Vembadi has upvoted your post.</p>
            <span className='fs-6 fw-lighter'>2 days ago</span>
          </div>
          <div className='notification w-100 p-4 mb-2 rounded shadow'>
            <p>Congratulations! Madhu Vembadi has upvoted your post.</p>
            <span className='fs-6 fw-lighter'>2 days ago</span>
          </div>
          <div className='notification w-100 p-4 mb-2 rounded shadow'>
            <p>Congratulations! Madhu Vembadi has upvoted your post.</p>
            <span className='fs-6 fw-lighter'>2 days ago</span>
          </div>
          <div className='notification w-100 p-4 mb-2 rounded shadow unread'>
            <p>Congratulations! Madhu Vembadi has upvoted your post.</p>
            <span className='fs-6 fw-lighter'>2 days ago</span>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Notification