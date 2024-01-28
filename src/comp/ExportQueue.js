import React, { useEffect, useState, useContext } from 'react'
import { ContextHead } from '../App';
import Nav from './Nav'
import Header from './Header'
import QueueToFile from '../ProcessingFrontEnd/queueToFile';
import {useLocation} from "react-router-dom";
import { dom } from '@fortawesome/fontawesome-svg-core';
import Modal from "react-modal";

//onClick={(e)=>QueueToFile(inQueue)}
//'anime/exports/val=<str:contents>'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    backgroundColor: "black",
    backgroundImage:"url(https://t3.ftcdn.net/jpg/03/08/13/12/360_F_308131267_unLRF2JmPsjjXgrMRaFA3aEnrKa9aUxK.jpg)"
  },
  overlay:{
    backgroundColor: 'rgba(0, 0, 255, 0.03)',
    position:'fixed',
    //backgroundImage:"url(https://t3.ftcdn.net/jpg/03/08/13/12/360_F_308131267_unLRF2JmPsjjXgrMRaFA3aEnrKa9aUxK.jpg)"
  }
};

function ExportQueue(props) {
  const baseUrl = "https://infernovertigo.pythonanywhere.com/";
  const {context, db} = useContext(ContextHead);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState();
  const [theList, insertList] = useState([]);
  const [masterList, setMasterList] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [errors, setErrors] = useState(0);
  const [successful, setSuccesful] = useState(0);
  const [MALBuffer, setBuffer] = useState([]);
  let el;
  //var MALBuffer = [];
  
  function openModal() {
    Modal.setAppElement(el);
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }

  function closeModal() {
    const body = document.getElementById("importerBody");
    const loader = document.getElementById("importerLoader");
    const finished = document.getElementById("confirmImport");
    const success = document.getElementById("successfulImport")

    body.style.display = "none";
    loader.style.display = "none";
    finished.style.display = "none";
    success.style.display = "none";

    const input = document.getElementById("file");

    input.value = "";
    setBuffer(()=>[]);
    //MALBuffer = [];
    setIsOpen(false);
  }

  useEffect((obj)=>{
    setMasterList(async()=>{
      return await context;
    })
  }, [context])

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
        /*if(localStorage.key(index) == "dbVersion" || localStorage.key(index) == "reloader" || localStorage.key(index) == "token" || localStorage.key(index) == "First_Log" || localStorage.key(index) == "top_anime" || localStorage.key(index) == "salt"|| localStorage.key(index) == "password"|| localStorage.key(index) == "user" || localStorage.key(index) == "logged_in" || localStorage.key(index) == "user_id" || localStorage.key(index) == "version" || localStorage.key(index) == "email" || localStorage.key(index) == "trigger"){
          continue;
        }*/if(!Number.isNaN(Number(localStorage.key(index)))){
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
  
  const import_queue = (e) =>{
    //File resource: https://developer.mozilla.org/en-US/docs/Web/API/File
    //Blob Resource: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    //FileList resource: https://developer.mozilla.org/en-US/docs/Web/API/FileList
    setSuccesful(0);
    setErrors(0);

    const body = document.getElementById("importerBody");
    const loader = document.getElementById("importerLoader");
    const finished = document.getElementById("confirmImport");

    const input = document.getElementById("file");

    input.value = "";

    input.onchange = async _this => {
      let file =  input.files[0];

      const xml_text = await file.text();
      //const fileStream = await file.stream().getReader()

      let str = "";

      loader.style.display = "block";
      body.style.display = "none";

      //let object = null;
      async function handler(){
        console.log("Handler called")
        /*object = await fileStream.read()
        .then((context)=>{
          //console.log(context)
          return context;
        })

        let bufferArr = [];

        bufferArr = [...object["value"]];

        for(let i = 0; i < bufferArr.length; i++){
          str += String.fromCharCode(bufferArr[i]);
        }*/
        //console.log(str);
        //return;
        const parser = new DOMParser();

        const parsedString = parser.parseFromString(xml_text,"text/xml");
        //const parsedString = parser.parseFromString(str,"text/xml");
        
        const titles = parsedString.getElementsByTagName("series_title");
        const id = parsedString.getElementsByTagName("series_animedb_id");
        const type = parsedString.getElementsByTagName("series_type");
        const episodes = parsedString.getElementsByTagName("series_episodes");
        const user_watched_episodes = parsedString.getElementsByTagName("my_watched_episodes");
        const user_score = parsedString.getElementsByTagName("my_score");
        const userStatus = parsedString.getElementsByTagName("my_status");

        //console.log(titles.length);
        //return;
        /*for(let i = 0; i < 30; i++){
          console.log(titles[i].textContent, id[i].textContent);
        }*/ 
        //return;
        let count = 0;
        let object = null;

        for(let k = 0; k < titles.length; k++){
          //let found = FME_Search(await masterList, id[k].textContent, 0, Math.floor(await masterList.length/2), await masterList.length-1);
          let found = await search(id[k].textContent);
          if(found != -1){
            //console.log(found, titles[k]);
            try{
              object = JSON.parse(JSON.stringify(found[0]));
              //console.log(object);
              count+=1;

              let watching = true;
              if(userStatus[k].textContent == "Completed" || userStatus[k].textContent == "Plan to Watch"){
                watching = false;
              }

              if(userStatus[k].textContent == "Watching"){
                watching = true;
              }
              //console.log(object);
              object.status = true;
              object["watching"] = watching;
              object["rating"] = user_score[k].textContent;
              object["watched"] = user_watched_episodes[k].textContent;
              //object["modified"] = true;
              object["query_id"] = JSON.parse(localStorage.getItem("user_id"))

              setBuffer((obj)=>{return [...obj, JSON.stringify(object)]})
              //MALBuffer.push(JSON.stringify(object));
              setSuccesful((obj)=>{return (obj+1)});
              //console.log(await object);
            }catch(e){
              setErrors((obj)=>{return (obj+1)});
            }
            
          }
        }
        /*console.log("Successful: " + count);
        console.log("Total: " + titles.length);
        console.log("Error titles: " + errors);*/

        loader.style.display = "none";
        finished.style.display = "block";
        
        return;
      }
      handler();
    };
    input.click();
  }

  async function search(id){
    let anime = null;
    await db.transaction("r", db.anime, db.season, async function(){
      //console.log("run transaction")
      //Where clause for dexie Docs: https://dexie.org/docs/WhereClause/WhereClause

      anime = await db.anime.where("id").equals(Number.parseInt(id)).toArray();
  
    }).then((res)=>{
      //console.log("successful transaction")
    }).catch((res)=>{
      //console.log(res)
      anime=-1;
    })
    return anime;
  }

  async function FME_Search(list, value, start, middle, end){
    let choices = ["left", "right"];
    const choice = choices[Math.floor(Math.random() * 2)]

    for(let i = 0; i < list.length; i++){
      if(start == middle+1){
        return -1;
      }
      if(middle == list.length-1 || middle == 0){
        return -1;
      }
      if(end == middle-1){
        return -1;
      }

      try{
        if(list[start].id == value){
          return list[start];
        }  
      }catch(e){
        //console.log(e);
        //console.log(list[start]);
      }
     
      try{
        if(list[middle].id == value){
          return list[middle];
        }
      }catch(e){
        //console.log(e);
        //console.log(list[middle]);
      }
      
      try{
        if(list[end].id == value){
          return list[end];
        }
      }catch(e){
        //console.log(e);
      }

      start++;
      if(middle == "left"){
        middle--;
      }
      if(middle == "right"){
        middle++;
      }
      end--;
    }

    return -1;
  }

  async function finish_import(e){
    const finished = document.getElementById("confirmImport");
    finished.style.display = "none";
    const success = document.getElementById("successfulImport")
    for(let i=0; i < MALBuffer.length; i++){
      localStorage.setItem(JSON.parse(MALBuffer[i])["id"], MALBuffer[i]);
    }
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
    
    //console.log(modifiedQueue);
    const res2 = await fetch(`${baseUrl}anime/update`,{
      method:"POST",
      body:JSON.stringify({
        username:localStorage.getItem("user"),
        password:localStorage.getItem("password"),
        salt:localStorage.getItem("salt"),
        queue:MALBuffer
      }),
      headers:{
        "Authorization":` Token ${token}`,
        'Accept': 'application/json',
        "content-type":"application/json"
      }
    });
    success.style.display = "block";
  }

  return (
    <>
      {/*<Header loggedIn={props.loggedIn} setloggedIn={props.setloggedIn}/>
      <Nav showSearch={true}/>*/}

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        appElement={el}
        animationType="fade"
        ariaHideApp={false}
        //className="Modal"
        //overlayClassName="Overlay"
      >
        <div id="importerBody">
          <h1 className='register_final'>Note: Once you click yes, your Anime Tree list will be overwritten with the data in the MAL list.</h1>

          <p className='register_final'>Do You Want To Continue?</p>

          <button onClick={(e)=>{import_queue(e)}}>Yes</button>
          <button onClick={(e)=>{closeModal()}}>No</button>
        </div>
        <div id="importerLoader">
          <div class="loader"></div>
          <span id="loading_id">ADDING YOUR MY ANIME LIST, THIS MAY TAKE A WHILE.</span>
        </div>
        <div id="confirmImport">
          <h1 className='register_final'>Your list has been loaded.</h1>
          <p style={{"color":"orange"}}><b>Successful: {successful-errors}/{successful+errors}</b></p>
          <p className='register_final'>Are you sure you want to overwrite your Anime Tree List?:</p>

          <button onClick={(e)=>{finish_import(e)}}>Yes</button>
          <button onClick={(e)=>{closeModal()}}>No</button>
        </div>
        <div id="successfulImport">
          <h1 className='register_final'>YOUR LIST WAS SUCCESSFULLY IMPORTED!</h1>
          <button onClick={(e)=>{closeModal()}}>Close</button>
        </div>
      </Modal>

      <h1 style={{textAlign:"center", color:"white"}}>Anime Tree Importer</h1>

      <div style={{textAlign:"center"}}>
        <input type="file" id="file" accept=".xml, .html" style={{display:"none"}}/>
        <button onClick={(e)=>openModal(e)} style={{width:"auto", padding:"6px"}} className='QueueOptionBtns'>Import File</button>

        <p style={{color:"white", margin:"10px 10% 0px 10%"}}>
          Note: If you have anime in MAL that are already in your Anime Tree's list then the Anime Tree's list will be overwritten with the new file's data.
        </p>
      </div>

      <hr style={{margin:"5px 10% 5px 10%"}}></hr>

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