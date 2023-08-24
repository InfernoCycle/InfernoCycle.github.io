import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

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
      </div>
  )
}

export default Buttons