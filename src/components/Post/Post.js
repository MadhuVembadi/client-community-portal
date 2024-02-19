import React,{useEffect,useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {useQuill} from 'react-quilljs'
import 'quill/dist/quill.snow.css';
import './Post.css'
import { Button } from 'react-bootstrap';
import ProfileImg from '../../Images/ProfileImg.svg'
import { IoSend } from "react-icons/io5";
import { RiImageAddFill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import {Toast} from 'bootstrap'
import $ from 'jquery'
import axios from 'axios';
import {createPost} from '../../slices/postSlice';
import {useDispatch} from 'react-redux'
import {appLink} from '../../App'

function Post(props) {


  console.log(props);
  let {userObj} = useSelector(state => state.user);

  let {postObj,isPostSuccess,isPostLoading,isPostError,postErrMsg} = useSelector(state => state.post);

  const [selectedImages, setSelectedImages] = useState([]);

  const [imgs,setImgs] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = 'snow';

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link', 'emoji'] ,
    ],
  };

  const placeholder = 'write something...';

  const formats = ['bold', 'italic', 'underline', 'strike'];

  const { quill,quillRef } = useQuill({ theme, modules, formats, placeholder });

  const editHashTags = (text) => {
      const hashtags = text.match(/#\w*(?=\D)/g);
      hashtags?.forEach(hashtag => {
          text = text.replace(hashtag,`<span style="color:blue;">${hashtag}</span>`)
      })
      return text;
  }

  const toggleToast = (msg) => {
    props.setToastMsg(msg);
    props.toastOpen();
  }

  const postDataToDb = async (text) => {

    let editedText = editHashTags(text);
    let formData = new FormData();
    let newObj = {
      post:editedText,
      userId:userObj[0]._id,
      comments:[],
      upvotesCount:0,
      upvotes:[]
    }
    formData.append("post",JSON.stringify(newObj));
    formData.append("image",imgs[0]);

    console.log(formData);

    toggleToast('posting...');
    let actionObj = createPost(formData);
    dispatch(actionObj);
    toggleToast('posted');

    // let res = await axios.post('http://localhost:3000/post/',formData);
    // console.log(res);

  }

  const handlePost = async () => {
    
    let text = quill.root.innerHTML;   
    postDataToDb(text);

  };

  const handleImageUpload = (event) => {
    let files = event.target.files;
    setImgs(files);
    const imagesArray = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      
      reader.onload = function (e) {
        imagesArray.push(e.target.result);
        if (imagesArray.length === files.length) {
          console.log(imagesArray);
          setSelectedImages([ ...imagesArray]);
        }
      };
      reader.readAsDataURL(files[i]);
    }
    console.log(selectedImages);
  }

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  // useEffect(() => {

  //   if(postObj){
  //     if(isPostLoading){
  //       toggleToast('posting...');
  //     }
  //     else if(isPostSuccess){
  //       toggleToast('posted');
  //     }
  //     else if(isPostError){
  //       toggleToast(postErrMsg)
  //     }
  //   }
    
  // },[isPostSuccess,isPostLoading,isPostError])

  return (

    <div className="modal post-modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className='row mb-3'>
              <img src={ProfileImg} className='col-md-1 col-2 d-block post-profile-img'/>
              <div className='col-md-11 col-10 post-username mb-0 d-flex align-items-center'>
                <h6 className='mb-0'>{userObj[0].username}</h6>
              </div>
            </div>
            <div ref={quillRef} className='border-none'/>
            <div className='d-flex'>
              {
                selectedImages.map((image,idx) => <div key={idx} className='img-preview me-4'>
                    <img src={image} className='w-100 d-block mx-auto'/>
                    <Button onClick={() => removeImage(idx)} variant="none" className='img-remove-btn'><RxCross1 color='white'/></Button>
                </div>)
              }
            </div>
          </div>
          <div className="modal-footer border-none pt-0 pb-0">
            {/* <Button variant='none'><RiImageAddFill size={25} /></Button> */}
            {/* replace with a add image icon */}
            
            {/* <form className="d-flex justify-content-between w-100" action='http://localhost:3000/post/images' encType='multipart/form-data' method='post'>
              <input type="file" accept="image/*" name="images" multiple id="imageInput" onChange={handleImageUpload} {...register("images")}/>
              <Button type="submit" className='d-block ms-auto m-2 btn-dark'>
                <IoSend/>
              </Button>
            </form> */}

            <input type="file" accept="image/*" name="images" id="imageInput" onChange={handleImageUpload} />
              <Button onClick={handlePost} className='d-block ms-auto m-2 btn-dark' data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                <IoSend/>
              </Button>
          </div>
        </div>
      </div>

    </div>
    
  );

}

export default Post