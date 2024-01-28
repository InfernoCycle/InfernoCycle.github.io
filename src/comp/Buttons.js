import { useEffect } from 'react';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';

const showLink = (e) =>{
  let parent = e.target.parentNode.parentNode;
  let child = parent.childNodes;
  child[1].style.color="red";
  //console.log(parent);
  //parent.childNodes[1].style.display="block";
}

const hideLink = (e) =>{
  let parent = e.target.parentNode.parentNode;
  let child = parent.childNodes;
  child[1].style.color="black";
  //console.log(child[1].style);
  //console.log(e)
  //parent.childNodes[1].style.display="none";
}

const Buttons = (props) => {
  const navigate = useNavigate();

  function single_double(day){if(day.toString().length == 1){return "0" + day.toString();}return day;}
  function to_12_hour(time){
    let time_prefix = "";
    let hour = time.getHours();
    if(hour >= 12){time_prefix = "P.M.";}else{time_prefix = "A.M.";}
    if(hour > 12){hour = hour % 12;}
    let minutes = single_double(time.getMinutes());

    return`${hour}:${minutes} ${time_prefix}`;
  }

  function renderer(){
    if(props.scratch){
      return (<>{props.today==true?<p class="show_date_btn_p" style={{width:"227px", fontWeight:"bold", "color":"red", "textAlign":"center", "textDecoration":"line-through"}}>{to_12_hour(props.object.user_date)}</p>:<></>}</>);
    }else{
      return (<>{props.today==true?<p class="show_date_btn_p" style={{width:"227px", fontWeight:"bold", "color":"red", "textAlign":"center"}}>{to_12_hour(props.object.user_date)}</p>:<></>}</>);
    }
  }

  async function get_anime_info(obj){
    let type = null;

    if(obj.id){
      type = obj.id;
    }
    else if(obj.mal_id){
      type = obj.mal_id;
    }
    const res = await fetch("https://infernovertigo.pythonanywhere.com/anime/information", 
    {
        method:"POST",
        body:JSON.stringify({"title":obj.title, "id":type}),
     
        headers:{
            "Content-Type":"application/json"
        }
    }).then((res)=>{
        return res.json();
    })
    //console.log(res);
    //const entity = await res;

    //localStorage.setItem("tempSynopsis", entity["entity"]);
    
    navigate("/anime", {state:{jinx:obj, synopsis:res["entity"]}})
  }
    //console.log(props.object)
  return (
      <div className="btn-container">
        <div key={props.object.mal_id} className='anime-Stuff'>
                    <div className="topAnimePic-container">
                      <a state={{jinx:props.object}} onClick={()=>get_anime_info(props.object)}><img className="topAnimePic" src={props.object.img_url} title={props.object.title} alt="Anime-pic" width="227" height="321px"/></a>
                      {/*<a state={{jinx:props.object}} onClick={()=>get_anime_info(props.object)}><img onMouseOver={(e)=>showLink(e)} onMouseLeave={(e)=>hideLink(e)} className="topAnimePic" src={props.object.img_url} title={props.object.title} alt="Anime-pic" width="227" height="321px"/></a>*/}
                      <p className="anime-title"><div className='anime-title-background'><p className="selectedTitle2">{props.object.title}</p></div></p>
                    </div>         
                  </div>
                  {renderer()}
      </div>
  )
}

export default Buttons