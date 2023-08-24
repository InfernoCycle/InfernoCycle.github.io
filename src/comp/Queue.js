import React from 'react'
import Header from './Header'
import Nav from './Nav'
import { useEffect, useState} from 'react'
import QueueHolder from './QueueHolder'
import {FaFilter} from "react-icons/fa"
import Modal from "react-modal";
import { Link } from 'react-router-dom'
import { HashLink as LinkV2 } from 'react-router-hash-link';
import QueueToFile from '../ProcessingFrontEnd/queueToFile'
import CopyQueue from './CopyQueue'
import ExportQueue from './ExportQueue'

const Timeout = (time) => {
  let controller = new AbortController();
  setTimeout(() => controller.abort(), time * 1000);
  return controller;
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
      backgroundColor: "black",
      backgroundImage:"url(https://t3.ftcdn.net/jpg/03/08/13/12/360_F_308131267_unLRF2JmPsjjXgrMRaFA3aEnrKa9aUxK.jpg)"
    },
    overlay:{
      backgroundColor: 'rgba(0, 0, 255, 0.03)',
      position:'fixed',
      //backgroundImage:"url(https://t3.ftcdn.net/jpg/03/08/13/12/360_F_308131267_unLRF2JmPsjjXgrMRaFA3aEnrKa9aUxK.jpg)"
    }
};

