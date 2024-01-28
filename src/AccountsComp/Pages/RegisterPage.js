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
  const [mailError, setErrorEmail] = useState(true);
  const [usersQueue, setUsersQueue] = useState([]);
  const navigate = useNavigate()
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [salt, setSalt] = useState("");
  const [read, setRead] = useState(false);
  const [saltMail, setMailSalt] = useState("");
  const [user_mail, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [domains, setDomains] = useState("");

  let el;

  async function handler(e){
    await readBanned(e);
    UserErrorHandler(e);
  }

  function bannable(value){
    //console.log(value);
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

    let domains = ""
    const domainLimit = 30;

    for(let i=0; i < domainLimit; i++){
      let copy = "([a-zA-Z0-9-]{1,63}\\.)?";
      domains = domains + copy;
    }

    setDomains(domains);

    setUsersQueue((obj)=>{
      let temp = [];
      for(let i = 0; i < localStorage.length; i++){
        if(localStorage.key(i) == "salt" || localStorage.key(i) == "password" || localStorage.key(i) == "user" || localStorage.key(i) == "top_anime" || localStorage.key(i) == "First_Log" || localStorage.key(i) == "token" || localStorage.key(i) == "logged_in" || localStorage.key(i) == "user_id" || localStorage.key(i) == "version" || localStorage.key(i) == "email" || localStorage.key(i) == "dbVersion" || localStorage.key(i) == "trigger"){
          //console.log(localStorage.key(i))
          continue;
        }else{
          try{
            //console.log(localStorage.getItem(localStorage.key(i)))
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
    let email = inputs.namedItem("email").value;
    const errorLabel = document.getElementById("form_error");

    const bans = bannable(username, password);
    if(bans){
      errorLabel.innerHTML="Banned word detected";
      errorLabel.style.visibility="visible";
      setErrorUser(true);
      return;
    }else{
      errorLabel.innerHTML="Null";
      errorLabel.style.visibility="hidden";
      setErrorUser(false);
    }

    var salt = salter()
    var hashedPass = new hashes.SHA256().hex(password + salt);

    const hashedMail = new hashes.SHA256().hex(email);

    submit(username, hashedPass, salt, [email, hashedMail]);
  }

  function UserErrorHandler(e){
    const form_err = document.getElementById("form_error");
    form_err.style.visibility="hidden";

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

  function EmailErrorHandler(e){
    const form_err = document.getElementById("form_error");
    form_err.style.visibility="hidden";
    var errorLabel = document.getElementById("mail_error")
    //e.target.value.toString().charAt([e.target.value.toString().length-1]) == " "
    //\?\$\%\^\&\*\(\)\#\@\-\_\=\+\!\`\~\\|\'\"\;\:\,\<\\.>\/\{\}

    var matches = e.target.value.match(`^[a-zA-Z0-9\.]+@[a-zA-Z0-9-]{1,63}\\.${domains}[a-zA-Z0-9]{2,63}$`);

    //(com|net|gov|org|edu)
    //console.log(e.target.value)
    //console.log(matches)
    //console.log(mathches)
    if(matches == null){
      //console.log("Error")
      errorLabel.innerHTML = "Invalid Email"
      errorLabel.style.visibility = "visible";
      setErrorEmail((obj)=>{return true;});
      return;
    }
    if(e.target.value.length > 256){
      errorLabel.innerHTML = "Email Too Long"
      errorLabel.style.visibility = "visible";
      setErrorEmail((obj)=>{return true;});
      return
    }
    if(e.target.value.length == 0){
      errorLabel.innerHTML = "Email cannot be blanked."
      errorLabel.style.visibility = "visible";
      setErrorEmail((obj)=>{return true;});
    }
    else{
      //console.log(e.target.value.length)
      errorLabel.style.visibility = "hidden";
      setErrorEmail((obj)=>{return false;});
    }
  }

  function PassErrorHandler(e){
    const form_err = document.getElementById("form_error");
    form_err.style.visibility="hidden";
    var errorLabel = document.getElementById("pass_error");
    var reError = document.getElementsByTagName("input");
    const rePass = reError.namedItem("re_password");
    let errorLabel1 = document.getElementById("re_pass_error");

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
      return;
    }
    if(rePass.value.length > 0){
      if(e.target.value != rePass.value){
        errorLabel1.innerHTML = "Password doesn't match";
        errorLabel1.style.visibility = "visible";
        setErrorPass((obj)=>{return true;});
      }
      else{
        errorLabel.style.visibility = "hidden";
        errorLabel1.style.visibility = "hidden";
        setErrorPass((obj)=>{return false;});
        setReErrorPass((obj)=>{return false;});
      }
    }
    else{
      //console.log(e.target.value)
      //console.log(e.target.value.length)
      errorLabel.style.visibility = "hidden";
      errorLabel1.style.visibility = "hidden";
      setErrorPass((obj)=>{return false;});
    }
  }

  function REPassErrorHandler(e){
    const form_err = document.getElementById("form_error");
    form_err.style.visibility="hidden";
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

  async function submit(username, password, salt, mailPackage){
    if(userError || passError || passReError || mailError || username === undefined || password === undefined || salt === undefined){
      /*console.log("userError: ", userError);
      console.log("passError: ", passError);
      console.log("rePassError: ", passReError);
      console.log("emailError: ", mailError);
      console.log("problem")*/
      return;
    }

    setUsername(username);
    setPassword(password);
    setSalt(salt);
    setEmail(mailPackage[1]);
    //console.log(mailPackage[1]);

    openModal();
    //console.log(usersQueue);
    /*
    */
  }

  async function sendRequest(){
    const form_err = document.getElementById("form_error");
    const loadIcon = document.getElementById("registerLoader");
    loadIcon.style.visibility = "visible";
    closeModal();

    let res=null;
    //console.log(usersQueue);
    res = await client.post(
      `anime/register`,
      {
        data:{"users_queue":usersQueue, "username":username, "password":password, "salt":salt, "email":user_mail}
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
      //console.log(usersQueue.length)
      //console.log(res)

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
    
    if(res.hash){
      hash();
      sendRequest()
    }
    else if(!res.newUser && !res.hash && !res.usable && !res.usableEmail){
      form_err.textContent = "A Problem occurred Please try again later";
      form_err.style.visibility = "visible";
      loadIcon.style.visibility = "hidden";
      return;
    }
    /*else if(!res.password){ for password correction if i want
      form_err.textContent = "Password is invalid";
      form_err.style.visibility = "visible";
      loadIcon.style.visibility = "hidden";
    }*/
    else if(!res.newUser){  
      form_err.textContent = "Username is already taken";
      form_err.style.visibility = "visible";
      loadIcon.style.visibility = "hidden";
      //console.log("invalid username")
      return;
    }
    if(!res.usableEmail){
      form_err.textContent = "Email is already being used";
      form_err.style.visibility = "visible";
      loadIcon.style.visibility = "hidden";
      //console.log("invalid email")
      return;
    }
    else if(res.usable){
      props.setloggedIn(true);
      localStorage.setItem("email", user_mail);
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
      {/*<Header/>
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
        <div>
          <h1 className='register_final'>Note: Once you register, your username will be displayed on the leaderboards page.</h1>

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
            <label style={{display:"block"}} htmlFor="email">Enter Valid Email:</label>
            <input onChange={(e)=>EmailErrorHandler(e)} name="email" type="text" placeholder='Enter Email'></input>
            <p id="mail_error" style={{"visibility":"hidden", "color":"red", "margin":"0px", "fontWeight":"bold"}}>Invalid Email</p>
            <label style={{display:"block"}} htmlFor="password">Enter a Password:</label>
            <input onChange={(e)=>PassErrorHandler(e)} name="password" type="password" placeholder='Enter Password'></input><br></br><input id="showPass" style={{"width":"5%"}} type="checkbox" onClick={(e)=>showPassword(e)}></input><label htmlFor="showPass">Show Password</label>
            <p id="pass_error" style={{"visibility":"hidden", "color":"red", "margin":"0px", "fontWeight":"bold"}}>Invalid Password</p>
            <label style={{display:"block"}} htmlFor="re_password">Re-Enter a Password:</label>
            <input onChange={(e)=>REPassErrorHandler(e)} name="re_password" type="password" placeholder='Re-Enter Password'></input>
            <p id="re_pass_error" style={{"visibility":"hidden", "color":"red", "margin":"0px", "fontWeight":"bold"}}>Doesn't match password</p>
            <button type="button" id="register_submit_btn" onClick={(e)=>hash()}>{props.loggedIn ? 'Submit' : 'Submit'}</button>
            <p id="form_error" style={{"visisbility":"hidden", "color":"red", "fontWeight":"bold"}}>Null</p>
            <Link className='accButtons' to="/login"><a href="#" id="register_link">Already have an account?</a></Link>

          </div>
        </form>
        <div id="registerLoader" className="loader"></div>
        <footer></footer>
      </div>
    </div>
  )
}

export default RegisterPage