import React, { useEffect, useState } from 'react'
import {FaTree} from "react-icons/fa"
import { Link } from 'react-router-dom'
//import {toBlob} from 'html-to-image'

const Header = (props) => {
  const [userImage, setUserImage] = useState("");
  const [userQueue, setQueue] = useState([]);

  /*useEffect(()=>{
    //setErrorUser((obj)=>{return true;});
    //setErrorPass((obj)=>{return true;});

    setQueue((obj)=>{
      let temp = [];
      for(let i = 0; i < localStorage.length; i++){
        if(localStorage.key(i) == "salt" || localStorage.key(i) == "password" || localStorage.key(i) == "user" || localStorage.key(i) == "top_anime" || localStorage.key(i) == "First_Log" || localStorage.key(i) == "token" || localStorage.key(i) == "logged_in"){
          //console.log(localStorage.key(i))
          continue;
        }else{
          try{
            temp.push(localStorage.getItem(localStorage.key(i)));
          }catch{
            continue;
          }
        }
      }
      return [...temp];
    })
  }, [])*/

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

  function show(e, option){
    const buttonStuff = document.getElementsByClassName("dropdown");
    
    if(option === "hide"){
      buttonStuff[0].style.display="none";
    }else if(option == "appear"){
      buttonStuff[0].style.display="block";
    }
    /*if(buttonStuff[0].style.display == "none"){
      buttonStuff[0].style.display="block";
    }
    else{
      buttonStuff[0].style.display="none";
    }*/
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

  function getModified(){
    let temp = [];
    for(let i = 0; i < localStorage.length; i++){
      /*if(localStorage.key(i) == "dbVersion" || localStorage.key(i) == "reloader" || localStorage.key(i) == "salt" || localStorage.key(i) == "password" || localStorage.key(i) == "user" || localStorage.key(i) == "top_anime" || localStorage.key(i) == "First_Log" || localStorage.key(i) == "token" || localStorage.key(i) == "logged_in" || localStorage.key(i) == "user_id" || localStorage.key(i) == "version" || localStorage.key(i) == "email" || localStorage.key(i) == "trigger" || localStorage.key(i) == "debug"){
        //console.log(localStorage.key(i))
        continue;
      }else{
        try{
          temp.push(localStorage.getItem(localStorage.key(i)));
        }catch{
          continue;
        }
      }*/
      if(!Number.isNaN(Number(localStorage.key(i)))){
        try{
          temp.push(localStorage.getItem(localStorage.key(i)));
        }catch{
          continue;
        }
      }
    }
    
    let modifiedQueue = temp.filter((value, index, obj)=>{
      //console.log(JSON.parse(value).modified);
      return JSON.parse(value).modified == true;
    })

    return modifiedQueue;
  }

  async function logOut(e){
    const baseUrl = "https://infernovertigo.pythonanywhere.com/";
    
    /*const res2 = await fetch(`${baseUrl}anime/update`,{
      method:"POST",
      body:JSON.stringify({
        username:localStorage.getItem("user"),
        password:localStorage.getItem("password"),
        salt:localStorage.getItem("salt"),
        queue:userQueue
      })
    });*/

    //console.log(await res2.json());
    //return;

    //get token for user
    const res1 = await fetch("https://infernovertigo.pythonanywhere.com/api/ret/gettoken", {
      method:"POST",
      body:JSON.stringify({
        username:localStorage.getItem("user"),
        password:localStorage.getItem("password"),
        salt:localStorage.getItem("salt")
      }),
      headers:{
        'Accept': 'application/json',
        "content-type":"application/json"
      }
    })
    let stuff = await res1.json();
    let token = stuff["data"];
    //console.log(stuff["data"]);
    let modifiedQueue = getModified();
    //console.log(modifiedQueue);
    const res2 = await fetch(`${baseUrl}anime/update`,{
      method:"POST",
      body:JSON.stringify({
        username:localStorage.getItem("user"),
        password:localStorage.getItem("password"),
        salt:localStorage.getItem("salt"),
        queue:modifiedQueue
      }),
      headers:{
        "Authorization":` Token ${token}`,
        'Accept': 'application/json',
        "content-type":"application/json"
      }
    });
    //console.log(await res2.json())

    let returnValue = await res2.json();
    //console.log(returnValue);
    props.setLoggedIn(false);
    //set user session to off
    const res = await fetch("https://infernovertigo.pythonanywhere.com/anime/logOut",{
      method:"get",
      headers:{
        "Authorization":`Token ${token}`
      },
      "credentials":"include"
    })
    let top_anime = localStorage.getItem("top_anime")
    localStorage.clear(); // clean out the localStorage completely

    //reset all the values
    localStorage.setItem("user", "");
    localStorage.setItem("password", "");
    localStorage.setItem("salt", "");
    localStorage.setItem("token", "");
    localStorage.setItem("logged_in", JSON.stringify(false));
    localStorage.setItem("top_anime", top_anime);
    localStorage.setItem("hidden", JSON.stringify(true));
    //console.log(await res.json());
    //console.log(modifiedQueue);
    //return to home page logged out bruh
    window.location.replace("/");
    //return;
  }

  return (
    <>
      <div id="accButtonContainer">
        {props.loggedIn ? 
        <>
        <>
          <div className="userImgContainer">
            <h3 className="user_name_header">Welcome: </h3>
            <div className="user_area">
              <span onPointerLeave={(e)=>show(e, "hide")} onClick={(e)=>show(e, "appear")} className='userName'>
                {localStorage.getItem("user")}
              </span>
              <div onPointerLeave={(e)=>show(e, "hide")} onPointerOver={(e)=>show(e, "appear")} className='dropdown'> 
                  <Link className="common_opt" to="/queue"><span className='inner_opt'>Your Queue</span></Link>
                  <Link className='common_opt' to="/stats"><span className='inner_opt'>Your Stats</span></Link>
                  <button className="common_opt" onClick={(e)=>logOut(e)} href='/'><span className='inner_opt'>Logout</span></button>
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
          <Link attempts={props.attempts} setAttempts={props.setAttempts} className='accButtons' to="/login"><button style={{"visibility":"visible", "display":"block"}} disabled={false}>Sign-In</button></Link>}
        {!props.loggedIn ? <Link className='accButtons' to="/register"><button style={{"visibility":"visible", "display":"block"}} disabled={false}>Register</button></Link> : <></>}
      </div>
      <div className="header-title">
      <Link id="header_home" to="/"><h1>Anime Tree<FaTree className='title_tree'/></h1></Link>
      </div>
    </>
  )
  //<button className='accButtons'>Logout</button>
}

export default Header