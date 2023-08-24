import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';

axios.defaults.withCredentials=true;

const Add = (props) => {
  const [status, setStatus] = useState(false);
  const [buttonObj, setButtonObj] = useState("");
  const [text, setText] = useState("Add To List");

  const process = async(id) =>{
    /*const res = await fetch(`http://127.0.0.1:8000/anime`, {mode:"cors"});
    const data = await res.json();
    const FilteredData = data.filter((obj)=>obj.id==id)
    console.log(FilteredData[0].id + " " + FilteredData[0].status + " from add");*/
    //const data = localStorage.getItem("main")
    const FilteredData = JSON.parse(localStorage.getItem(id))
    //if(FilteredData[0].status == true){
    if(FilteredData.status == true){
      //console.log(FilteredData.status)
      setText("Remove From List");
      setStatus(true);
    }
    else{
      setText("Add To List");
      setStatus(false);
    }
  }

  function intermediary(e){
    setButtonObj(e);
    /*console.log("button pressed: " + props.id);
    console.log("status: " + status)
    console.log("intermediary ran")*/
    if(status === false){
      setStatus(true);
      setText("Remove From List");
      props.addState(props.id, true, props.title, props.img_url, 
        props.url, props.episodes, props.avgScores, props.type,
        props.synopsis, props.airing, props.start_date, props.end_date, 
        props.members, props.rated, props.japanese_name, props.english_name, null, props,
        props.broadcast)
    }else{
      setStatus(false);
      setText("Add To List");
      //console.log(props.start_date)
      props.addState(props.id, false, props.title, props.img_url, 
        props.url, props.episodes, props.avgScores, props.type,
        props.synopsis, props.airing, props.start_date, props.end_date, 
        props.members, props.rated, props.japanese_name, props.english_name, null, props,
        props.broadcast)
    }
    //props.addState(buttonObj, props.id, status), " print from Add.js";
  }

  const fetchData = async(id) => {
    //console.log("feth data ran from add")
    /*const res = await fetch(`http://127.0.0.1:8000/anime`);
    const data = await res.json();
    const FilteredData = data.filter((obj)=>obj.id==id)
    console.log(FilteredData)*/
    const FilteredData = localStorage.getItem(id);
    /*if(FilteredData.length > 0){
      console.log("Data existed already")
      process(props.id)
    }*/
    if(FilteredData !== null){
      process(props.id)
    }
    else{
      /*console.log("Not located")
      console.log(`Adding ${props.id} to data`)
      console.log(props.start_date)*/
      props.addState(id, status, props.title, props.img_url, 
        props.url, props.episodes, props.avgScores, props.type,
        props.synopsis, props.airing, props.start_date, props.end_date, 
        props.members, props.rated, props.japanese_name, props.english_name, null, props,
        props.broadcast);
      return;
    }
  }

  useEffect(()=>{
    fetchData(props.id)
  }, [])

  return (
    <button onClick={(e)=>intermediary(e)} className="feature-btns">{text}</button>
  )
}

export default Add