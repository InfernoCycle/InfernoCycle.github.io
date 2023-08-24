import {React, useEffect, useState} from 'react'
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL:"https://infernovertigo.pythonanywhere.com"
})

export default function PasswordRecover(props) {
  var hashes = require("jshashes");
  const [domains, setDomains] = useState("");
  const domainLimit = 30;

  useEffect(()=>{
    let domains = ""
    const domainLimit = 30;

    for(let i=0; i < domainLimit; i++){
      let copy = "([a-zA-Z0-9-]{1,63}\\.)?";
      domains = domains + copy;
    }

    setDomains(domains);
  }, [])

  const sendEmail = async(e) =>{
    const inputData = document.getElementsByTagName("input");
    const input = inputData.namedItem("email");

    const loader = document.getElementById("recoveryLoader");
    loader.style.display = "block";

    const success_message = document.getElementById("rec_email_success");
    success_message.style.display = "none";
    success_message.style.color = "green";
    success_message.innerHTML = "Recovery Link Was Successfully Sent! <b>\u2714</b>"

    const submitButton = document.getElementById("recovery_button");
    submitButton.disabled = true;

    if(input.value == ""){
      success_message.innerText = "No email was entered X";
      success_message.style.color = "red";
      success_message.style.display = "block";
      loader.style.display = "none";
      submitButton.disabled = false;
      return;
    }

    const match = input.value.match(`^\\w+@[a-zA-Z0-9]{1,63}\\.${domains}[a-zA-Z0-9]{1,63}$`);

    if(input.value.length > 256){
      success_message.innerText = "Email is over character limit of 256 X";
      success_message.style.color = "red";
      success_message.style.display = "block";
      loader.style.display = "none";
      submitButton.disabled = false;
      return;
    }

    if(match == null){
      success_message.innerText = "Invalid email format entered X";
      success_message.style.color = "red";
      success_message.style.display = "block";
      loader.style.display = "none";
      submitButton.disabled = false;
      return;
    }

    try{
      const hashed_email = new hashes.SHA256().hex(input.value);
      const req = await client.post("account/send_recovery",{
      data:{"email":input.value, "hashed_email":hashed_email}
      },{
        headers:{
          "Content-Type":"application/json"
        }
      }).then((res)=>{
        return res.data;
      })
      //console.log(req);

      setTimeout(function(){
        loader.style.display = "none";
        if(req["valid"] == true){
          success_message.style.display = "block";
        }
        else{
          success_message.style.color = "red";
          success_message.innerHTML = "Email address is not registered.";
          success_message.style.display = "block";
        }
        submitButton.disabled = false;
      }, 2000)
    }catch(e){
      console.log("inside catch")
      console.log("something went wrong", e);
      success_message.style.color = "red";
      success_message.innerHTML = "A problem occurred while sending email. Please try again later."
      loader.style.display = "none";
      success_message.style.display = "block";
      submitButton.disabled = false;
    } 
  }

  return (
    <div id="recovery_cont">
      <form id="recovery_form">
        <fieldset>
          <legend>Account Recovery</legend>

          <label>Enter Email: </label>
          <br></br>
          <input id="recovery_input" name="email" type="email" placeholder='Enter a valid email here'/>
          <br></br>
          <button type="button" onClick={(e)=>sendEmail(e)} id="recovery_button" value="Submit">Submit</button>
        </fieldset>
      </form>
      <div id="recoveryLoader" className="loader"></div>
      <p id="rec_email_success">Recovery Link Was Successfully Sent! <b>{"\u2714"}</b></p>
    </div>
  )
}
