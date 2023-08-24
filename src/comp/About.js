import React from 'react'
import {FaTree} from "react-icons/fa"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Header from './Header'
import Nav from './Nav'

export default function About(props) {
  return (
    <div>
      {/*<Header loggedIn={props.loggedIn} setloggedIn={props.setloggedIn}></Header>
      <Nav showSearch={true}/>*/}

      <h1 className="aboutMeTitle">About Me</h1>
      <p className="aboutMePars">
        This is a website for anyone and everyone to have fun and to save and 
        keep track of your favorite anime. I made this website alone during my free time
        between doing my school work. I hope to someday get on the same level as titan anime list
        sites like MyAnimeList, AniDB, AniList, Kitsu and more, but I definitely have a long way to go.
      </p>

      <p className='aboutMePars'>
        I will try to constantly keep updating this site. I will also start keeping track of changes that 
        occur on the website down below (like how video games send out patch notifications showing what 
        changed in the update).
      </p>
      <hr></hr>
      <h2 className="updatesListHeader">Changes</h2>
      <ul className='updatesList'>
        <li>(8/4/2023)
          <ul>
            <li>Login System Now Implemented. Allows user to see their queue on the go.</li>
            <li>Leaderboard that shows how many anime a user has completed and your rank based on how many anime you have finished. (active anime do not count)</li>
            <li>Anime searches now appear as dropdown in search bar instead of appearing in main page content at the bottom.</li>
            <li>New anime episodes, seasonal anime, and top anime (top 10 only based on MyAnimeList) now all on home page.</li>
            <li>Seasonal Page Now combined with seasonal section on home page. Can be accessed by clicking "View More"</li>
            <li>Clicking title now sends user to home.</li>
            <li>Coming Soon: Allow users to view others list and add any anime you don't have from their list.</li>
            <li>Coming Soon: Achievements System.</li>
            <li>Coming Soon: Stats page to view user's completed shows, total episodes watched, rank, etc.</li>
            <li>Known Problems: Can't update episodes watched if episode count is 0 even if a show is active.</li>
            <li>Known Problems: Clicking opening or ending buttons will sometimes give the wrong video.</li>
          </ul>
        </li>
      </ul>
      <ul className='updatesList'>
        <li>(4/1/2023)
          <ul>
            <li>About Me Page Populated</li>
            <li>Fixed Issue of hidden buttons on top right corner of page</li>
            <li>"THIS PAGE IS EMPTY FOR NOW" is now higher on page so phone 
              users can see it easier (only applies to <b>Stats</b> page).</li>
            <li>Top Anime on front page is no longer on side so more space for search results (changing soon)</li>
            <li>Happy Fools Day</li>
          </ul>
        </li>
      </ul>
      <ul className='updatesList'>
        <li> (1/7/2023)
          <ul>
            <li>Added export button above user's which will download a formatted xml file that 
              user's can use to add their anime info on this site to MyAnimeList</li>
            <li>Fixed search bar issue where it didn't go to where a users show was.</li>
            <li>Increased search time performance.</li>
            <li>Users queues now have option to watch shows opening or ending (if available).</li>
            <li>Dedicated buttons for (1) adding episodes as watched, and (2) adding a show to currently watching.</li>
          </ul>
        </li>
      </ul>
      <ul className='updatesList'>
        <li> (10/29/2022)
          <ul>
            <li>Website is Officially Published</li>
          </ul>
        </li>
      </ul>
      <p className="NoAbout" style={{"display":"none"}}> THIS PAGE IS EMPTY FOR NOW</p>
    </div>
  )
}
