import React,{useEffect,useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate , useLocation} from 'react-router-dom';
import ProfileImg from '../../Images/ProfileImg.svg'
import NoPostsImg from '../../Images/NoPosts.svg'
import { Button , Card} from 'react-bootstrap';
import {Tooltip} from 'react-tooltip'
import './User.css'
import axios from 'axios';
import CommentsForm from '../CommentsForm/CommentsForm';
import {BiUpvote,BiSolidUpvote} from 'react-icons/bi';
import {FaRegComment} from 'react-icons/fa'
import {appLink} from '../../App';
import $ from 'jquery';

function User(props) {

  let {userObj,isLoginSuccess} = useSelector(state => state.user);
  let {isGetPostSuccess} = useSelector(state => state.post);

  let [posts,setPosts] = useState([]);
  let [user,setUser] = useState({});
  let [totalUpvotes,setTotalUpvotes] = useState(0);

  let location = useLocation();

  const navigate = useNavigate();

  console.log(props);

  const sendEmail = async (notifyObj) => {

        let res = await axios.post(`${appLink}/notification/send-email`,notifyObj);
        console.log(res);
}

  const updateVote = async (op,obj) => {
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
            date:d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()
        }
        console.log(notificationObj);
        let res = await axios.put(`${appLink}/notification/`,notificationObj);
        sendEmail(notificationObj);
        console.log(res);
    }
    fetchPosts();  
  }

  const toggleVote = (post) => {
      console.log(post);
      if(post.upvoted){
        updateVote('dislike',{userId:userObj[0]._id,postId:post._id,upvotesCount:post.upvotesCount - 1})
      }
      else{
        updateVote('like',{userId:userObj[0]._id,postId:post._id,upvotesCount:post.upvotesCount + 1,postedBy:user._id})
      }

      // let newFeed = feed.map( post => {
      //     console.log(post._id,postId);
      //     if(post._id == postId){
      //         console.log(post.upvoted);
      //         if(post.upvoted){
      //             post.upvotesCount = post.upvotesCount - 1;
      //             updateVote('dislike',{userId:userObj[0]._id,postId:postId,upvotesCount:post.upvotesCount})
      //         }
      //         else{
      //             post.upvotesCount = post.upvotesCount + 1;
      //             updateVote('like',{userId:userObj[0]._id,postId:postId,upvotesCount:post.upvotesCount,postedBy:post.userId})
      //         }
      //         post.upvoted = !post.upvoted;
      //     }
      //     return post;
      // })
      // setFeed(newFeed);

      // update in db;
      
  }

  const fetchPosts = async () => {
    let userId = user._id;
    let currUser = userObj[0]._id;
    let res = await axios.get(`${appLink}/user/get-posts/${userId}?currUser=${currUser}`);
    console.log(res);
    setPosts(res.data.posts);
    setTotalUpvotes(res.data.totalUpvotes);
  }

  const fetchUser = async () => {
    let path = window.location.pathname;
    let username = path.split('/')[2]
    console.log(username);
  
    let res = await axios.get(`${appLink}/user/get-user/${username}`);
    console.log(res);
    setUser(res.data.user);
  }

  const gotoUser = (username) => {
    navigate(`/user/${username}`);
    fetchUser();
    console.log(user);
  }

  const removeOpenCollapses = () => {
    let collapses = $('.collapse');
    console.log(collapses.length,collapses);

      Array(collapses).forEach(item => {
        $(item).removeClass('show');
      })
  
  }

  useEffect(() => {
    removeOpenCollapses();
  },[posts,location.pathname])

  useEffect(() => {
    fetchPosts();
  },[user,isGetPostSuccess])

  useEffect(() => {
    console.log(location.pathname);
    fetchUser();
  },[location.pathname]);

  return (
    <div className='user mt-5'>
    {
      user && 
      <>
      <div className='user-profile row row-cols-sm-2 row-cols-1 shadow p-4 rounded m-2 '>
        <div className='user-profile-picture col col-lg-3 col-sm-5 d-flex align-items-center'>
          <img src={ProfileImg} className='d-block mx-auto'/>
        </div>
        <div className='user-profile-info col col-lg-9 col-sm-7'>
          <div>{user.firstName} {user.lastName}</div>
          <Button variant="none" className='text-primary p-0 mt-2 d-block' onClick={() => gotoUser(user.username)}>{user.username}</Button>
          <Button variant="none" className='text-primary p-0 mt-2 d-block'>{user.organisation}</Button>
          <div className='user-profile-info-list mt-4 d-md-flex justify-content-between'>
            <div>{posts ? posts.length : 0} Posts</div>
            <div data-tooltip-id="navbar-tooltip-user-posts" data-tooltip-content="Life time upvotes">{totalUpvotes} Upvotes</div>
            <Tooltip id="navbar-tooltip-user-posts"/>
          </div>
        </div>
      </div>
      <div className='user-posts mt-4 m-2 p-2 '>
        <h5 className='mb-3'>Posts</h5>
        {
          posts && 
          <div className='user-post row row-cols-lg-3 row-cols-md-2 row-cols-1'>
          {
            posts.length != 0 && 
            posts.map((post,idx) => <div className='col mb-3' key={idx}>
            <Card className='w-100 h-100 mx-auto'>
              <Card.Header className='row'>
                  <img src={ProfileImg} className='col-2 d-block post-profile-img'/>
                  <div className='col d-flex flex-column justify-content-center'>
                      <div className='post-username mb-0'>
                      <Button variant="none" className='text-primary mb-0 button-text ps-0' onClick={() => gotoUser(user.username)}>{user.username}</Button>
                      </div>
                      <div className='post-organisation'>
                          <p className='mb-0'>{user.organisation}</p>
                      </div>
                  </div>
              </Card.Header>
              <Card.Body>
                  {/* <Card.Title>Payments options</Card.Title> */}
                  <Card.Text dangerouslySetInnerHTML={{__html:post.post}} />
                  {post.image != "none" && <Card.Img src={post.image} />}
              </Card.Body>
              <Card.Footer className='d-flex justify-content-around'>
                  <div className='post-upvote d-flex align-items-center justify-content-around w-50'>
                      {
                          !post.upvoted ? 
                          (
                              <BiUpvote onClick={() => toggleVote(post)} size={18} className="upvote-icon"/> 
                          ):
                          (
                              <BiSolidUpvote onClick={() => toggleVote(post)} size={18} className="upvoted-icon"/>
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
                          <FaRegComment className='post-comment-icon' size={18}/>
                      </button>
                      <span className='comment-count'>{post.comments.length}</span>
                  </div> 
              </Card.Footer>
              <div className='collapse ms-4 me-4' id={`comment-collapse-${post._id}`} >
                  <div>
                      <CommentsForm post={post} user={user} userObj={userObj} setToastMsg={props.setToastMsg} toastOpen={props.toastOpen}/>
                      {
                          post.comments.length != 0 &&
                          post.comments.map((comment,idx) => <div className='comment row border-bottom mt-3 pb-2'>
                              <div className='comment-profile-icon col-2'>
                                  <img src={ProfileImg} className='w-100 d-block mx-auto comment-profile-img'/>
                              </div>
                              <div className=' col-10'>
                                  <div className='comment-profile-username d-flex justify-content-between'>
                                    <Button variant="none" className='text-primary mb-0 button-text ps-0' 
                                      onClick={() => gotoUser(comment.username)}
                                      // data-bs-toggle="collapse"
                                      // data-bs-target={`#comment-collapse-${post._id}`}
                                      // type="button"
                                    >
                                      {comment.username}
                                    </Button>
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
                  </div>
              </div>
            </Card>
            </div>
            )
          }
          </div>
        }
        {
          !posts && 
          <div>
            <img src={NoPostsImg} className='w-25 d-block mx-auto mb-3'/>
            <h3 className='text-center'>No posts</h3>
          </div>
        }
      </div>
      </>
    }
    </div>
  )
}

export default User