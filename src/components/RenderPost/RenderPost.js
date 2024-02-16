import axios from 'axios';
import React,{useEffect,useState} from 'react'
import {Card} from 'react-bootstrap'
import { useSelector,useDispatch } from 'react-redux';
import ProfileImg from '../../Images/ProfileImg.svg'
import {BiUpvote,BiSolidUpvote} from 'react-icons/bi'
import {FaRegComment} from 'react-icons/fa';
import CommentsForm from '../CommentsForm/CommentsForm';
import './RenderPost.css'
import { getPost } from '../../slices/postSlice';
import { appLink} from '../../App'

function RenderPost(props) {

    // let [post,setPost] = useState({});
    let {postObj} = useSelector(state => state.post);
    let {userObj} = useSelector(state => state.user);

    const dispatch = useDispatch();

    const updateVote = async (op,obj) => {
        let res = await axios.put(`${appLink}/post/${op}`,obj);
        console.log(res);
        dispatch(getPost({postId:obj.postId,userId:userObj[0]._id}));
        let d = new Date();
        if(op == 'like'){
            let notificationObj = {
                type:op,
                from:userObj[0]._id,
                fromUser:userObj[0].username,
                postId:obj.postId,
                to:obj.postedBy,
                message:`${userObj[0].username} has upvoted your post`,
                status:'unread',
                date:d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()
            }
            console.log(notificationObj);
            let res = await axios.put(`${appLink}/notification/`,notificationObj);
            console.log(res);
        }  
    }

    const toggleVote = (postId) => {
        if(postObj.upvoted){
            updateVote('dislike',{userId:userObj[0]._id,postId:postId,upvotesCount:postObj.upvotesCount - 1})
        }
        else{
            updateVote('like',{userId:userObj[0]._id,postId:postId,upvotesCount:postObj.upvotesCount + 1,postedBy:postObj.user[0]._id})
        }
    }

    const showComments = (event) => {
        console.log(event);
    }


    // const fetchPost = async (postId) => {
    //     let userId = userObj[0]._id;
    //     let res = await axios.get(`${appLink}/post/${postId}?user=${userId}`);
    //     console.log(res.data.post);
    //     setPost(res.data.post);
    //     console.log(post);
    // }

    // const getPost = () => {
    //     let searchQuery = window.location.search;
    //     let urlParams = new URLSearchParams(searchQuery);

    //     let postId = urlParams.get('post');
    //     console.log(postId);
    //     fetchPost(postId)
    // }

    // useEffect(() => {
    //     getPost();
    // },[])

  return (
    <div className='post-view d-flex justify-content-between w-75 mx-auto h-100 align-items-center mt-5'>
    
        <Card className='m-2 post-view-card'>
            <Card.Header className='row'>
                <img src={ProfileImg} className='col-2 d-block post-profile-img'/>
                <div className='col d-flex flex-column justify-content-center'>
                    <div className='post-username mb-0'>
                        <h6 className='mb-0'>{postObj.user[0].username}</h6>
                    </div>
                    <div className='post-organisation'>
                        <p className='mb-0'>{postObj.user[0].organisation}</p>
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                {/* <Card.Title>Payments options</Card.Title> */}
                <Card.Text dangerouslySetInnerHTML={{__html:postObj.post}} />
                {postObj.image != "" && <Card.Img src={postObj.image} />}
            </Card.Body>
            <Card.Footer className='d-flex justify-content-around'>
                <div className='post-upvote d-flex align-items-center justify-content-around w-25'>
                    {
                        !postObj.upvoted ? 
                        (
                            <BiUpvote onClick={() => toggleVote(postObj._id)} className="upvote-icon"/> 
                        ):
                        (
                            <BiSolidUpvote onClick={() => toggleVote(postObj._id)} className="upvoted-icon"/>
                        )
                    }
                    {
                        !postObj.upvoted ? (<span className='upvote-text'>upvote</span>) : (<span className='upvote-text text-primary'>upvoted</span>)
                    }
                    <span className='upvote-count'>{postObj.upvotesCount}</span>
                </div>
                <div className='post-comments d-flex align-items-center justify-content-center w-25'>
                    <FaRegComment onClick={showComments} className='post-comment-icon'/>
                    <span className='comment-count'>{postObj.comments.length}</span>
                </div> 
            </Card.Footer>
        </Card>
        <div className='post-view-comment-section m-2 border border-1 rounded p-2'>
                <CommentsForm post={postObj} userObj={userObj} setToastMsg={props.setToastMsg} toastOpen={props.toastOpen}/>
                {
                    postObj.comments.length != 0 &&
                    postObj.comments.map((comment,idx) => <div className='comment row border-bottom mt-3 pb-2'>
                        <div className='comment-profile-icon col-1'>
                            <img src={ProfileImg} className='w-100 d-block mx-auto comment-profile-img'/>
                        </div>
                        <div className='col-10'>
                            <div className='comment-profile-username d-flex justify-content-between'>
                                <h6>{comment.username}</h6>
                                {/* <p>25m ago</p> */}
                            </div>
                            <div className='comment-comment'>
                                {comment.comment}
                            </div>
                        </div>
                    </div>)
                }
                {
                    postObj.comments.length == 0 && 
                    <p>No comments</p>
                }
        </div>
    </div>
  )
}

export default RenderPost