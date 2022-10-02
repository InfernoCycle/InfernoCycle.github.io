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

        /*const res = await fetch(`http://127.0.0.1:8000/anime/${id}/`,{
            method:"PATCH",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                "watched": Number(data),
            })
        })*/
        var temp = JSON.parse(localStorage.getItem(id))
        temp.watched = data;
        localStorage.setItem(id, JSON.stringify(temp));

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
        /*const res = await fetch(`http://127.0.0.1:8000/anime/${id}/`,{
            method:"PATCH",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({"userRating":Number(data)})
        })*/
        var temp = JSON.parse(localStorage.getItem(id))
        temp.rating = data;
        localStorage.setItem(id, JSON.stringify(temp));
        e.target.textContent = Math.round(data);
    }

    const deleteItem = (e, id) =>{
        var temp = JSON.parse(localStorage.getItem(id))
        temp.status = false;
        localStorage.setItem(id, JSON.stringify(temp));

        props.setInQueue((obj)=>{
            const newArr = props.inQueue.filter((obj)=>{
                if(obj.id == id){
                    obj.status = false;
                }
                return obj.status == true;
            })
            //console.log(newArr);
            return newArr;
        })
        //console.log("removed the stuff")
    }

    const Timeout = (time) => {
        let controller = new AbortController();
        setTimeout(() => controller.abort(), time * 1000);
        return controller;
    };

    useEffect(()=>{
        //console.log("rerended")
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
                    <h3 key={obj.id}><a href={obj.url} target="_blank" rel="noreferrer">{obj.title}</a></h3>
                    <p /*key={obj.id}*/>{/*obj.synopsis*/}</p>
                </td>
                <td /*key={obj.id}*/ className='score'>
                    <p /*key={obj.id}*/><button onClick={(e)=>userRating(e, obj.id)} className='score-btn'>{obj.rating == '' || obj.rating == 0 ? "-" : obj.rating}</button></p>
                </td>
                <td /*key={obj.id}*/ className="anime_type">
                    <p /*key={obj.id}*/>{obj.type}</p>
                </td>
                <td /*key={obj.id}*/ className="prgs_anime">
                    <p><button onClick={(e)=>prgsCount(e, obj.id)} className='episodeCount-btn'>{obj.watched == '' ? 0 : obj.watched}</button>/{obj.episodes}</p>
                </td>
                <td /*key={obj.id}*/ className="cscore">
                    <p /*key={obj.id}*/>{obj.avgScores}</p>       
                </td>
                <td /*key={obj.id}*/ className="members">
                    <p /*key={obj.id}*/>{obj.members}</p>       
                </td>
                <td /*key={obj.id}*/ className='delete'>
                    <button onClick={(e)=>deleteItem(e, obj.id)} className='dlt_button'><FaTimes/></button>
                </td>
            </tr>    
        )})}
    </>
  )
}

export default QueueHolder