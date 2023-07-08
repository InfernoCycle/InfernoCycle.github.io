import React, { Component, useEffect } from 'react'
import Nav from '../comp/Nav'
import Header from '../comp/Header'
import { useLocation } from 'react-router-dom'

const Animedetail = (props) =>{
  const location = useLocation();
  useEffect(()=>{
    //console.log(props)
  }, [])
  return(
  <>
    <Header loggedIn={props.loggedIn} setLoggedIn={props.setloggedIn}/>
    <Nav showSearch={true}/>
    <h>Title: {location.state.jinx.title}</h>
    <img src={location.state.jinx.img_url} />
    <h3>Synopsis:</h3>
    <p>{location.state.synopsis}</p>
    <ul>
      <li>Episodes: {location.state.jinx.episodes}</li>
      <li>Broadcasted: {location.state.jinx.broadcast}</li>
      <li>Type: {location.state.jinx.type}</li>
      <li>Started On: {location.state.jinx.start_date}</li>
      <li>Ended On: {location.state.jinx.end_date}</li>
    </ul>
  </>)
}

export default Animedetail;