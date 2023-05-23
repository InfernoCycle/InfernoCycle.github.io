import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useState} from 'react';

const Nav = (props) => {
  const [page, setPage] = useState(false);

  return (
    <div className='nav-container'>
    <nav className='ViewQueue'>
        <div className='left'>
          <Link className="Link" to="/"><button>Home</button></Link>
          <Link className="Link" to="/queue"><button>The Queue</button></Link>
          <Link className="Link" to="/seasonal"><button>Seasonal Anime</button></Link>
          <Link className="Link" to="/stats"><button>Stats</button></Link>
          <Link className="Link" to="/about"><button>About</button></Link>

          {(props.showSearch === true) && (<form className='search-box' onSubmit={props.handleSearch}>
            <input 
            value={props.search} 
            onChange={e=>props.setSearch(()=>e.target.value)}
            type="search" 
            placeholder='Search for anime...'/>   
          </form>)}
        </div>
      </nav>
      </div>
  )
}

export default Nav