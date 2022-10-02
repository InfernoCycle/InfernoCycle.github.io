import React from 'react'
import Header from './Header'
import Nav from './Nav'
import { useEffect, useState} from 'react'
import QueueHolder from './QueueHolder'
import {FaFilter} from "react-icons/fa"

const quickSort = (list, low, high, order) =>{
  if(low < high){
    var pi = partition(list, low, high, order);
    quickSort(list, low, pi-1);
    quickSort(list, pi+1, high);
  }
}

function partition(list, low, high, order){
  let pivot = list[high];

  var i = (low - 1);
  for(let k = low; k <= high-1; k++){
      if(list[k].name < pivot.name){
        i++;
        list = swap(list, i, k);
      }
  }
  list = swap(list, i+1, high);
  return (i + 1);
}

function swap (list, f, k) {
  let temp = list[f];
  list[f] = list[k];
  list[k] = temp;

  return list;
}

//desc----------------------------------------------------------
const quickSort2 = (list, low, high, order) =>{
  if(low < high){
    var pi = partition2(list, low, high, order);
    quickSort2(list, low, pi-1);
    quickSort2(list, pi+1, high);
  }
}

function partition2(list, low, high, order){
  let pivot = list[high];

  var i = (low - 1);
  for(let k = low; k <= high-1; k++){
      if(list[k].name > pivot.name){
        i++;
        list = swap2(list, i, k);
      }
  }
  list = swap2(list, i+1, high);
  return (i + 1);
}

function swap2 (list, f, k) {
  let temp = list[f];
  list[f] = list[k];
  list[k] = temp;

  return list;
}
const Timeout = (time) => {
  let controller = new AbortController();
  setTimeout(() => controller.abort(), time * 1000);
  return controller;
};

