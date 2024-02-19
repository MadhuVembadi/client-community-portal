import React, { useEffect,useState } from 'react'
import {Nav,Navbar,Container,Form,Button} from 'react-bootstrap'
import {useSelector,useDispatch} from 'react-redux'
import {Route,Routes,NavLink,useNavigate} from 'react-router-dom'
import { IoHome,IoNotifications,IoSearch,IoLogOut } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import {Tooltip} from 'react-tooltip'
import { FaUser } from "react-icons/fa6";
import { PiNotePencilBold } from "react-icons/pi";
import { clearLoginStatus } from '../../slices/userSlice';
import Login from '../Login/Login'
import Landing from '../Landing/Landing'
import Signup from '../Signup/Signup'
import Home from '../Home/Home'
import Notification from '../Notification/Notification'
import Post from '../Post/Post'
import User from '../User/User'
import './Header.css'
import {userLogout} from '../../slices/userSlice'
import PrivateRoutes from '../../utils/PrivateRoutes';
import {Toast} from 'bootstrap'
import ToastComponent from '../Toast/Toast'
import RenderPost from '../RenderPost/RenderPost';
import Settings from '../Settings/Settings';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import UpdatePassword from '../UpdatePassword/UpdatePassword';
import Search from '../Search/Search';
import {useForm} from 'react-hook-form';
import {appLink} from '../../App'


