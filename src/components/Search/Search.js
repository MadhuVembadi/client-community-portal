import axios from 'axios';
import React, { useEffect,useState } from 'react'
import ProfileImg from '../../Images/ProfileImg.svg'
import NoPostsImg from '../../Images/NoPosts.svg'
import {useNavigate} from 'react-router-dom'
import './Search.css'

function Search(props) {

    let [users,setUsers] = useState([]);
    const getData = async (searchQuery) => {

        let res = await axios.get(`/search/${searchQuery}`);
        console.log(res);
        if(res.data.users)
            setUsers(res.data.users);
    }
    
    const navigate = useNavigate();

    const goToUser = (user) => {
        navigate(`/user/${user.username}`)
    }

    useEffect(() => {
        let searchQuery = window.location.search;
        let urlParams = new URLSearchParams(searchQuery);
        let searchParam = urlParams.get('query');
        console.log(searchParam);
        getData(searchParam);

    },[props.search]);

  return (
    <div className='search mt-5'>
        <h6 className='text-dark'>Users</h6>
        <div className='w-100 mx-auto mt-4'> 
            <div className='search-users-list row row-cols-lg-2 row-cols-1 d-flex justify-content-between'>
                {/* <div className='search-user shadow p-4 d-sm-flex mb-3' onClick={() => goToUser(user)}>
                    <div className='search-user-profile-picture col col-lg-3 col-sm-5 d-flex align-items-center mb-3'>
                        <img src={ProfileImg} className="d-block mx-auto"/>
                    </div>
                    <div className='search-user-profile-info col col-lg-9 col-sm-7 d-flex flex-column justify-content-center'>
                        <div>
                            <h4>{user.firstname} {user.lastname}</h4>
                            <h6 className='text-primary'>{user.firstname} {user.lastname}</h6>
                        </div>
                        <h5>{user.organisation}</h5>
                    </div>
                </div> */}
                {
                    users.length != 0 && 
                    users.map(user => 
                        <div className='search-user shadow p-4 d-sm-flex mb-3 col col-lg-5' onClick={() => goToUser(user)}>
                            <div className='search-user-profile-picture col col-lg-3 col-sm-5 d-flex align-items-center mb-3'>
                                <img src={ProfileImg} className="d-block mx-auto"/>
                            </div>
                            <div className='search-user-profile-info col col-lg-9 col-sm-7 d-flex flex-column justify-content-center'>
                                <div>
                                    <h4>{user.firstname} {user.lastname}</h4>
                                    <h6 className='text-primary'>@{user.username}</h6>
                                </div>
                                <h5>{user.organisation}</h5>
                            </div>
                        </div>
                    )
                }
                {
                    users.length == 0 && 
                    <div>
                        <img src={NoPostsImg} className='w-25 d-block mx-auto mb-3'/>
                        <h3 className='text-center'>No Users found</h3>
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default Search