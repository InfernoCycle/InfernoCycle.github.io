import React from 'react'

const Buttons = (props) => {
    
  return (
      <div className="btn-container">
          <a href={props.topAnime.url} target="_blank" rel="noreferrer"><button className='top-anime-buttons'>{props.topAnime.title}</button></a>
      </div>
  )
}

export default Buttons