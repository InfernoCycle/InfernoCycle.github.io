import React from 'react'

export default function search_user() {
  return (
    <div>
      <div className='search-box'>
          <form onSubmit={props.handleSearch}>
            <input
            onKeyUp={e=>search(e)}
            className='search_input'
            value={props.search} 
            //onChange={e=>search_results(e)}
            type="search" 
            placeholder='Search for anime...'/>  
            <p id="searching">Searching For (show name) ...</p>
            <div className="search_results">
              <div className="result_list">

              </div>
            </div> 
          </form>
        </div>
    </div>
  )
}