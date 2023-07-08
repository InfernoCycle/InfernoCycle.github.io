import React, { useEffect } from 'react'
import Add from './Add';
import Buttons from './Buttons'
import { Link, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import axios from 'axios';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.withCredentials = true;

const MainContent = (props) => {
  useEffect(()=>{
    //localStorage.clear()
    //console.log("re-render")
  }, [props])

  const navigate = useNavigate();

  async function get_anime_info(obj){
    const res = axios.post("https://infernovertigo.pythonanywhere.com/anime/information", 
    {
        data:obj.title
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
      <Nav showSearch={true} animeList={props.animeList} setSearch={props.setSearch} search={props.search} handleSearch={props.handleSearch} topAnime={props.topAnime}/>
      <div className='container'>
          <div className='side'>
              <h2 className='top-anime-title'>Top Anime</h2>
              <div id="top-anime-container">
                {props.topAnime.map((obj)=>{
                  //console.log(obj)
                  try{
                    return(<></>)
                    //return(<Buttons key={obj.mal_id} topAnime={obj} object={obj}/>);
                  }catch{
                    return(<></>)
                  }
                })}
              </div>
          <div>
            <h2 className='top-anime-title'>New Episodes</h2>
          </div>
          </div>
          <div className='mainContent'>
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
          </div>
      </div>
    </>
  )
}

export default MainContent