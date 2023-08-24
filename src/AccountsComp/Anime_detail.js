import React, { Component, useEffect } from 'react'
import Nav from '../comp/Nav'
import Header from '../comp/Header'
import Add from '../comp/Add'
import { useLocation } from 'react-router-dom'

function format(brdString = "?"){
  try{
    const splitString = brdString.split(" ");
    const firstTwo = splitString[0] + " " + splitString[1]+ " ";

    if(splitString[2].length == 4){
      const newString = firstTwo + splitString[2].substring(0,2) + ":" + splitString[2].substring(2,4) + " (JST)";
      return newString;
    }else{
      return brdString;
    }
  }catch(e){
    return "?";
  }
  
}

const Animedetail = (props) =>{
  const location = useLocation();
  /*useEffect(()=>{
    console.log(props)
  }, [])*/
  const obj =location.state.jinx
  //console.log(obj)
  return(
  <>
  <div id="detail_container">
    {/*<Header loggedIn={props.loggedIn} setLoggedIn={props.setloggedIn}/>
    <Nav showSearch={true}/>*/}
    <h1 className='detail_headers'>{location.state.jinx.title}</h1>
    <div id="inner_detail_cont">
      <div id="img_cont">
        <img src={location.state.jinx.img_url} />
      </div>
      <div id="features">
          {JSON.parse(localStorage.getItem("logged_in"))?
            <span><Add key={obj.id} status={obj.status} 
            img_url={obj.img_url} title={obj.title} id={obj.id} addState={props.addState}
            url={obj.url} episodes={obj.episodes} synopsis={obj.synopsis} airing={obj.airing}
            type={obj.type} members={obj.members} start_date={obj.start_date} end_date={obj.end_date}
            rated={obj.rated} avgScores={obj.avgScores} english_name={obj.english_name} japanese_name={obj.japanese_name} broadcast={obj.broadcast}/></span>
            : <></>
          }
          {/*<span><button className='feature_btns'><b>Add to List</b></button></span>*/}
          <span><button disabled={true} className='feature_btns'><b>Video (coming soon)</b></button></span>
          <span><button disabled={true} className='feature_btns'><b>Stats (coming soon)</b></button></span>
          {/*<span><button className='feature_btns'><b>Video</b></button></span>*/}
          {/*<span><button className='feature_btns'><b>Add to List</b></button></span>*/}
      </div>
      <div id="synopsis_cont">
        <h3 id="synopsis_title" className='detail_headers'>Synopsis:</h3>
        <p id="synopsis">{location.state.synopsis}</p>

        <h3 className="info_header">Information: </h3>
        <div id="additional_info">
          <span><b className="infoHeads">Episodes:</b> {location.state.jinx.episodes}</span>
          <span><b className="infoHeads">Broadcasted:</b> {format(location.state.jinx.broadcast)}</span>
          <span><b className="infoHeads">Type:</b> {location.state.jinx.type}</span>
          <span><b className="infoHeads">Started On:</b> {location.state.jinx.start_date}</span>
          <span><b className="infoHeads">Ended On:</b> {location.state.jinx.end_date}</span>
        </div>
      </div>
    </div>
    
    {/*<div id="info_user_area">
      <div className='bubble_area'>
        <h3 className="info_header">Information</h3>
        <div id="additional_info">
          <span><b>Episodes:</b> {location.state.jinx.episodes}</span>
          <span><b>Broadcasted:</b> {location.state.jinx.broadcast}</span>
          <span><b>Type:</b> {location.state.jinx.type}</span>
          <span><b>Started On:</b> {location.state.jinx.start_date}</span>
          <span><b>Ended On:</b> {location.state.jinx.end_date}</span>
        </div>
      </div>
  </div>*/}
  </div>
    
  </>)
}

export default Animedetail;