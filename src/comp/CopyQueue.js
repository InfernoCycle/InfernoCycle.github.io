import React from 'react'
import Nav from './Nav'
import Header from './Header'

function CopyQueue() {
  return (
    <>
      {/*<Header/>
      <Nav/>*/}
      <h1 style={{textAlign:"center", color:"white"}}>MAL Anime Queue Copier</h1>

      <div style={{textAlign:"center"}}>
        <form>
          <label style={{color:"white", fontWeight:"bold"}}>Enter a User's MyAnimeList Username: <br></br></label>
          <input style={{width:"30%", fontSize:"20px", marginTop:"10px"}} type="text" placeholder="Ex: BobBilly123"/>
          <button style={{width:"auto", padding:"6px"}} className='QueueOptionBtns'> Submit</button>
        </form>

        <p style={{color:"white", margin:"10px 10% 0px 10%"}}>
          Note: This Page is for adding someones elses list to yours only. Do Not Use More than twice every 10 seconds. Please do not abuse this system or this page will be cutoff to everyone.
        </p>
      </div>
    </>
  )
}

export default CopyQueue