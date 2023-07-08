import React, { useEffect, useState } from 'react'
import Header from "../../comp/Header"
import Nav from "../../comp/Nav"
import sha256 from 'crypto-js'
import { Link, useNavigate } from 'react-router-dom'
import Modal from "react-modal";
import axios from "axios";
import raw from "../../Banned_Words_2022_05_05.txt"

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "https://infernovertigo.pythonanywhere.com"
})

var hashes = require("jshashes");

//https://infernovertigo.pythonanywhere.com/anime/register/u=u/ps=p/pr=a/m=l/

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

function RegisterPage(props) {
  const [userError, setErrorUser] = useState(true);
  const [passError, setErrorPass] = useState(true);
  const [passReError, setReErrorPass] = useState(true);
  const [usersQueue, setUsersQueue] = useState([]);
  const navigate = useNavigate()
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [salt, setSalt] = useState("");
  const [read, setRead] = useState(false);
  const [content, setContent] = useState("");

  let el;

  async function handler(e){
    await readBanned(e);
    UserErrorHandler(e);
  }

  function bannable(value){
    const words = content.split(",");
    for(let i=0; i<words.length; i++){
      for(let k=0; k<value.length; k++){
        let formed_word = "";
        for(let j=k; j<value.toLowerCase().length; j++){
          formed_word += value.toLowerCase().charAt(j);
          if(formed_word == words[i]){
            /*errorLabel.innerHTML="Banned Word";
            errorLabel.style.visibility="visible";
            setErrorUser((obj)=>{return true;});*/
            return true;
          }
        }
      }
    }
    return false;
  }

  async function readBanned(e){
    if(!read){
      const list = await fetch(raw)
      .then((res)=>res.text())
      .then((val)=>val)
      setRead(true);
      setContent(list);
    }
  }

  function openModal() {
    Modal.setAppElement(el);
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  function salter(){
    var Letters = [];
  
    var counter = 0;
    for(var i = 0; i < 36; i++){
      if(i >=10){
        Letters.push(String.fromCharCode(97 + counter));
        counter++;
      } 
      if(i < 10){
        Letters.push(i.toString());
      }
    }
    
    //Now Make a random mixture
    var saltValue = ""
    for(var a = 0; a < 10; a++){
      let Letter = Letters[Math.floor((0 + Math.random() * Letters.length))]
      saltValue+=Letter;
    }
  
    return saltValue;
  }

  useEffect(()=>{
    //setErrorUser((obj)=>{return true;});
    //setErrorPass((obj)=>{return true;});

    setUsersQueue((obj)=>{
      let temp = [];
      for(let i = 0; i < localStorage.length; i++){
        if(localStorage.key(i) == "salt" || localStorage.key(i) == "password" || localStorage.key(i) == "user" || localStorage.key(i) == "top_anime" || localStorage.key(i) == "First_Log" || localStorage.key(i) == "token" || localStorage.key(i) == "logged_in" || localStorage.key(i) == "user_id"){
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
  }, [])

  const hash = () =>{
    let inputs = document.getElementsByTagName("input");
    let username = inputs.namedItem("username").value;
    let password = inputs.namedItem("password").value;
    const errorLabel = document.getElementById("form_error");

    const bans = bannable(username, password);
    if(bans){
      errorLabel.innerHTML="Banned word detected";
      errorLabel.style.visibility="visible";
      setErrorUser(true);
      return;
    }else{
      errorLabel.innerHTML="";
      errorLabel.style.visibility="hidden";
      setErrorUser(false);
    }

    var salt = salter()
    var hashedPass = new hashes.SHA256().hex(password + salt);

    submit(username, hashedPass, salt)
  }

  function UserErrorHandler(e){
    var errorLabel = document.getElementById("user_error")
    //e.target.value.toString().charAt([e.target.value.toString().length-1]) == " "
    //\?\$\%\^\&\*\(\)\#\@\-\_\=\+\!\`\~\\|\'\"\;\:\,\<\\.>\/\{\}
    var mathches = e.target.value.match("[\?\$\%\^\&\*\(\)\#\@\\-\_\=\+\!\`\~\\|\'\"\;\:\,\<\\.>\/\{\} ]+");
    //console.log(mathches)
    if(mathches != null){
      //console.log("Error")
      errorLabel.innerHTML = "Invalid Username"
      errorLabel.style.visibility = "visible";
      setErrorUser((obj)=>{return true;});
      return;
    }
    if(e.target.value.length > 20){
      errorLabel.innerHTML = "Username Too Long"
      errorLabel.style.visibility = "visible";
      setErrorUser((obj)=>{return true;});
      return
    }
    if(e.target.value.length == 0){
      errorLabel.innerHTML = "Username cannot be blanked."
      errorLabel.style.visibility = "visible";
      setErrorUser((obj)=>{return true;});
    }
    else{
      //console.log(e.target.value)
      //console.log(e.target.value.length)
      errorLabel.style.visibility = "hidden";
      setErrorUser((obj)=>{return false;});
    }
  }

  function PassErrorHandler(e){
    var errorLabel = document.getElementById("pass_error");
    //e.target.value.toString().charAt([e.target.value.toString().length-1]) == " "
    //\?\$\%\^\&\*\(\)\#\@\-\_\=\+\!\`\~\\|\'\"\;\:\,\<\\.>\/\{\}
    //let numberMatch = e.target.value.match("[0-9]{1,10}");
    //let letterMatch = e.target.value.match("[a-zA-Z]{1,10}");
    let specialMatch = e.target.value.match("[$%&@!?*~]{1,10}");
    let spaceMatch = e.target.value.match(" ");
    //console.log(numberMatch)
    //console.log(letterMatch)
    //console.log(specialMatch)
    if(e.target.value.length > 100){
      errorLabel.innerHTML = "Password Too Long";
      errorLabel.style.visibility = "visible";
      setErrorPass((obj)=>{return true;});
      return
    }
    if(spaceMatch != null){
      errorLabel.innerHTML = "No Spaces Allowed";
      errorLabel.style.visibility = 'visible';
      setErrorPass((obj)=>{return true;});
      return
    }
    if(specialMatch != null){
      //console.log("Error")
      errorLabel.innerHTML = "No Special Characters"
      errorLabel.style.visibility = "visible";
      setErrorPass((obj)=>{return true;});
      return;
    }
    if(e.target.value.length == 0){
      errorLabel.innerHTML = "Password cannot be blanked."
      errorLabel.style.visibility = "visible";
      setErrorPass((obj)=>{return true;});
    }
    else{
      //console.log(e.target.value)
      //console.log(e.target.value.length)
      errorLabel.style.visibility = "hidden";
      setErrorPass((obj)=>{return false;});
    }
  }

  function REPassErrorHandler(e){
    let errorLabel = document.getElementById("re_pass_error");
    let inputs = document.getElementsByTagName("input");
    let password = inputs.namedItem("password").value;
    if(e.target.value != password){
      errorLabel.style.visibility = "visible"
      errorLabel.innerHTML="Password doesn't match"
      setReErrorPass((obj)=>{return true;});
    }
    else{
      errorLabel.style.visibility = "hidden"
      setReErrorPass((obj)=>{return false;});
    }
  }

  async function submit(username, password, salt){
    if(userError || passError || passReError || username === undefined || password === undefined || salt === undefined){
      return;
    }

    setUsername(username);
    setPassword(password);
    setSalt(salt);

    openModal();
    //console.log(usersQueue);
    /*
    */
  }

  async function sendRequest(){
    let res=null;
    //console.log(usersQueue);
    res = await client.post(
      `anime/register/u=${username}/ps=${password}/pr=${salt}/m=l/`,
      {
        data:usersQueue
      }
    ).then((res)=>{
      return res.data;
    })
    try{
      let b = 9;
      /*res = await fetch(`https://infernovertigo.pythonanywhere.com/anime/register/u=${username}/ps=${password}/pr=${salt}/m=l/`, 
      {
        "method":"POST",
        "headers":{
          'Content-type':"application/json"
        },
        "credentials":"same-origin",
        "body":
          JSON.stringify({
            "data":usersQueue
          })
      })
      .then((res)=>{
        return res.json();
      })*/

      let topAnime = localStorage.getItem("top_anime");
      let first_log = localStorage.getItem("First_Log");
      localStorage.clear();
      localStorage.setItem("top_anime", topAnime);
      localStorage.setItem("First_Log", JSON.stringify(false));
    }catch{
      let temp = 0;
    }
    //console.log(res)
    
    //console.log(props.token);
    if(res["Data"]==undefined){
      return;
    }

    if(res["Data"].length > 0){
      for(let i = 0; i < res["Data"].length; i++){
        let id = JSON.parse(res["Data"][i])["id"];
        localStorage.setItem(id, res["Data"][i]);
      }
    }
    
    //console.log(res["Data"][0]);
    if(res.hash){
      hash();
      sendRequest()
    }
    else if(res.newUser){  
      console.log(res);
    }
    else if(res.usable){
      props.setloggedIn(true);
      localStorage.setItem("user", username);
      localStorage.setItem("password", password);
      localStorage.setItem("salt", salt);
      localStorage.setItem("user_id", res["id"]);
      localStorage.setItem("hidden", JSON.stringify(true));
      //localStorage.setItem("token", res["token"]);
      props.settoken(res["token"]);
      localStorage.setItem("logged_in", JSON.stringify(true));
      console.log("you're now logged in and have an account");
      props.setUsername(username);
      navigate("/");
    }
  }

  function showPassword(e){
    let checkBox = document.getElementById("showPass");
    let inputs = document.getElementsByTagName("input");
    let password = inputs.namedItem("password");

    if(checkBox.defaultChecked === false){
      checkBox.defaultChecked = true;
      password.type = "text";
    }
    else{
      checkBox.defaultChecked = false;
      password.type = "password";
    }
  }

  return (
    <div>
      <Header/>
      <Nav showSearch={true}/>

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
        <div>
          <h1 className='register_final'>Note: Once you register you will no longer have 
            access to the queue when logged out.</h1>

            <p className='register_final'>Do You Want To Continue?</p>

            <button onClick={(e)=>sendRequest()}>Yes</button>
            <button onClick={(e)=>closeModal()}>No</button>
        </div>
      </Modal>
      <div id="reg_form_container">
        <form id="register_form">
          <div id="inner_container">
          
            <legend id="register_legend">Anime Tree</legend>
            <input type="hidden" name="csrfmiddlewaretoken" value=""></input>
            <label style={{display:"block"}} htmlFor="username">Enter a Username:</label>
            <input onChange={(e)=>handler(e)} name="username" type="text" placeholder='Enter Username'></input>
            <p id="user_error" style={{"visibility":"hidden", "color":"red", "margin":"0px", "fontWeight":"bold"}}>Invalid Username</p>
            <label style={{display:"block"}} htmlFor="password">Enter a Password:</label>
            <input onChange={(e)=>PassErrorHandler(e)} name="password" type="password" placeholder='Enter Password'></input><br></br><input id="showPass" style={{"width":"5%"}} type="checkbox" onClick={(e)=>showPassword(e)}></input><label htmlFor="showPass">Show Password</label>
            <p id="pass_error" style={{"visibility":"hidden", "color":"red", "margin":"0px", "fontWeight":"bold"}}>Invalid Password</p>
            <label style={{display:"block"}} htmlFor="re_password">Re-Enter a Password:</label>
            <input onChange={(e)=>REPassErrorHandler(e)} name="re_password" type="password" placeholder='Re-Enter Password'></input>
            <p id="re_pass_error" style={{"visibility":"hidden", "color":"red", "margin":"0px", "fontWeight":"bold"}}>Doesn't match password</p>
            <button type="button" id="register_submit_btn" onClick={(e)=>hash()}>{props.loggedIn ? 'Submit' : 'Submit1'}</button>
            <p id="form_error" style={{"visisbility":"hidden", "color":"red", "fontWeight":"bold"}}></p>
            <Link className='accButtons' to="/login"><a href="#" id="register_link">Already have an account?</a></Link>

          </div>
        </form>
        <footer></footer>
      </div>
    </div>
  )
}

export default RegisterPage