import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useState} from 'react';

const Nav = (props) => {
  const [page, setPage] = useState(false);

  async function search_results(e){
    const searchBox = document.getElementsByClassName("search-box");


  }

  return (
    <div className='nav-container'>
    <nav className='ViewQueue'>
        <div className='left'>
          <Link className="Link" to="/"><button>Home</button></Link>
          {/*JSON.parse(localStorage.getItem("hidden"))  || JSON.parse(localStorage.getItem("logged_in"))? 
          <Link className="Link" to="/queue"><button>The Queue</button></Link> 
          : <></>*/}
          <Link className="Link" to="/seasonal"><button>Seasonal Anime</button></Link>
          {/*JSON.parse(localStorage.getItem("hidden")) || JSON.parse(localStorage.getItem("logged_in"))?
          <Link className="Link" to="/stats"><button>Stats</button></Link>
          : <></>*/}
          <Link className="Link" to="/about"><button>About</button></Link>

          <div className='search-box'>
            {(props.showSearch === true) && (
            <form onSubmit={props.handleSearch}>
              <input 
              value={props.search} 
              onChange={e=>props.setSearch(()=>e.target.value)}
              type="search" 
              placeholder='Search for anime...'/>  
              <div className="search_results" style={{"backgroundColor":"red"}}>
                <div className="result_list">
                  
                </div>
              </div> 
            </form>
            )}
          </div>
        </div>
      </nav>
      </div>
  )
}

export default Nav