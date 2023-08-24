import React, {useState, useEffect} from 'react'
import Header from '../../comp/Header'
import Nav from '../../comp/Nav'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

var hashes = require("jshashes");

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "https://infernovertigo.pythonanywhere.com"
})

var hashes = require("jshashes");

function LoginPage(props) {
  const [userError, setErrorUser] = useState(true);
  const [passError, setErrorPass] = useState(true);

  const [usersQueue, setUsersQueue] = useState([]);
  const navigate = useNavigate()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [salt, setSalt] = useState("");
  const limit = 10;

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

  const hash = (password, salt="", auto_salt=true) =>{
    //var salt = null;
    var hashedPass = null;

    if(auto_salt){
      salt = salter()
      hashedPass = new hashes.SHA256().hex(password + salt);
    }else if(!auto_salt){
      //console.log(password)
      //console.log(salt)
      hashedPass = new hashes.SHA256().hex(password + salt);
    }else{
      return password;
    }

    return hashedPass;
    //submit(username, hashedPass, salt)
  }
  
  async function submit(username, password, salt){
    if(userError || passError || username === undefined || password === undefined || salt === undefined){
      return;
    }
    setUsername(username);
    setPassword(password);
    setSalt(salt);

    return password;

    //console.log(usersQueue);
    /*
    */
  }
  
  async function sendRequest(){
    const formError = document.getElementById("form_error");  
    formError.style.visibility = "hidden";

    const loader = document.getElementById("loginLoader");
    loader.style.visibility = "visible";

    let inputs = document.getElementsByTagName("input");
    let username = inputs.namedItem("username").value;
    let password = inputs.namedItem("password").value;
    let subm = document.getElementById("register_submit_btn");

    if(userError || passError || username === undefined || password === undefined){
      return;
    }

    if(username === "" || password === ""){
      return;
    }

    const errorLabel = document.getElementById("pass_error");
    errorLabel.innerHTML = "Invalid Password";
    errorLabel.style.visibility = "hidden";

    //console.log(username);
    //console.log(password);

    const res1 = await client.get(
      `retrieve/salt/user=${username}`
    ).then((res)=>{
      return res.data;
    })

    //console.log(res1);

    if(res1["Entity"] == null){
      errorLabel.innerHTML = "Invalid credentials entered";
      errorLabel.style.visibility = "visible";
      props.setAttempts((val)=>{
        val += 1
        return val
      })

      loader.style.visibility = "hidden";

      if(props.attempts == 10){
        inputs.namedItem("username").disabled = true;
        inputs.namedItem("password").disabled = true;
        subm.style.backgroundColor = "gray";
        subm.onmouseover = ()=>{
          subm.style.backgroundColor = "gray";
        }
        //subm.disabled = true;
        
        alert("timing you out for 5 seconds due to consecutive failed attempts");
        setTimeout(()=>{
          alert("no longer timed out");
          inputs.namedItem("username").disabled = false;
          inputs.namedItem("password").disabled = false;
          subm.disabled = false;
          subm.style.backgroundColor = "black";
        }, 5000)

        props.setAttempts(8);
      }

      console.log(props.attempts);
      return;
    }
    let salt = res1["Entity"];
    //console.log(salt);
    let hashPass = hash(password, salt, false)
    //console.log(ha);

    //get back the info using the salt we got from first call
    const res = await client.get(
      `anime/login/u=${username}/ps=${hashPass}/pr=${salt}`,
      {
        data:{
          username:username,
          password:hashPass,
          salt:salt
        }
      }
      ).then((res)=>{
        return res.data;
      })
    
      //console.log(res);
    //hash(res["salt"])

    /*const res = await fetch(`https://infernovertigo.pythonanywhere.com/anime/register/u=${username}/ps=${password}/pr=${salt}/m=l/`, 
    {
      method:"post",
      headers:{
        'Content-type':"application/json"
      },
      body:
        JSON.stringify({
          "data":usersQueue
        })
    })
    .then((res)=>{
      return res.json();
    })*/

    try{
      const l = res["Data"].length;
    }catch(e){   
      formError.innerText = "Invalid Credentials";
      formError.style.visibility = "visible";

      loader.style.visibility = "hidden";
      return;
    }

    let topAnime = localStorage.getItem("top_anime");
    let first_log = localStorage.getItem("First_Log");
    localStorage.clear();
    localStorage.setItem("top_anime", topAnime);
    localStorage.setItem("First_Log", JSON.stringify(false));
    for(let i = 0; i < res["Data"].length; i++){
      //console.log(res["Data"]);
      let id = res["Data"][i]["id"];
      //console.log(JSON.stringify(res["Data"][i]));
      localStorage.setItem(id, JSON.stringify(res["Data"][i]));
    }
    //console.log(res)
    //return;
    props.setloggedIn(true);
    
    //console.log("you're now logged in and have an account");
    localStorage.setItem("user", username);
    localStorage.setItem("password", hashPass);
    localStorage.setItem("salt", salt);
    localStorage.setItem("user_id", res["id"]);
    localStorage.setItem("hidden", JSON.stringify(true));
    //props.settoken(res["token"]);
    //localStorage.setItem("token", res["token"]);
    localStorage.setItem("logged_in", JSON.stringify(true));
    console.log("you're now logged in and have an account");
    
    props.setUsername(username);

    loader.style.visibility = "hidden";
    navigate("/");
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
  return (
    <div>
      {/*<Header/>
      <Nav showSearch={true}/>*/}
      <div>
        <div id="reg_form_container">
          <form id="register_form">
            <div id="inner_container">
            
              <legend id="register_legend">Anime Tree</legend>
              
              <label style={{display:"block"}} htmlFor="username">Enter a Username:</label>
              <input onChange={(e)=>UserErrorHandler(e)} name="username" type="text" placeholder='Enter Username'></input>
              <p id="user_error" style={{"visibility":"hidden", "color":"red", "margin":"0px", "fontWeight":"bold"}}>Invalid Username</p>
              
              <label style={{display:"block"}} htmlFor="password">Enter a Password:</label>
              <input onChange={(e)=>PassErrorHandler(e)} name="password" type="password" placeholder='Enter Password'></input><br></br>
              <input id="showPass" style={{"width":"5%"}} type="checkbox" onClick={(e)=>showPassword(e)}></input><label htmlFor="showPass">Show Password</label>
              <p id="pass_error" style={{"visibility":"hidden", "color":"red", "margin":"0px", "fontWeight":"bold"}}>Invalid Password</p>
              
              <span><Link to="/recovery">Forgot Password?</Link></span><br></br>

              <button type="button" id="register_submit_btn" onClick={(e)=>sendRequest()}>{props.loggedIn ? 'Submit' : 'Submit'}</button>
              <p id="form_error" style={{"visibility":"hidden", "color":"red", "margin":"0px", "fontWeight":"bold"}}>Invalid Credentials</p>
              <Link className='accButtons' to="/register"><a href="#" id="register_link">Don't have an account?</a></Link>
            </div>
          </form>
          <div id="loginLoader" className="loader"></div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage