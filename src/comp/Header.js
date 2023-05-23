import React, { useEffect, useState } from 'react'
import {FaTree} from "react-icons/fa"
import { Link } from 'react-router-dom'
//import {toBlob} from 'html-to-image'

const Header = (props) => {
  const [userImage, setUserImage] = useState("");
  useEffect(()=>{
    async function fetchData(){
      const res = await 
      fetch("img/UserPFP.json")
      .then((response)=>{
        return response.json()
      })

      setUserImage(res["currentImage"]);
    }
    
    fetchData();
  },[])

  function show(e){
    const buttonStuff = document.getElementsByClassName("dropdown");
    if(buttonStuff[0].style.display == "none"){
      buttonStuff[0].style.display="block";
    }
    else{
      buttonStuff[0].style.display="none";
    }
  }

  /*function getImg(e){
    let input = document.createElement("input")
    input.type = "file";
    var imageURL = ""
    input.onchange = function (){
      let files =   Array.from(input.files);
              console.log(files);
              imageURL = files;
    }

    input.click();
    console.log(imageURL);
  }*/

  function logOut(e){
    props.setloggedIn(false);
    return;
  }

  return (
    <>
      <div id="accButtonContainer">
        {props.loggedIn ? 
        <>
        <>
          <div className="userImgContainer">
            <h3 className="user_name_header">Welcome: <span onMouseOver={(e)=>show(e)} className='userName'>{localStorage.getItem("user")}</span></h3>
              <div className='dropdown'> 
                <div className="dropdown_content">
                  <Link className="common_opt" to="/queue"><span className='inner_opt'>Your Queue</span></Link>
                  <Link className='common_opt' to="/stats"><span className='inner_opt'>Your Stats</span></Link>
                  <a className="common_opt" onClick={(e)=>logOut(e)} href='/'><span className='inner_opt'>Logout</span></a>
              </div>
            </div>
          </div>
        </> 
          
        </>
           : 
        ''}
        
        {props.loggedIn ? 
        ''
          : 
          <Link className='accButtons' to="/login"><button style={{"visibility":"visible", "display":"block"}} disabled={false}>Sign-In</button></Link>}
        {!props.loggedIn ? <Link className='accButtons' to="/register"><button style={{"visibility":"visible", "display":"block"}} disabled={false}>Register</button></Link> : <></>}
      </div>
      <div className="header-title">
        <h1>Anime Tree<FaTree className='title_tree'/></h1>
      </div>
    </>
  )
  //<button className='accButtons'>Logout</button>
}

export default Header