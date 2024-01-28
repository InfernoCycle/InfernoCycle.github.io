import React from 'react'
import Header from '../../comp/Header'
import Nav from '../../comp/Nav'
import { useEffect, useState } from 'react'
import QueueHolder from '../../comp/QueueHolder'
import utils from '../utils'
import Modal from "react-modal";
import {FaFilter} from "react-icons/fa"
import { HashLink as LinkV2 } from 'react-router-hash-link'
import { Link, useLocation } from 'react-router-dom'

export default function View(props) {
  const [inQueue, setinQueue] = useState([]);
  const [unchange, setUnchange] = useState([]);
  const [originalQueue, setOriginal] = useState([]);
  const [inSearch, updateinSearch] = useState("");
  const [anchored, setAnchored] = useState("A");
  const [isOpening, setIsOpening] = useState(false);
  const [url, loadURL] = useState([]);
  const [animeList, setList] = useState([]);
  const [exist, setExist] = useState(true);
  const [reloadable, setReload] = useState(true);

  let username = null;

  const location = useLocation();

  const [queueLoaded, setLoaded] = useState(false);

  let el = document.getElementById('root') || undefined;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  async function openModal(opening, id) {
    const val = animeList.find((obj)=>obj.id === id)
    let title = val["title"]
    let date = val["start_date"]
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

  function closeModal() {setIsOpen(false);}

  const getSearchValue = (e) =>{
    const val = animeList.find((obj)=>obj.title === e.target.value)
    if(val !== undefined){
      updateinSearch(()=>val.id);
    }
  }

  //ordering credit to these people: "https://www.scaler.com/topics/javascript-sort-an-array-of-objects/"
  //ordering credit also to "https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values"
  const orderAsc = () =>{
    var temp = animeList;
    var stuff = temp.sort((a, b)=>
      (a.title > b.title) ? 1 : (a.title < b.title) ? -1 : 0
    );
    setList(()=>[...stuff])
  }

  const orderDsc = () =>{
    var temp = animeList;
    var stuff = temp.sort((a, b)=>
      (a.title < b.title) ? 1 : (a.title > b.title) ? -1 : 0
    );
    //quickSort2(temp, 0, temp.length-1, "desc");
    //setinQueue(()=>[...temp]);
    setList(()=>[...stuff])
  }

  const original = async() =>{setList(()=>[...originalQueue]);}

  const main = (option) =>{
    if(option === ""){original();return;}
    if(option === "Ascending"){orderAsc();return;}
    if(option === "Descending"){orderDsc();return;}
    if(option === "Watching Now"){orderCurWtch();return;}
  }

  const putBackOriginal = async() =>{
    let newList = []
    for(var index = 0; index < localStorage.length; index++){
      var obj = null
      /*if(localStorage.key(index) == "dbVersion" || localStorage.key(index) == "reloader" || localStorage.key(index) == "token" || localStorage.key(index) == "First_Log" || localStorage.key(index) == "top_anime" || localStorage.key(index) == "salt"|| localStorage.key(index) == "password"|| localStorage.key(index) == "user" || localStorage.key(index) == "logged_in" || localStorage.key(index) == "user_id" || localStorage.key(index) == "version" || localStorage.key(index) == "email" || localStorage.key(index) == "trigger"){
        continue;
      }else{
        obj = JSON.parse(localStorage.getItem(localStorage.key(index)))
        //console.log(obj)
        if(obj.status === true){
          newList.push(obj);
        }
      }*/
      if(!Number.isNaN(Number(localStorage.key(index)))){
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
    let reser = []
    for(var index = 0; index < animeList.length; index++){
      var obj = animeList[index];
      if(obj.watching === true){reser.push(obj);}
    }
    setList(reser);
  }

  useEffect(()=>{
    if(reloadable){
      setLoaded(false);
      setExist(true);
    }
    async function user_queue(username){
      const res = await fetch("https://infernovertigo.pythonanywhere.com/users/queue", 
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({"name":username})
      })
      .then((value)=>value.json());

      if(res["Data"] == "0"){
        setExist(false);
        return;
      }

      setList(res["Data"]);

      setLoaded(true);
      //console.log(res["Data"]);
      setOriginal([...res["Data"]]);
      //console.log(username)
      //usr_arr = res["data"];
    }
    username = window.location.href.match(/\/user\/\w+\#?/g)[0];
    username = username.replace(/\/user\/|\#/g, "");
    //console.log(username);
    if(reloadable){
      user_queue(username);
      setReload(false);
    }
     
    // -> \/\w+$

  }, [location])
  
  return (
    <>
    {exist? 
    <>
    <div id="top"></div>
    <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={utils.customStyles}
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

      <LinkV2 to="#bottom"><span id="toBottom">Scroll to bottom</span></LinkV2>
      
      <div>
        <p style={{"fontSize":"20px", "color":"darkgray" ,"textAlign":"center", "marginLeft":"10%", "marginRight":"10%"}}>Viewing <b>{window.location.href.match(/\/user\/\w+\#?/g)[0].replace(/\/user\/|\#/g, "")}</b>'s List</p>
      </div>
      <div className='filter_container'>
          <div id="queue_search_id">
            <label className="queue_search_label">Search:</label>
            <input onChange={(e)=>getSearchValue(e)} list="queue_search" name="search" id="input_queue"></input>
              <datalist id="queue_search">
                {animeList.map((obj)=>{
                  return(<option key={obj.id} id={obj.id}>{obj.title}</option>)
                })}
              </datalist>
              {/*<LinkV2 to={{"pathname":`#${anchored}${inSearch}`}}>Search</LinkV2> */}
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
            {/*<Link id="exportButton" to="/mal_queue_in" state={inQueue}><button className="QueueOptionBtns">Import/Export Queue</button></Link>*/}
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
            {queueLoaded? 
            <QueueHolder status={false} inQueue={animeList} click={openModal}/>
            : 
            <div style={{"textAlign":"center", "marginTop":"50px"}}>
              <div class="loader"></div>
              <span id="loading_id">Loading</span>
            </div>
            }
            
          </tbody>
          
        </table>
      </div>
      <LinkV2 to="#top" ><span id="toTop">Back to Top</span></LinkV2>
      <footer id="bottom"></footer>
      </>:<h1>The User Was Not Found.</h1>}
    </>
  )
}