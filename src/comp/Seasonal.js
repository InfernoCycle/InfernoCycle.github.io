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

    const [SeasonLabel, updateLabel] = useState(`Fall ${Year}`);

    const [winter, setWinter] = useState(false); 
    const [summer, setSummer] = useState(false);
    const [spring, setSpring] = useState(false); 
    const [fall, setFall] = useState(false);

    useEffect(()=>{
        if((new Date().getMonth() >= 11 && new Date().getMonth <=2)){
            console.log("it's winter")
            updateseason((obj)=>{
                setWinter(true);
                //fall = false;
                //summer = false;
                //spring = false;
                return "Winter";
            })
        }
        if((new Date().getMonth() >= 2 && new Date().getMonth() <= 5)){
            console.log("it's spring")
            updateseason((obj)=>{
                setSpring(true);
                //fall = false;
                //summer = false;
                //winter = false;
                return "Spring";
            })
        }
        if((new Date().getMonth() >= 6 && new Date().getMonth() <= 8)){
            console.log("it's summer")
            updateseason((obj)=>{
                setSummer(true);
                //fall = false;
                //spring = false;
                //winter = false;
                return "Summer"
            })
        }
        if((new Date().getMonth() >= 9 && new Date().getMonth() <= 11)){
            console.log("it's fall")
            updateseason((obj)=>{
                setFall(true);
                //summer = false;
                //spring = false;
                //winter = false;
                return "Fall"
            })
        }
    }, [])

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
        alert("Please wait at most 10 seconds for content to load");
        //console.log("changing season")
        const res1 = await fetch(`https://infernovertigo.pythonanywhere.com/anime/season/val=${Season.toLowerCase() + "_" + Year.toString().toLowerCase()}/limit=${results}`)
        .then((res)=>res.json())

        //console.log(res1)
        props.updateSeason([...res1]);
        updateLabel(()=>`${Season} ${Year}`);
    }

    useEffect(()=>{
        //console.log("this ran stuff")
    }, [changeSeason])

    /*useEffect(()=>{
        async function aFunc(){
            const res1 = await fetch(`https://infernovertigo.pythonanywhere.com/anime/season/val=latest/limit=${results}`)
            .then((res)=>res.json())

            console.log(res1)
            updateSeason([...res1]);
        }
        aFunc();
        console.log("This run")
    }, [])*/
  
    return (
    <div>
        <Header loggedIn={props.loggedIn} setloggedIn={props.setloggedIn}/>
        <Nav/>
        <div className="amount_form_container">
            
            <span id="seasons_window">
                <label className="seasonal_text" htmlFor="season">Season: </label>
                <select onChange={(e)=>getSeason(e)} name="selector" id="season">
                    <option selected={fall}>Fall</option>
                    <option selected={winter}>Winter</option>
                    <option selected={spring}>Spring</option>
                    <option selected={summer}>Summer</option>
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
               {props.seasonAnime.map((obj)=>{
                 try{
                  return(
                  <div key={obj.mal_id} className='anime-Stuff-test'>
                    <p className="anime-title-test"><a className="selectedTitle" href={obj.url} target="_blank">{obj.title}</a></p>
                    <img src={obj.image_url} alt="Anime-pic" width="227" height="321px"/>
                    <Add key={obj.mal_id} status={props.status} 
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
