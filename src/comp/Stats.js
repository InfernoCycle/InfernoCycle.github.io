import React from 'react'
import Nav from './Nav'
import Header from './Header'

export default function Stats(props){


  return (
    <div>
      <Header loggedIn={props.loggedIn} setloggedIn={props.setloggedIn}/>
      <Nav/>
      <p className="NoAbout"> THIS PAGE IS EMPTY FOR NOW</p>
    </div>
  )
}
