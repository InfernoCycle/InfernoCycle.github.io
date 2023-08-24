import {React, useEffect, useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';
import axios from 'axios';

const client = axios.create({
  baseURL:"https://infernovertigo.pythonanywhere.com"
})
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.withCredentials = true;

export default function Redirecting(props) {
  const navigate = useNavigate();
  const location = useLocation();

  async function getPageSub(page){
    if(page == "leaderboard"){
      navigate("/leaderboard/1");
    }
  }

  async function getPageMain(page){   
    if(page == "home"){
      navigate("/");
    }

    if(page == "stats"){
      navigate("/stats");
    }

    if(page == "about"){
      navigate("/about");
    }
  }

  function check(){
    console.log(location.state)
    //console.log(props)
    if(location.state == "leaderboard"){
      location.state = null;
      getPageSub("leaderboard");
    }
    if(location.state == "home"){
      location.state = null;
      getPageMain("home");
    }
    if(location.state == "about"){
      location.state = null;
      getPageMain("about");
    }
    if(location.state == "stats"){
      location.state = null;
      getPageMain("stats");
    }
  }
  
  useEffect(()=>{
    check();
  }, [])

  return (
    <div id="redirect_cont">
      <div class="loader"></div>
      <span id="loading_id">LOADING PAGE</span>
    </div>
  )
}