function Header() {

    
    let {userObj,isLoginSuccess} = useSelector(state => state.user);

    let {register,handleSubmit,formState:{errors}} = useForm();

    let [toastMsg,setToastMsg] = useState(false);
    
    let [search,setSearch] = useState(false);

    const toastOpen = () => {
        const toastLiveExample = document.getElementById('liveToast');
        const toastBootstrap = new Toast(toastLiveExample,{
            autohide:true,
            delay:3000
        });
        toastBootstrap.show();
    }


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onUserLogout = (event) => {
        
        let actionObj = userLogout(userObj);
        dispatch(actionObj);
        
    }

    const onSearchSubmit = (searchQuery, event) => {
        event.preventDefault();
        console.log(event);
        console.log(searchQuery);
        setSearch(!search);
        navigate(`/search?query=${searchQuery.search}`)
    }

    // useEffect(() => {
    //     if(!isLoginSuccess) {
    //         navigate('/login');
    //     }
    // },[isLoginSuccess])

  return (
    <div className='header container'>
        
        <Navbar expand="md" collapseOnSelect className='bg-light'>
            <Container>
                <Navbar.Brand as={NavLink} to="/">Change Makers</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='w-100'>
                {
                    !isLoginSuccess &&
                    
                    <Nav className="w-100 d-md-flex justify-content-between">
                        <div>
                            <Nav.Item className="m-2">
                                <Nav.Link eventKey="1" as={NavLink} to="/" >
                                    Home
                                </Nav.Link>
                            </Nav.Item>
                        </div>
                        <div className='d-md-flex'>
                            <Nav.Item className="m-2">
                                <Nav.Link eventKey="2" as={NavLink} to="/login">
                                    Login
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="m-2">
                                <Nav.Link eventKey="3" as={NavLink} to="/signup">
                                    Signup
                                </Nav.Link>
                            </Nav.Item>
                        </div>
                    </Nav>
                }
                {
                    isLoginSuccess  &&
                    <Nav className='w-100'>
                        <div className='w-100 d-md-flex justify-content-between'>
                            <div className='w-100 d-md-flex'>
                                <Nav.Item className="m-2">
                                    <Nav.Link eventKey="4" as={NavLink} to="/home" data-tooltip-id="navbar-tooltip-home" data-tooltip-content="home">
                                        <IoHome color='black' size={25} />
                                    </Nav.Link>
                                    <Tooltip id="navbar-tooltip-home"/>
                                </Nav.Item>
                                <Nav.Item className="m-2 d-flex align-items-center">
                                    <Button variant='none' className="write-post-btn" data-tooltip-id="navbar-tooltip-post" data-tooltip-content="write a post" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                        <PiNotePencilBold color='black' size={25}/>
                                    </Button>
                                    <Post setToastMsg={setToastMsg} toastOpen={toastOpen}/>
                                    <Tooltip id="navbar-tooltip-post"/>
                                </Nav.Item>
                                <Nav.Item className="m-2">
                                    <Nav.Link eventKey="6" as={NavLink} to="/notifications" data-tooltip-id="navbar-tooltip-notify" data-tooltip-content="notificiation">
                                        <IoNotifications color='black' size={25}/>
                                    </Nav.Link>
                                    <Tooltip id="navbar-tooltip-notify"/>
                                </Nav.Item>
                                <div className='h-100 d-flex align-items-center'>
                                    <Form className='d-flex h-50' onSubmit={handleSubmit(onSearchSubmit)}>
                                        <Form.Control
                                            type="search"
                                            placeholder="Search"
                                            className="me-2"
                                            aria-label="Search"
                                            {...register("search",{required:true})}
                                            />
                                        <Button type="submit" className='d-flex justify-content-center btn-dark' data-tooltip-id="navbar-tooltip-search" data-tooltip-content="search">
                                            <IoSearch/>
                                        </Button>
                                        <Tooltip id="navbar-tooltip-search"/>
                                    </Form>
                                </div>
                            </div>
                            
                            <div className='d-md-flex'>
                                <Nav.Item className="m-2">
                                    <Nav.Link eventKey="7" as={NavLink} to="/settings" data-tooltip-id="navbar-tooltip-settings" data-tooltip-content="settings">
                                        <IoMdSettings color='black' size={25}/>
                                    </Nav.Link>
                                    <Tooltip id="navbar-tooltip-settings"/>
                                </Nav.Item>
                                <Nav.Item className="m-2">
                                    <Nav.Link eventKey="8" as={NavLink} to={`/user/${userObj[0].username}`} data-tooltip-id="navbar-tooltip-user" data-tooltip-content="account">
                                        <FaUser color='black' size={20}/>
                                    </Nav.Link>
                                    <Tooltip id="navbar-tooltip-user"/>
                                </Nav.Item>

                                <Button variant='none' onClick={onUserLogout} className='p-0 m-2' data-tooltip-id="navbar-tooltip-logout" data-tooltip-content="logout" >
                                    <IoLogOut color="black" size={25}/>
                                </Button>
                                <Tooltip id="navbar-tooltip-logout"/>
                            </div>
                        </div>
                    </Nav>       
                }
                </Navbar.Collapse>
            </Container>
        </Navbar>

        <ToastComponent toastMsg={toastMsg}/>
    
        <Routes>
            <Route path="/" element={<Landing />}/>
            <Route path="/login" element={<Login setToastMsg={setToastMsg} toastOpen={toastOpen} />} />
            <Route path="/signup" element={<Signup setToastMsg={setToastMsg} toastOpen={toastOpen}/>}/>
            <Route element={<PrivateRoutes/>}>
                <Route path="/home" element={<Home setToastMsg={setToastMsg} toastOpen={toastOpen}/>} />
                <Route path="/post" element={<Post setToastMsg={setToastMsg} toastOpen={toastOpen}/>} />
                <Route path="/view" element={<RenderPost setToastMsg={setToastMsg} toastOpen={toastOpen}/>} />
                <Route path="/notifications" element={<Notification setToastMsg={setToastMsg} toastOpen={toastOpen}/>}/>
                <Route path="/user/:username" element={<User setToastMsg={setToastMsg} toastOpen={toastOpen}/>}/>
                <Route path="/settings" element={<Settings setToastMsg={setToastMsg} toastOpen={toastOpen} />}/>
                <Route path="/search" element={<Search setToastMsg={setToastMsg} toastOpen={toastOpen}  search={search}/>}/>
                
            </Route>
            <Route path="/forgotPassword" element={<ForgotPassword setToastMsg={setToastMsg} toastOpen={toastOpen} />}/>
            <Route path="/update-password" element={<UpdatePassword setToastMsg={setToastMsg} toastOpen={toastOpen}  search={search}/>}/>
        </Routes>
    </div>
  )
}

export default Header