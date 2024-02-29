import React,{useEffect,useState} from 'react'
import './Organisation.css'
import {appLink} from '../../App'
import { useSelector } from 'react-redux';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import CommentsForm from '../CommentsForm/CommentsForm';
import {Button} from 'react-bootstrap';
import { Card, Collapse} from 'react-bootstrap'
import { BiUpvote,BiSolidUpvote } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import {FaRegComment} from 'react-icons/fa';
import $ from 'jquery'

function Organisation(props) {

    let [users,setUsers] = useState([]);
    let [posts,setPosts] = useState([]);
    let [organisation,setOrganisation] = useState('');

    let [showUsers,setShowUsers] = useState(true);
    let [showPosts,setShowPosts] = useState(false);

    let navigate = useNavigate();

    let {userObj} = useSelector(state => state.user);


    async function fetchData(org) {
        let res = await axios.get(`${appLink}/organisation/stats/${org}?user=${userObj[0]._id}`);
        setUsers(res.data.users);
        setPosts(res.data.posts);
        console.log(res);
    }

    const goToUser = (user) => {
        navigate(`/user/${user.username}`)
    }

    const toggleShow = (cat) => {
        if(cat === 'users'){
            setShowUsers(true);
            setShowPosts(false);
        }
        else{
            setShowUsers(false);
            setShowPosts(true);
        }
        $('.total-users').toggleClass('active');
        $('.total-posts').toggleClass('active');
    }

    useEffect(() => {
        let org = window.location.pathname.split('/')[2].replaceAll('%20',' ');
        setOrganisation(org);
        fetchData(org);
    },[])

  return (
    <div className='organisation w-75 mx-auto mt-5'>
        <div className='text-center fs-1'>{organisation}</div>
        <div className='statistics d-flex justify-content-around mt-3'>
            <div className='total-users ps-5 pe-5 pt-2 pb-2 rounded-3 shadow w-25 text-center border active' onClick={() => toggleShow('users')} >
                <h3>{users.length}</h3>
                <h6>users</h6>
            </div>
            <div className='total-posts ps-5 pe-5 pt-2 pb-2 rounded-3 shadow w-25 text-center border' onClick={() => toggleShow('posts')}>
                <h3>{posts.length}</h3>
                <h6>posts</h6>
            </div>
        </div>
        <div className='content'>
        {
            showUsers && 
            <div className='org-users w-75 mx-auto mt-5'>
                {
                    users.map(user => 
                        <div className='org-user shadow p-4 d-sm-flex justify-content-around mb-3 col col-lg-5 w-100 mt-2' onClick={() => goToUser(user)}>
                            <div className='org-user-profile-picture col col-lg-2 col-sm-3 d-flex align-items-center mb-3'>
                                <img src={user.profilePicture} className="d-block mx-auto"/>
                            </div>
                            <div className='org-user-profile-info col col-lg-8 col-sm-7 d-flex flex-column justify-content-center'>
                                <div>
                                    <h4>{user.firstname} {user.lastname}</h4>
                                    <h6 className='text-primary'>@{user.username}</h6>
                                </div>
                                <h5>{user.organisation}</h5>
                            </div>
                        </div>
                    )
                }
            </div>
        }

        {
            showPosts && 
            <div className='org-posts w-50 mx-auto mt-5'>
            {
                posts.map((post,idx) => 
                <Card className='mx-auto mb-3'>
                    <Card.Header className='row'>
                        <img src={post.user.profilePicture} className='col-2 d-block post-profile-img'/>
                        <div className='col d-flex flex-column justify-content-center'>
                            <div className='post-username mb-0'>
                                <Button variant="none" className='text-primary mb-0 button-text' onClick={() => goToUser(post.user)}>{post.user.username}</Button>
                            </div>
                            <div className='post-organisation'>
                                <Button variant="none" className='text-primary mb-0 button-text' onClick={() => navigate(`/organisation/${post.user.organisation}`)}>{post.user.organisation}</Button>
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
                    {/* <Card.Footer className='d-flex justify-content-around'>
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
                    </Card.Footer> */}
                    {/* <div className='collapse ms-4 me-4' id={`comment-collapse-${post._id}`}>
                        <div>
                            <CommentsForm post={post} userObj={userObj} setToastMsg={props.setToastMsg} toastOpen={props.toastOpen}/>
                            {
                                post.comments.length != 0 &&
                                post.comments.map((comment,idx) => <div className='comment row border-bottom mt-3 pb-2'>
                                    <div className='comment-profile-icon col-md-1 col-2'>
                                        <img src={comment.commentUser[0].profilePicture} className='w-100 d-block mx-auto comment-profile-img'/>
                                    </div>
                                    <div className='col-md-11 col-10'>
                                        <div className='comment-profile-username d-flex justify-content-between'>
                                        <Button variant="none" className='text-primary mb-0 button-text ps-0' onClick={() => gotoUser(comment.commentUser[0].username)}>{comment.commentUser[0].username}</Button>
                                            
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
                        </div>
                    </div> */}
                </Card>
                )
            }
            </div>
        }
        
            {/* <div className='org-user shadow p-4 d-sm-flex mb-3 col col-lg-5' onClick={() => goToUser(user)}>
                <div className='search-user-profile-picture col col-lg-3 col-sm-5 d-flex align-items-center mb-3'>
                    <img src={user.profilePicture} className="d-block mx-auto"/>
                </div>
                <div className='search-user-profile-info col col-lg-9 col-sm-7 d-flex flex-column justify-content-center'>
                    <div>
                        <h4>{user.firstname} {user.lastname}</h4>
                        <h6 className='text-primary'>@{user.username}</h6>
                    </div>
                    <h5>{user.organisation}</h5>
                </div>
            </div> */}
        </div>
    </div>
  )
}

export default Organisation