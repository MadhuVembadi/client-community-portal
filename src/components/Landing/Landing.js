import React,{useRef} from 'react'
import './Landing.css'
import CommunityImg from '../../Images/community.svg'
import PostImg from '../../Images/post.svg'
import UpvoteImg from '../../Images/upvote.svg'
import FilterImg from '../../Images/filterPosts.svg'
import PeopleSearch from '../../Images/peopleSearch.svg'
import TeamSpirit from '../../Images/teamSpirit.svg'
import { IoIosArrowDown } from "react-icons/io";
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

function Landing() {
  let myRef = useRef(null);
  const navigate = useNavigate();
  const executeScroll = () => myRef.current.scrollIntoView();

  let {userObj,isLoginSuccess} = useSelector(state => state.user)

  return (
    <div className='landing'>
      <div className='title mt-3 mb-5'>
        <div className='title-text text-center'>
          <h3>Let's build our</h3>
          <h1>Community</h1>
        </div>
        <div className='swipe-up-text text-center'>

        </div>
        <button className='btn btn-dark mx-auto d-block' onClick={executeScroll}>Know more <IoIosArrowDown/></button>
        <img src={CommunityImg} className='mt-5 w-50 mx-auto d-block'/>
      </div>

      <div className='details mt-5' ref={myRef}>
        <div className='detail-post row row-cols-1 row-cols-md-2'>
          <div className='col border-end'>
            <img src={PostImg} className="w-50 d-block mx-auto"/>
          </div>
          <div className='col d-flex align-items-center justify-content-center mt-3'>
            <h3 className='details-text w-50 text-center'>Share your feeback, feature requests through posts</h3>
          </div>
        </div>

        <div className='detail-post row row-cols-1 row-cols-md-2 mt-5'>
          <div className='col d-flex align-items-center justify-content-center mb-3 col border-end'>
            <h3 className='details-text w-50 text-center'>Upvote, Comment on posts</h3>
          </div>
          <div className=''>
            <img src={UpvoteImg} className="w-50 d-block mx-auto"/>
          </div>
        </div>

        <div className='detail-post row row-cols-1 row-cols-md-2 mt-5'>
          <div className='col border-end'>
            <img src={FilterImg} className="w-50 d-block mx-auto"/>
          </div>
          <div className='col d-flex align-items-center justify-content-center mt-3'>
            <h3 className='details-text w-50 text-center'>Filter posts by upovtes</h3>
          </div>
        </div>

        <div className='detail-post row row-cols-1 row-cols-md-2 mt-5'>
          <div className='col d-flex align-items-center justify-content-center mb-3 col border-end'>
            <h3 className='details-text w-50 text-center'>Search for people</h3>
          </div>
          <div className=''>
            <img src={PeopleSearch} className="w-50 d-block mx-auto"/>
          </div>
        </div>
      </div>

      {
        !isLoginSuccess &&
        <div className='mt-5'>
            <h3 className='text-center'>Are you ready?</h3>
            <button className='btn btn-dark d-block mx-auto mt-3 mb-3' onClick={() => navigate('/signup')}>Sign up now</button>
            <img src={TeamSpirit} className='w-50 d-block mx-auto'/>
        </div>
      }
    </div>
  )
}

export default Landing