//OPERATION MOVE MY JUNK 
const Queue = (props) => {
  const [inQueue, setinQueue] = useState([]);
  const [unchange, setUnchange] = useState([]);
  const [originalQueue, setOriginal] = useState([]);
  const [inSearch, updateinSearch] = useState("");
  const [anchored, setAnchored] = useState("A");
  const [isOpening, setIsOpening] = useState(false);
  const [url, loadURL] = useState([]);

  let el = document.getElementById('root') || undefined;
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  async function openModal(opening, id) {
    let ObjectJson = localStorage.getItem(id);
    let title = JSON.parse(ObjectJson)["title"]
    let date = JSON.parse(ObjectJson)["start_date"]
    let year = date.toString().split(",")[1].trim();

    if(opening){
      async function retaliate(){
        const res = await fetch(`https://infernovertigo.pythonanywhere.com/anime/music/val=${title}/opening=${opening}/year=${year}`)
        .then((response)=>response.json());

        loadURL((obj)=>res[0]);
      }
      retaliate();
      setIsOpening(true);
    }
    else{
      async function retaliate(){
        const res = await fetch(`https://infernovertigo.pythonanywhere.com/anime/music/val=${title}/opening=${opening}/year=${year}`)
        .then((response)=>response.json());

        loadURL((obj)=>res[0]);
      }
      retaliate();
      setIsOpening(false);
    }
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const getAnime = async(id)=>{
    /*const res1 = await fetch("http://127.0.0.1:8000/anime/status=true/", {
      signal:Timeout(10).signal
    })
    .then((res)=>res.json());*/
    let res1 = []
    
    for(var index = 0; index < localStorage.length; index++){
      var obj = null
      if(localStorage.key(index) == "dbVersion" || localStorage.key(index) == "reloader" || localStorage.key(index) == "token" || localStorage.key(index) == "First_Log" || localStorage.key(index) == "top_anime" || localStorage.key(index) == "salt"|| localStorage.key(index) == "password"|| localStorage.key(index) == "user" || localStorage.key(index) == "logged_in" || localStorage.key(index) == "user_id" || localStorage.key(index) == "version" || localStorage.key(index) == "email" || localStorage.key(index) == "trigger"){
        continue;
      }else{
        obj = JSON.parse(localStorage.getItem(localStorage.key(index)))
        //console.log(obj)
        if(obj.status === true){
          res1.push(obj);
        }
      }
    }
    //console.log(res1);
    setinQueue([...res1]);
    setUnchange([...res1]);
    setOriginal([...res1]);
    props.setInQueue([...res1]);
  }

  //ordering credit to these people: "https://www.scaler.com/topics/javascript-sort-an-array-of-objects/"
  //ordering credit also to "https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values"
  const orderAsc = () =>{
    var temp = inQueue;
    var stuff = temp.sort((a, b)=>
      (a.title > b.title) ? 1 : (a.title < b.title) ? -1 : 0
    );
    var nameOnly = temp.map((obj)=>obj.title);
    //quickSort(nameOnly, 0, temp.length-1, "asc");
    //setinQueue(()=>[...temp]);
    setinQueue(()=>[...stuff])
  }

  const orderDsc = () =>{
    var temp = inQueue;
    var stuff = temp.sort((a, b)=>
      (a.title < b.title) ? 1 : (a.title > b.title) ? -1 : 0
    );
    //quickSort2(temp, 0, temp.length-1, "desc");
    //setinQueue(()=>[...temp]);
    setinQueue(()=>[...stuff])
  }

  const original = async() =>{
    /*const res = await fetch("http://127.0.0.1:8000/anime/status=true/", {
      signal:Timeout(10).signal
    }).then(response=>response.json())
    setinQueue(()=>[...res])*/
    //console.log(originalQueue)
    //await putBackOriginal();
    setinQueue(()=>originalQueue);
  }

  const main = (option) =>{
    //const data = e.target.value;
    //console.log(option)

    if(option === ""){
      //setinQueue(()=>[...unchange]);
      //console.log("original ran")
      original();
    }

    if(option === "Ascending"){
      //console.log("Ascending");
      orderAsc();
      return;
    }
    if(option === "Descending"){
      //console.log("Descending");
      orderDsc();
      return;
    }
    if(option === "Watching Now"){
      //console.log("Current");
      orderCurWtch();
      return;
    }
  }

  const putBackOriginal = async() =>{
    let newList = []
    for(var index = 0; index < localStorage.length; index++){
      var obj = null
      if(localStorage.key(index) == "dbVersion" || localStorage.key(index) == "reloader" || localStorage.key(index) == "token" || localStorage.key(index) == "First_Log" || localStorage.key(index) == "top_anime" || localStorage.key(index) == "salt"|| localStorage.key(index) == "password"|| localStorage.key(index) == "user" || localStorage.key(index) == "logged_in" || localStorage.key(index) == "user_id" || localStorage.key(index) == "version" || localStorage.key(index) == "email" || localStorage.key(index) == "trigger"){
        continue;
      }else{
        obj = JSON.parse(localStorage.getItem(localStorage.key(index)))
        //console.log(obj)
        if(obj.status === true){
          newList.push(obj);
        }
      }
    }

    setOriginal([...newList]);
  }

  const orderCurWtch = async() =>{
    /*const res1 = await fetch("http://127.0.0.1:8000/anime/watching=true/", {
      signal:Timeout(30).signal
    })
    .then(res=>res.json());*/

    let reser = []
    
    for(var index = 0; index < localStorage.length; index++){
      if(localStorage.key(index) == "dbVersion" || localStorage.key(index) == "reloader" || localStorage.key(index) == "token" || localStorage.key(index) == "First_Log" || localStorage.key(index) == "top_anime" || localStorage.key(index) == "salt"|| localStorage.key(index) == "password"|| localStorage.key(index) == "user" || localStorage.key(index) == "logged_in" || localStorage.key(index) == "user_id" || localStorage.key(index) == "version" || localStorage.key(index) == "email" || localStorage.key(index) == "trigger"){
        continue;
      }
      var obj = JSON.parse(localStorage.getItem(localStorage.key(index)))
      //console.log(obj)
      if(obj.watching === true){
        reser.push(obj);
      }
    }

    setinQueue(reser);
    //console.log(res1);
  }

  useEffect(()=>{
    //console.log("rendered")
    getAnime(props.id)
    //setinQueue(props.status.filter((item)=>item.status == true))
    // eslint-disable-next-line
  }, [])

  const test = async(e, id, status, idx) =>{
    /*const resOut = await fetch(`http://127.0.0.1:8000/anime/${id}/`, {
        signal:Timeout(10).signal
    }).then(res=>res.json());

    const data = resOut*/
    const data = JSON.parse(localStorage.getItem(id));
    //console.log(data);
    
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
          const newArr = obj.filter((obj, idex)=>{
            if(obj.id === id){
              obj.watching = true;
            }
            return obj.status === true || (obj.watching === true && obj.status === true);
          })
          //console.log(newArr)

          return newArr;
        })
        await putBackOriginal();

        //setOriginal(inQueue)
        
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
          const newArr = obj.filter((obj, idex)=>{
            if(obj.id === id){
              obj.watching = false;
            }
            return obj.status === true || (obj.watching === false && obj.status === true)
          })
          //console.log(newArr)

          return newArr;
        })
        await putBackOriginal();
        //console.log(inQueue)
        //setOriginal(inQueue)
        //setChange(2);
        return;
    }

    //console.log("doubleClicked");
  }

  const getSearchValue = (e) =>{
    const val = inQueue.find((obj)=>obj.title === e.target.value)
    if(val !== undefined){
      updateinSearch(()=>val.id);
    }
  }

  //<div className='queue-container'>
  //</div>
  return (
    <div>     
      <div id="top"></div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        appElement={el}
        animationType="fade"
        //className="Modal"
        //overlayClassName="Overlay"
      >
        
        {isOpening ? 
        <iframe width="100%" height="500" src={url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> : 
        <iframe width="100%" height="500" src={url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        }
      </Modal>

        {/*<Header loggedIn={props.loggedIn} setLoggedIn={props.setloggedIn}/>
        <Nav showSearch={true}/>*/}
        <LinkV2 to="#bottom"><span id="toBottom">Scroll to bottom</span></LinkV2>
        <div className='filter_container'>
          <div id="queue_search_id">
            <label className="queue_search_label">Search:</label>
            <input onChange={(e)=>getSearchValue(e)} list="queue_search" name="search" id="input_queue"></input>
              <datalist id="queue_search">
                {inQueue.map((obj)=>{
                  return(<option key={obj.id} id={obj.id}>{obj.title}</option>)
                })}
              </datalist>
              <button id="queue_search_btn"><LinkV2 to={`#${anchored}${inSearch}`}>Search</LinkV2></button>
          </div>

          <div id="queue_filter_id">
            <label className="filter_label" name="filter"><FaFilter/>Filter:</label>
            <select className="filter" onChange={(e)=>main(e.target.value)}>
              <option></option>
              <option>Ascending</option>
              <option>Descending</option>
            </select>
          </div>
        </div>
        <div className="Anime_Statuses">
          <nav>
            <button onClick={(e)=>main("")} className="QueueOptionBtns">All Anime</button>
            <button onClick={(e)=>main("Watching Now")} className="QueueOptionBtns">Watching Now</button>
            {/*<Link to="/mal_queue"><button disabled={true} className="QueueOptionBtns">Transfer From MAL</button></Link>*/}
            {<Link id="exportButton" to="/mal_queue_in" state={inQueue}><button className="QueueOptionBtns">Export Queue</button></Link>}
          </nav>
        </div>
      <div className='table-container'>
        <table className='main_table'>
        
        <tbody className='queue-table-body'>
              <tr>
                <td className='number_header'>#</td>
                <td className='img_header'>Image</td>
                <td className="name_header">Title</td>
                <td className="score_header">Score</td>
                <td className='type_header'>Type</td>
                <td className='prgs_header'>Progress</td>
                {/*<td className='cscore_header'>CScore</td>
                <td colSpan={1} className='member_header'>Members</td>*/}
                <td className='dlt_header'></td>
              </tr>
          <QueueHolder active={test} setInQueue={setinQueue} inQueue={inQueue} animeList={props.animeList} click={openModal}/>
          </tbody>
          
        </table>
      </div>
      <LinkV2 to="#top" ><span id="toTop">Back to Top</span></LinkV2>
      <footer id="bottom"></footer>
    </div>
  )
}

export default Queue