import React, { useEffect,useState } from 'react'
import './Home.css'
import { Card ,Button, Collapse} from 'react-bootstrap'
import ProfileImg from '../../Images/ProfileImg.svg'
import NoFeedImg from '../../Images/NoFeed.svg'
import { BiUpvote,BiSolidUpvote } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import {FaRegComment} from 'react-icons/fa';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import $ from 'jquery'
import CommentsForm from '../CommentsForm/CommentsForm';
import {appLink} from '../../App'

function Home(props) {
    

    let {userObj,isLoginSuccess} = useSelector(state => state.user);
    let {isPostSuccess} = useSelector(state => state.post);
    let {isCommentSuccess} = useSelector(state => state.comment);


    let [feed,setFeed] = useState([]);

    const navigate = useNavigate();

    const sendEmail = async (notifyObj) => {

        let res = await axios.post(`${appLink}/notification/send-email`,notifyObj);
        console.log(res);
        
    }
    const updateVote = async (op,obj) => {
        console.log(op);
        let res = await axios.put(`${appLink}/post/${op}`,obj);
        console.log(res);
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
                date:d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
            }
            console.log(notificationObj);
            let res = await axios.put(`${appLink}/notification/`,notificationObj);
            sendEmail(notificationObj);
            console.log(res);
        }
    }

    const toggleVote = (postId) => {
        console.log(postId);

        let newFeed = feed.map( post => {
            console.log(post._id,postId);
            if(post._id == postId){
                console.log(post.upvoted);
                if(post.upvoted){
                    post.upvotesCount = post.upvotesCount - 1;
                    updateVote('dislike',{userId:userObj[0]._id,postId:postId,upvotesCount:post.upvotesCount})
                }
                else{
                    post.upvotesCount = post.upvotesCount + 1;
                    updateVote('like',{userId:userObj[0]._id,postId:postId,upvotesCount:post.upvotesCount,postedBy:post.userId})
                }
                post.upvoted = !post.upvoted;
            }
            return post;
        })
        setFeed(newFeed);

    }

    const showComments = (event) => {
        console.log(event);
    }

    async function fetchFeed(filter) {
        let res = await axios.get(`${appLink}/post/all/${userObj[0]._id}?filter=${filter}`);
        console.log(res);
        setFeed(res.data.feed);
    }

    const sortBy = (event) => {
        // console.log(event.target.value);
        fetchFeed(event.target.value)
    }
    
    const gotoUser = (username) => {
        navigate(`/user/${username}`)
    }

    useEffect(() => {
        fetchFeed('datePosted');
    },[isPostSuccess,isCommentSuccess]);

    return (
        <div className='Home mt-3'>
            <div className='w-50 mx-auto mb-3'>
                <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={sortBy}>
                    <option selected value="datePosted">Most recent</option>
                    <option value="upvotesCount">sort by upvotes</option>   
                </select>    
            </div>
            <div>
            {
                feed.length != 0 && feed.map((post,idx) => 
                <Card className='mx-auto mb-3'>
                    <Card.Header className='row'>
                        <img src={ProfileImg} className='col-2 d-block post-profile-img'/>
                        <div className='col d-flex flex-column justify-content-center'>
                            <div className='post-username mb-0'>
                                <Button variant="none" className='text-primary mb-0 button-text' onClick={() => gotoUser(post.user[0].username)}>{post.user[0].username}</Button>
                            </div>
                            <div className='post-organisation'>
                                <Button variant="none" className='text-primary mb-0 button-text'>{post.user[0].organisation}</Button>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {/* <Card.Title>Payments options</Card.Title> */}
                        <Card.Text dangerouslySetInnerHTML={{__html:post.post}} />
                        {
                            post.image != "none" && <Card.Img src={post.image} />
                        }
                    </Card.Body>
                    <Card.Footer className='d-flex justify-content-around'>
                        <div className='post-upvote d-flex align-items-center justify-content-around w-25'>
                            {
                                !post.upvoted ? 
                                (
                                    <BiUpvote onClick={() => toggleVote(post._id)} size={18} className="upvote-icon"/> 
                                ):
                                (
                                    <BiSolidUpvote onClick={() => toggleVote(post._id)} size={18} className="upvoted-icon"/>
                                )
                            }
                            {
                                !post.upvoted ? (<span className='upvote-text'>upvote</span>) : (<span className='upvote-text text-primary'>upvoted</span>)
                            }
                            <span className='upvote-count'>{post.upvotesCount}</span>
                        </div>
                        <div className='post-comments d-flex align-items-center justify-content-around'>
                            <button
                                data-bs-toggle="collapse"
                                data-bs-target={`#comment-collapse-${post._id}`}
                                type="button"
                                className='btn btn-none'
                            >
                                <FaRegComment onClick={showComments} size={18} className='post-comment-icon'/>
                            </button>
                            <span className='comment-count'>{post.comments.length}</span>
                        </div> 
                    </Card.Footer>
                    <div className='collapse ms-4 me-4' id={`comment-collapse-${post._id}`}>
                        <div>
                            <CommentsForm post={post} userObj={userObj} setToastMsg={props.setToastMsg} toastOpen={props.toastOpen}/>
                            {
                                post.comments.length != 0 &&
                                post.comments.map((comment,idx) => <div className='comment row border-bottom mt-3 pb-2'>
                                    <div className='comment-profile-icon col-md-1 col-2'>
                                        <img src={ProfileImg} className='w-100 d-block mx-auto comment-profile-img'/>
                                    </div>
                                    <div className='col-md-11 col-10'>
                                        <div className='comment-profile-username d-flex justify-content-between'>
                                        <Button variant="none" className='text-primary mb-0 button-text ps-0' onClick={() => gotoUser(comment.username)}>{comment.username}</Button>
                                            {/* <p>25m ago</p> */}
                                        </div>
                                        <div className='comment-comment'>
                                            {comment.comment}
                                        </div>
                                    </div>
                                </div>)
                            }
                            {
                                post.comments.length == 0 && 
                                <p>No comments</p>
                            }
                            
                            {/* <div className='comment row border-bottom mt-3 pb-2'>
                                <div className='comment-profile-icon col-1'>
                                    <img src={ProfileImg} className='w-100 d-block mx-auto comment-profile-img'/>
                                </div>
                                <div className='col-10'>
                                    <div className='comment-profile-username d-flex justify-content-between'>
                                        <h6>Stephen Curry</h6>
                                        <p>25m ago</p>
                                    </div>
                                    <div className='comment-comment'>
                                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                                        labore wes anderson cred nesciunt sapiente ea proident.
                                    </div>
                                </div>
                            </div>
                            <div className='comment row border-bottom mt-3 pb-2'>
                                <div className='comment-profile-icon col-1'>
                                    <img src={ProfileImg} className='w-100 d-block mx-auto comment-profile-img'/>
                                </div>
                                <div className='col-10'>
                                    <div className='comment-profile-username d-flex justify-content-between'>
                                        <h6>Stephen Curry</h6>
                                        <p>25m ago</p>
                                    </div>
                                    <div className='comment-comment'>
                                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                                        labore wes anderson cred nesciunt sapiente ea proident.
                                    </div>
                                </div>
                            </div>
                            <div className='comment row border-bottom mt-3 pb-2'>
                                <div className='comment-profile-icon col-1'>
                                    <img src={ProfileImg} className='w-100 d-block mx-auto comment-profile-img'/>
                                </div>
                                <div className='col-10'>
                                    <div className='comment-profile-username d-flex justify-content-between'>
                                        <h6>Stephen Curry</h6>
                                        <p>25m ago</p>
                                    </div>
                                    <div className='comment-comment'>
                                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                                        labore wes anderson cred nesciunt sapiente ea proident.
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </Card>
                )
            }
            {
                feed.length == 0 && 
                <div className='mt-5'>
                    <img src={NoFeedImg} className='w-25 d-block mx-auto'/>
                    <h3 className='text-center'>No feed</h3>
                </div>
            }
            </div>
        </div>
    )
}

export default Home