import * as React from "react";
import {Fragment} from "react";
import App from "../App";
import MainContent from "./MainContent";
import Nav from "./Nav";
import Queue from "./Queue";
import Buttons from "./Buttons";
import Add from "./Add";

class ErrorBoundary extends React.Component {
  
    constructor(props) {
      super(props);
      
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    render() {
      if (this.state.hasError) {
        return (<>
        <Nav/>
        <div className='container'>
          <div className='side'>
              <h2>Top Anime</h2>
              {this.props.topAnime.map((obj)=>{
                try{
                  return(<Buttons key={obj.mal_id} topAnime={obj}/>);
                }catch{
                  return(<></>)
                }
              })}
          </div>
          <div className='mainContent'>
              <h2>Search Results:</h2>
              <div className='anime-list'>
               {this.props.animeList.map((obj)=>{
                 try{
                  return(
                  <div key={obj.mal_id} className='anime-Stuff'>
                    <img src={obj.image_url} alt="Anime-pic" width="227" height="321px"/>
                    <p className="anime-title">{obj.title}</p><Add key={obj.mal_id} status={this.props.status} title={obj.title} id={obj.mal_id} addState={this.props.addState}/>
                  </div>)}catch{
                    <></>
                  }
                })}
              </div>
          </div>
      </div>
        </>);
      }
      return this.props.children; 
    }
  }

  export default ErrorBoundary;