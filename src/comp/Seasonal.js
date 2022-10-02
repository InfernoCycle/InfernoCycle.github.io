import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import Header from './Header'
import Add from './Add'

function getYears(){
    const date = new Date()
    const currentYear = date.getFullYear();
    var years = [];
    for(var i = currentYear; i >= 2000;i--){
        if(i === currentYear){
            years.push("Latest")
            continue;
        }
        years.push(i.toString())
    }
    return years;
}

export default function Seasonal(props) {
    const [seasonAnime, updateSeason] = useState([]);
    const [Season, updateseason] = useState("Fall");
    const [Year, updateYear] = useState(new Date().getFullYear());
    const [results, updateResults] = useState(10);

    const getSeason = (e) =>{
        //console.log(e.target.value);
        updateseason(e.target.value);
        //console.log(e);
    } 

    const getYear = (e) =>{
        //console.log(e.target.value);
        if(e.target.value === "Latest"){
            updateYear(new Date().getFullYear())
            return;
        }
        updateYear(e.target.value);
        //console.log(e);
    } 

    const getNumResults = (e) =>{
        //console.log(e.target.value);
        updateResults(e.target.value);
        //console.log(e);
    } 

    const changeSeason = async(e) =>{
        console.log("changing season")
        const res1 = await fetch(`https://infernovertigo.pythonanywhere.com/anime/season/val=${Season.toLowerCase() + "_" + Year.toString().toLowerCase()}/limit=${results}`)
        .then((res)=>res.json())

        console.log(res1)
        updateSeason([...res1]);
    }

    useEffect(()=>{
        async function aFunc(){
            const res1 = await fetch(`https://infernovertigo.pythonanywhere.com/anime/season/val=latest/limit=${results}`)
            .then((res)=>res.json())

            console.log(res1)
            updateSeason([...res1]);
        }
        aFunc();
        console.log("This run")
    }, [])
  
    return (
    <div>
        <Header/>
        <Nav/>
        <div className="amount_form_container">
            
            <span id="seasons_window">
                <label className="seasonal_text" htmlFor="season">Season: </label>
                <select onChange={(e)=>getSeason(e)} name="selector" id="season">
                    <option>Fall</option>
                    <option>Winter</option>
                    <option>Spring</option>
                    <option>Summer</option>
                </select>
            </span>

            <span id="years_window">
                <label className="seasonal_text" htmlFor="year">Year: </label>
                <select onChange={(e)=>getYear(e)} name="selector" id="year">
                    {getYears().map((obj)=>{
                        return(<option>{obj}</option>)
                    })}
                </select>
            </span>

            <br></br>

            <div id="results_window">
                <label className="seasonal_text" id="seasonal_label_amount" htmlFor="selector">Show: </label>
                <select onChange={(e)=>getNumResults(e)} name="selector_amount" id="amount">
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                    <option>25</option>
                </select>
                {/*<input type="button" value="Submit"></input>*/}
                
                <span className="seasonal_text" id="header_seasonal_result">Results</span>
                
                <p></p>
                <button id="submission" onClick={(e)=>changeSeason(e)} value="Confirm">Confirm</button>
            </div>
        </div>

        <div className='mainContent'>
              <h2>{Season} {Year}:</h2>
              <div className='anime-list'>
               {seasonAnime.map((obj)=>{
                 try{
                  return(
                  <div key={obj.mal_id} className='anime-Stuff'>
                    <img src={obj.image_url} alt="Anime-pic" width="227" height="321px"/>
                    <p className="anime-title">{obj.title}</p><Add key={obj.mal_id} status={props.status} 
                    img_url={obj.image_url} title={obj.title} id={obj.mal_id} addState={props.addState}
                    url={obj.url} episodes={obj.episodes} synopsis={obj.synopsis} airing={obj.airing}
                    type={obj.type} members={obj.members} start_date={obj.start_date} end_date={obj.end_date}
                    rated={obj.rated} avgScores={obj.score} english_name={obj.english_name} japanese_name={obj.japanese_name}/>
                  </div>)}catch{
                    <></>
                  }
                })}
              </div>
          </div>
    </div>
  )
}
