import React, { useEffect, useState } from 'react'
import Add from './Add';
import Buttons from './Buttons'
import { Link, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import axios from 'axios';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.withCredentials = true;

const MainContent = (props) => {
  const [Season, updateseason] = useState("Fall");
  const [Year, updateYear] = useState(new Date().getFullYear());
  //const [results, updateResults] = useState(10);

  //const [SeasonLabel, updateLabel] = useState(`Fall ${Year}`);

  const [winter, setWinter] = useState(false); 
  const [summer, setSummer] = useState(false);
  const [spring, setSpring] = useState(false); 
  const [fall, setFall] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
      if((new Date().getMonth() >= 11 && new Date().getMonth <=2)){
          //console.log("it's winter")
          updateseason((obj)=>{
              setWinter(true);
              //fall = false;
              //summer = false;
              //spring = false;
              return "Winter";
          })
      }
      if((new Date().getMonth() >= 2 && new Date().getMonth() <= 5)){
          //console.log("it's spring")
          updateseason((obj)=>{
              setSpring(true);
              //fall = false;
              //summer = false;
              //winter = false;
              return "Spring";
          })
      }
      if((new Date().getMonth() >= 6 && new Date().getMonth() <= 8)){
          //console.log("it's summer")
          updateseason((obj)=>{
              setSummer(true);
              //fall = false;
              //spring = false;
              //winter = false;
              return "Summer"
          })
      }
      if((new Date().getMonth() >= 9 && new Date().getMonth() <= 11)){
          //console.log("it's fall")
          updateseason((obj)=>{
              setFall(true);
              //summer = false;
              //spring = false;
              //winter = false;
              return "Fall"
          })
      }
  }, [])

  useEffect(()=>{
    //localStorage.clear()
    //console.log("re-render")
  }, [props])

  //const navigate = useNavigate();

  async function get_anime_info(obj){
    console.log(obj)
    const res = axios.post("https://infernovertigo.pythonanywhere.com/anime/information", 
    {
        data:{title:obj.title, id:obj.id}
    }, 
    {headers:{
        "Content-Type":"application/json"
    }
    }).then((res)=>{
        return res.data;
    })
    console.log(await res);
    const entity = await res

    //localStorage.setItem("tempSynopsis", entity["entity"]);
    
    navigate("/anime", {state:{jinx:obj, synopsis:entity["entity"]}})
  }

  return (
    <>
      {/*<Nav showSearch={true} animeList={props.animeList} setSearch={props.setSearch} search={props.search} handleSearch={props.handleSearch} topAnime={props.topAnime}/>*/}
      {props.showContent == false ? <div className='container'>
          <div className='side'>
            <h2 className='top-anime-title'>New Episodes Today</h2>
            <div id="top-anime-container">
              {
                props.todayAnime.map((obj, idx)=>{
                  return(
                    <Buttons key={obj.mal_id} object={obj}/>
                  )
                })
              }
            </div>
            <h2 className='top-anime-title'>{Season} {Year} Anime</h2>
            <div id="top-anime-container">
              {props.seasonAnime.slice(0,10).map((obj, idx)=>{
                return(
                  <>
                  <Buttons key={obj.mal_id} object={obj}/>
                  </>
                )
              })}
                  
                <div className="btn-container">
                <div className='anime-Stuff'>
                    <div className="emptyExtraContent">
                      <div className="viewMore"><Link to="/seasonal" state={{jinx:props.seasonAnime}}>View More</Link></div>
                      {/*<a state={{jinx:props.object}} onClick={()=>get_anime_info(props.object)}><img onMouseOver={(e)=>showLink(e)} onMouseLeave={(e)=>hideLink(e)} className="topAnimePic" src={props.object.img_url} title={props.object.title} alt="Anime-pic" width="227" height="321px"/></a>*/}
                    </div>         
                  </div>
              </div>
            </div>
          </div>
          {/*<div className='side'>
              <h2 className='top-anime-title'>Top Anime</h2>
              <div id="top-anime-container">
                {props.topAnime.map((obj)=>{
                  //console.log(obj)
                  try{
                    //return(<></>)
                    return(<Buttons key={obj.mal_id} topAnime={obj} object={obj}/>);
                  }catch{
                    return(<></>)
                  }
                })}
              </div>
          </div>*/}
          {/*<div className='mainContent'>
              <h2>Search Results:</h2>
              <div className='anime-list'>
               {props.animeList.map((obj)=>{
                 try{
                  return(
                  <div key={obj.mal_id} className='anime-Stuff'>
                    <img src={obj.img_url} title={obj.title} alt="Anime-pic" width="227" height="321px"/>
                    <p className="anime-title"><a onClick={()=>get_anime_info(obj)} className="selectedTitle">{obj.title}</a></p>
                    {!JSON.parse(localStorage.getItem("hidden")) & JSON.parse(localStorage.getItem("logged_in"))?
                      <Add key={obj.mal_id} status={props.status} 
                      img_url={obj.image_url} title={obj.title} id={obj.mal_id} addState={props.addState}
                      url={obj.url} episodes={obj.episodes} synopsis={obj.synopsis} airing={obj.airing}
                      type={obj.type} members={obj.members} start_date={obj.start_date} end_date={obj.end_date}
                      rated={obj.rated} avgScores={obj.score} english_name={obj.english_name} japanese_name={obj.japanese_name} broadcast={obj.broadcast}/>
                      : <></>
                      }
                  </div>)}catch{
                    <></>
                  }
                })}
              </div>
              </div>*/}
      </div>:
      <>
        <div class="loader homeLoader"></div>
        <p id="loading_id2">Preparing website please wait a few minutes. If nothing appears after 5 minutes please refresh page.</p>
      </>
      }
    </>
  )
}

export default MainContent