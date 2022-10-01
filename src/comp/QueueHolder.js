import React, { useState,useEffect } from 'react'
import {FaTimes} from "react-icons/fa"

/*<td key={obj.id}  className="prgs_anime">
                
                </td>
                <td key={obj.id}  className="user_score">
                
                </td> */
const QueueHolder = (props) => {
    const [update, setUpdate] = useState([]);
    const [change, setChange] = useState(1);

    useEffect(()=>{
        setUpdate(props.inQueue);
    }, [props.inQueue])

    const prgsCount = async(e, id) =>{
        const filt = update.filter((obj)=>obj.id === id);
        const data = prompt("Enter Progress ");
        if(Number(data) > Number(filt[0].episodes)){
            alert("Over the episode limit");
            return;
        }
        if(Number(data) == 0){
            return
        }

        const res = await fetch(`http://127.0.0.1:8000/anime/${id}/`,{
            method:"PATCH",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                "watched": Number(data),
            })
        })

        if(Number(data) == ""){
            //e.target.textContent = Number(0);
            return
        }
        else{
            e.target.textContent = data;
        }
    }

    const userRating = async(e, id) =>{
        const data = prompt("Enter show score (0-10): ");
        if(data > 10){
            alert("Cannot rate above 10");
            return;
        }
        else if(data == null){
            return;
        }
        const res = await fetch(`http://127.0.0.1:8000/anime/${id}/`,{
            method:"PATCH",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({"userRating":Number(data)})
        })
        e.target.textContent = Math.round(data);
    }

    const Timeout = (time) => {
        let controller = new AbortController();
        setTimeout(() => controller.abort(), time * 1000);
        return controller;
    };

    useEffect(()=>{
        console.log("rerended")
    }, [setChange])

  return (
    <>
        {
        update.map((obj, index)=>{
            return(
            <tr id={obj.id} onDoubleClick={(e)=>props.active(obj.id)} key={obj.id}>
                <td key={obj.id} className={`queue_number ${obj.watching ? "currentStyle" : {}}`}>        
                    <p>{index + 1}</p>
                </td>
                <td /*key={obj.id}*/ className="queue_img">
                    <img key={obj.id} src={obj.img_url} alt={obj.name} title={obj.name}/>
                </td>
                <td /*key={obj.id}*/ className="queue_name_synopsis">   
                    <h3 key={obj.id}><a href={obj.url} target="_blank" rel="noreferrer">{obj.name}</a></h3>
                    <p /*key={obj.id}*/>{obj.synopsis}</p>
                </td>
                <td /*key={obj.id}*/ className='score'>
                    <p /*key={obj.id}*/><button onClick={(e)=>userRating(e, obj.id)} className='score-btn'>{obj.userRating == '' || obj.userRating == 0 ? "-" : obj.userRating}</button></p>
                </td>
                <td /*key={obj.id}*/ className="anime_type">
                    <p /*key={obj.id}*/>{obj.type}</p>
                </td>
                <td /*key={obj.id}*/ className="prgs_anime">
                    <p><button onClick={(e)=>prgsCount(e, obj.id)} className='episodeCount-btn'>{obj.watched == '' ? 0 : obj.watched}</button>/{obj.episodes}</p>
                </td>
                <td /*key={obj.id}*/ className="cscore">
                    <p /*key={obj.id}*/>{obj.avgScore}</p>       
                </td>
                <td /*key={obj.id}*/ className="members">
                    <p /*key={obj.id}*/>{obj.members}</p>       
                </td>
                <td /*key={obj.id}*/ className='delete'>
                    <button className='dlt_button'><FaTimes/></button>
                </td>
            </tr>    
        )})}
    </>
  )
}

export default QueueHolder