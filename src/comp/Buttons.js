import React from 'react'

const showLink = (e) =>{
  let parent = e.target.parentNode.parentNode;
  parent.childNodes[1].style.display="block";
}

const hideLink = (e) =>{
  let parent = e.target.parentNode.parentNode;
  parent.childNodes[1].style.display="none";
}

const Buttons = (props) => {
    
  return (
      <div className="btn-container">
        <div key={props.object.mal_id} className='anime-Stuff'>
                    <div className="topAnimePic-container">
                      <a href={props.object.url}><img onMouseOver={(e)=>showLink(e)} onMouseLeave={(e)=>hideLink(e)} className="topAnimePic" src={props.object.img_url} title={props.object.title} alt="Anime-pic" width="227" height="321px"/></a>
                      <p className="anime-title-top"><a className="selectedTitle2" href={props.object.url} target="_blank">{props.object.title}</a></p>
                    </div>         
                  </div>
      </div>
  )
}

export default Buttons