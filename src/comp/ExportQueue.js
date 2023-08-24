import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import Header from './Header'
import QueueToFile from '../ProcessingFrontEnd/queueToFile';
import {useLocation} from "react-router-dom";
import { dom } from '@fortawesome/fontawesome-svg-core';

//onClick={(e)=>QueueToFile(inQueue)}
//'anime/exports/val=<str:contents>'

function ExportQueue(props) {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState();
  const [theList, insertList] = useState([]);
  
  //--------review content below to modify-----------------
  function downloadBlob(blob, name = 'file.txt') {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);
  
    // Create a link element
    const link = document.createElement("a");
  
    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = name;
  
    // Append link to the body
    document.body.appendChild(link);
  
    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );
  
    // Remove link from body
    document.body.removeChild(link);
  }
  
  
  /* For the example */
  const exportButton = document.getElementById('ExportBtn');
  const jsonBlob = new Blob([QueueToFile(theList, userId, username)])
  
  const Start = (e) =>{
    var alpha = []
    for(var i = 65; i < 90; i++){
      alpha.push(String.fromCharCode(i));
    }
    let randint = Math.round(1000 + Math.random() * 9999)
    let random_letter = Math.round(0 + Math.random() * 24)
    downloadBlob(jsonBlob, `anime_tree_export_${randint}${alpha[random_letter]}.xml`);
  }
//------Review above content to learn how to modify it-------

  useEffect(()=>{
    async function run(){
      let res1 = []
      for(var index = 0; index < localStorage.length; index++){
        var obj = null
        if(localStorage.key(index) == "token" || localStorage.key(index) == "First_Log" || localStorage.key(index) == "top_anime" || localStorage.key(index) == "salt"|| localStorage.key(index) == "password"|| localStorage.key(index) == "user" || localStorage.key(index) == "logged_in" || localStorage.key(index) == "user_id"){
          continue;
        }else{
          try{
            obj = JSON.parse(localStorage.getItem(localStorage.key(index)))
            //console.log(obj)
            if(obj.status === true){
              res1.push(obj)
            }
          }
          catch{
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

            const res = await fetch("https://infernovertigo.pythonanywhere.com/anime/logOut",{
              method:"get",
              headers:{
                "Authorization":`Token ${token}`
              },
              "credentials":"include"
            })

            console.log("local storage was tempered with, logging off");
            props.setloggedIn(false);
            let top_anime = localStorage.getItem("top_anime")
            localStorage.clear(); // clean out the localStorage completely

            //reset all the values
            localStorage.setItem("user", "");
            localStorage.setItem("password", "");
            localStorage.setItem("salt", "");
            localStorage.setItem("logged_in", JSON.stringify(false));
            localStorage.setItem("top_anime", top_anime);
            window.location.replace("/");
          }
        }
      }
      insertList([...res1])
    }
    run();
  }, [])

  const Alarm = (e) =>{
    alert("Your Export was successful");
  }

  return (
    <>
      {/*<Header loggedIn={props.loggedIn} setloggedIn={props.setloggedIn}/>
      <Nav showSearch={true}/>*/}
      <h1 style={{textAlign:"center", color:"white"}}>Anime Tree Exporter</h1>

      <div style={{textAlign:"center"}}>
        <form>
          <label style={{color:"white", fontWeight:"bold"}}>Enter MAL User's ID: <br></br></label>
          <input onChange={(e)=>setUserId((obj)=>{return e.target.value})} style={{width:"30%", fontSize:"20px", marginTop:"10px"}} type="text" placeholder="Ex: 12345678"/>
          
          <div style={{textAlign:"center", marginTop:"10px", marginBottom:"10px"}}>
            <label style={{color:"white", fontWeight:"bold"}}>Enter MAL Username:  <br></br></label>
            <input onChange={(e)=>setUsername((obj)=>{return e.target.value})} style={{width:"30%", fontSize:"20px", marginTop:"10px"}} type="text" placeholder="Ex: BobBilly123"/>
          </div>
          
          <button onClick={(e)=>Start(e)} style={{width:"auto", padding:"6px"}} className='QueueOptionBtns'>Export File</button>
        </form>

        <p style={{color:"white", margin:"10px 10% 0px 10%"}}>
          Note: MAL User's ID and Username are completely optional. You can just click export file to begin the download for exporting your queue list. The file downloaded may be used to add to your MAL list if you so wish.
        </p>
      </div>
    </>
  )
}

export default ExportQueue