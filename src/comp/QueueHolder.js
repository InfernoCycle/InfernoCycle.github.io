import React, { useState,useEffect } from 'react'
import {FaTimes} from "react-icons/fa"
/*<td key={obj.id}  className="prgs_anime">
                
                </td>
                <td key={obj.id}  className="user_score">
                
                </td> */
const QueueHolder = (props) => {
    const [update, setUpdate] = useState([]);
    const [anchored, setAnchored] = useState("A");
    const [usedButton, setUsedButton] = useState(false);
    const [Progress, setProgress] = useState(0);

    useEffect(()=>{
        setUpdate(props.inQueue);
    }, [props.inQueue])

    const prgsCount = async(e, id, isButton, isIncrease, index=0) =>{
        setUsedButton(false);
        if(!isButton){
            const filt = update.filter((obj)=>obj.id === id);
            const data = prompt("Enter Progress ");
            if(Number(data) > Number(filt[0].episodes)){
                alert("Over the episode limit");
                return;
            }
            if(Number(data) < 0){
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
        else{
            setUsedButton(true);
            var temp = JSON.parse(localStorage.getItem(id))
            if(isIncrease){
                //console.log("Increase")
                if(Number(temp.watched) < temp.episodes){
                    temp.watched = Number(temp.watched) + Number(1);
                    localStorage.setItem(id, JSON.stringify(temp));
                    var value = document.getElementsByClassName("episodeCount-btn");
                    value[index].innerHTML = temp.watched
                    //setProgress(temp.watched);
                    //e.target.textContent = (Number(e.target.textContent) + 1).toString();
                }
            }else{
                //console.log("Decrease")
                if(Number(temp.watched) > 0){
                    temp.watched = Number(temp.watched) - Number(1);
                    localStorage.setItem(id, JSON.stringify(temp));
                    var value = document.getElementsByClassName("episodeCount-btn");
                    value[index].innerHTML = temp.watched
                    //setProgress(temp.watched);
                    //e.target.textContent = (Number(e.target.textContent) - 1).toString();
                }
            }
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

    const getAnime = (id) =>{
        setProgress(()=>{
            var val= localStorage.getItem(id).watched
            return val;
        })
    }
    
    useEffect(()=>{
        //console.log("rerended")
    }, [setAnchored, prgsCount])

  return (
    <>
        {
        update.map((obj, index)=>{
            return(
            <>
            <tr className="main_table_tr" id={anchored + obj.id.toString()} key={obj.id}>
                <td key={obj.id} className={`queue_number ${obj.watching ? "currentStyle" : {}}`}>        
                    <p>{index + 1}</p>
                </td>
                <td /*key={obj.id}*/ className="queue_img">
                    <img key={obj.id} src={obj.img_url} alt={obj.name} title={obj.name}/>
                </td>
                <td /*key={obj.id}*/ className="queue_name_synopsis">   
                    <h3 key={obj.id}><a href={obj.url} target="_blank" rel="noreferrer">{obj.title}</a></h3>
                    
                </td>
                <td /*key={obj.id}*/ className='score'>
                    <p /*key={obj.id}*/><button onClick={(e)=>userRating(e, obj.id)} className='score-btn'>{obj.rating == '' || obj.rating == 0 ? "-" : obj.rating}</button></p>
                </td>
                <td /*key={obj.id}*/ className="anime_type">
                    <p /*key={obj.id}*/>{obj.type}</p>
                </td>
                <td /*key={obj.id}*/ className="prgs_anime">
                    <p><button onClick={(e)=>prgsCount(e, obj.id, false, false)} className='episodeCount-btn'>{obj.watched == '' ? 0:obj.watched}</button>/{obj.episodes}</p>               
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
            <tr className="Data_table_row">
                <td colSpan={9}>
                    <div id="Main_Queue_Option">
                        <div id="ATC"><button onClick={(e)=>props.active(obj.id)}>Add to Current</button></div>
                        <div id="PO"><button onClick={(e)=>props.click(true, obj.id)}>Play Opening</button></div>
                        <div id="PE"><button onClick={(e)=>props.click(false, obj.id)}>Play Ending</button></div>
                        <div id="Ep_button_option">
                            <div id="buttonDown"><button className="epButtons" onClick={(e)=>prgsCount(e, obj.id, true, false, index)}>{"\u02C5"}</button></div>
                            <div id="buttonUp"><button className="epButtons" onClick={(e)=>prgsCount(e, obj.id, true, true, index)}>{"\u02C4"}</button></div>
                        </div>
                    </div>
                </td>
            </tr>
            </>
        )})}
    </>
  )
}

export default QueueHolder