//OPERATION MOVE MY JUNK 
const Queue = (props) => {
  const [inQueue, setinQueue] = useState([]);
  const [unchange, setUnchange] = useState([]);
  const [originalQueue, setOriginal] = useState([]);

  const getAnime = async(id)=>{
    /*const res1 = await fetch("http://127.0.0.1:8000/anime/status=true/", {
      signal:Timeout(10).signal
    })
    .then((res)=>res.json());*/
    let res1 = []
    
    for(var index = 0; index < localStorage.length; index++){
      var obj = JSON.parse(localStorage.getItem(localStorage.key(index)))
      //console.log(obj)
      if(obj.status === true){
        res1.push(obj);
      }
    }
    //console.log(res1);
    setinQueue([...res1]);
    setUnchange([...res1]);
    setOriginal([...res1]);
  }

  const orderAsc = () =>{
    var temp = inQueue;
    quickSort(temp, 0, temp.length-1, "asc");
    setinQueue(()=>[...temp]);
  }

  const orderDsc = () =>{
    var temp = inQueue;
    quickSort2(temp, 0, temp.length-1, "desc");
    setinQueue(()=>[...temp]);
  }

  const original = async() =>{
    /*const res = await fetch("http://127.0.0.1:8000/anime/status=true/", {
      signal:Timeout(10).signal
    }).then(response=>response.json())

    setinQueue(()=>[...res])*/
    setinQueue(()=>originalQueue);
  }

  const main = (e) =>{
    const data = e.target.value;

    if(data === ""){
      //setinQueue(()=>[...unchange]);
      original();
    }

    if(data === "Ascending"){
      //console.log("Ascending");
      orderAsc();
      return;
    }
    if(data === "Descending"){
      //console.log("Descending");
      orderDsc();
      return;
    }
    if(data === "Current"){
      //console.log("Current");
      orderCurWtch();
      return;
    }
  }

  const orderCurWtch = async() =>{
    /*const res1 = await fetch("http://127.0.0.1:8000/anime/watching=true/", {
      signal:Timeout(30).signal
    })
    .then(res=>res.json());*/

    let res1 = []
    
    for(var index = 0; index < localStorage.length; index++){
      var obj = JSON.parse(localStorage.getItem(localStorage.key(index)))
      //console.log(obj)
      if(obj.watching === true){
        res1.push(obj);
      }
    }

    setinQueue(res1);
    //console.log(res1);
  }

  useEffect(()=>{
    //console.log("rendered")
    getAnime(props.id)
    //setinQueue(props.status.filter((item)=>item.status == true))
    // eslint-disable-next-line
  }, [])

  const test = async(id) =>{
    /*const resOut = await fetch(`http://127.0.0.1:8000/anime/${id}/`, {
        signal:Timeout(10).signal
    }).then(res=>res.json());

    const data = resOut*/
    const data = JSON.parse(localStorage.getItem(id));
    console.log(data);
    
    /*if(data[0].watching === "" || data[0].watching === false){*/
    if(data.watching === "" || data.watching === false){
        /*const res = await fetch(`http://127.0.0.1:8000/anime/${id}/`, {
            signal:Timeout(10).signal,
            method:"PATCH",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({"watching":true})
        });
        setinQueue(inQueue.map((obj)=>
          obj.id === id ? {...obj, "watching":true} : obj
        ))*/
        var temp = {...data}
        temp.watching = true;
        localStorage.setItem(id, JSON.stringify(temp));

        setinQueue((obj)=>{
          const newArr = obj.filter((obj)=>{
            if(obj.id === id){
              obj.watching = true;
            }
            return obj.status === true || (obj.watching === true && obj.status === true);
          })
          return newArr;
        })

        setOriginal(inQueue)
        //setChange(1);
        return;
    }
    //else if(data[0].watching === true){
    else if(data.watching === true){
      //console.log("bot")
        /*const res = await fetch(`http://127.0.0.1:8000/anime/${id}/`, {
            signal:Timeout(10).signal,
            method:"PATCH",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({"watching":false})
        });
        setinQueue(inQueue.map((obj)=>
          obj.id === id ? {...obj, "watching":false} : obj
        ))*/
        var temp = {...data}
        temp.watching = false;
        localStorage.setItem(id, JSON.stringify(temp));
        setinQueue((obj)=>{
          const newArr = obj.filter((obj)=>{
            if(obj.id === id){
              obj.watching = false;
            }
            return obj.status === true || (obj.watching === false && obj.status === true)
          })
          return newArr;
        })
        setOriginal(inQueue)
        //setChange(2);
        return;
    }

    console.log("doubleClicked");
  }

  //<div className='queue-container'>
  //</div>
  return (
    <div>
      <div id="top"></div>
        <Header/>
        <Nav showSearch={false}/>
        <a href="#bottom">Scroll to bottom</a>
        <form className='filter_container'>
          {/*<label className="queue_search_label">Search:</label>
          <input list="queue_search" name="search" id="input_queue"></input>
          <datalist id="queue_search">
            {inQueue.map((obj)=>{
              return(<><option key={obj.id} id={obj.id} value={obj.name}/></>)
            })}
          </datalist>*/}

          <label className="filter_label" name="filter"><FaFilter/>Filter:</label>
          <select className="filter" onChange={(e)=>main(e)}>
            <option></option>
            <option>Ascending</option>
            <option>Descending</option>
            <option>Current</option>
          </select>
        </form>
      <div className='table-container'>
        <table className='main_table'>
        
        <tbody className='queue-table-body'>
              <tr>
                <td className='number_header'>#</td>
                <td className='img_header'>Image</td>
                <td className="name_header">Anime Title</td>
                <td className="score_header">Score</td>
                <td className='type_header'>Type</td>
                <td className='prgs_header'>Progress</td>
                <td className='cscore_header'>CScore</td>
                <td colSpan={1} className='member_header'>Members</td>
                <td className='dlt_header'>Dlt</td>
              </tr>
          <QueueHolder active={test} setInQueue={setinQueue} inQueue={inQueue} animeList={props.animeList}/>
          </tbody>
          
        </table>
      </div>
      <a id="bottom" href="#top">Back to top</a>
    </div>
  )
}

export default Queue