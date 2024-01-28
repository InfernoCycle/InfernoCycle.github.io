/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import { ContextHead } from '../App';
//import {useState} from 'react';

const Nav = (props) => {
  const [page, setPage] = useState(false);
  const [searchList, setSearchList] = useState({});
  const [allowSearchUpdate, setSearchUpdate] = useState(true);
  const limit = 10;
  var timeout = null;
  const delay = 1500;
  const navigate = useNavigate();
  var FocusingOut = false;
  const {masterList, db} = useContext(ContextHead)

  useEffect(()=>{
    async function main(){
      const results = await masterList
      const search_res = document.getElementsByClassName("search_input");
      //console.log(results);
      if(results.length == 0){
        search_res[0].disabled = true;
        return;
      }else{
        search_res[0].disabled = false;
      }
      
      let replacement = {}
      /*masterAllAnime.onsuccess = (e2) =>{
        const results = e2.target.result
        //console.log(results[0]["title"][0])*/
        //console.log(results)
        let englishTitle = null;
        let japaneseTitle = null;
        /*for(let i = 0; i < results.length; i++){
          //const title = results[i]["title"][0].toLowerCase();
          try{
            englishTitle = results[i]["english_name"][0].toLowerCase();
          }catch{
            englishTitle = "";
          }
          
          try{
            japaneseTitle = results[i]["japanese_name"][0].toLowerCase();
          }catch{
            japaneseTitle = "";
          }
          
          if(englishTitle != ""){
            if(replacement[englishTitle] == undefined || replacement[englishTitle] == null){
              replacement[englishTitle] = {};
            }
            //replacement[englishTitle].push(results[i])
            if(results[i]["english_name"] in replacement[englishTitle]){
              replacement[englishTitle][results[i]["english_name"] + "181"]=results[i]
              //console.log(`Iteration: ${i}` + ", english: ", results[i]["english_name"])
              continue;
            }
            replacement[englishTitle][results[i]["english_name"]]=results[i]
          }
          if(japaneseTitle != ""){
            if(replacement[japaneseTitle] == undefined || replacement[japaneseTitle] == null){
              replacement[japaneseTitle] = {};
            }
            if(results[i]["japanese_name"] in replacement[japaneseTitle]){
              replacement[japaneseTitle][results[i]["japanese_name"] + "181"]=results[i]
              //console.log(`Iteration: ${i}` + ", japanese: ", results[i]["japanese_name"])
              continue;
            }
            //replacement[japaneseTitle].push(results[i])
            replacement[japaneseTitle][results[i]["japanese_name"]]=results[i]
          }
        }*/
        for(let i = 0; i < results.length; i++){
          //const title = results[i]["title"][0].toLowerCase();
          try{
            englishTitle = results[i]["english_name"][0].toLowerCase();
          }catch{
            englishTitle = "";
          }
          
          try{
            japaneseTitle = results[i]["japanese_name"][0].toLowerCase();
          }catch{
            japaneseTitle = "";
          }
          
          if(englishTitle != ""){
            //replacement[englishTitle].push(results[i])
            if(results[i]["english_name"] in replacement){
              replacement[results[i]["english_name"] + "181"]=results[i]
              //console.log(`Iteration: ${i}` + ", english: ", results[i]["english_name"])
              continue;
            }
            replacement[results[i]["english_name"]]=results[i]
          }
          if(japaneseTitle != ""){
            if(results[i]["japanese_name"] in replacement){
              replacement[results[i]["japanese_name"] + "181"]=results[i]
              //console.log(`Iteration: ${i}` + ", japanese: ", results[i]["japanese_name"])
              continue;
            }
            //replacement[japaneseTitle].push(results[i])
            replacement[results[i]["japanese_name"]]=results[i]
          }
        }
      setSearchList((obj)=>{
        return replacement;
      })
      //console.log("complete")
    }
   main()
  }, [masterList])

  function merge(left, right) {
    let sortedArr = [] // the sorted items will go here
    while (left.length && right.length) {
      // Insert the smallest item into sortedArr
      if (left[0] > right[0]) {
        sortedArr.push(left.shift())
      } else {
        sortedArr.push(right.shift())
      }
    }
    // Use spread operators to create a new array, combining the three arrays
    return [...sortedArr, ...left, ...right]
  }

  function merge_sort(arr){
    if (arr.length <= 1) return arr

    const halfMax = Math.floor(arr.length/2)

    let left = merge_sort(arr.slice(0, halfMax));
    let right = merge_sort(arr.slice(halfMax, arr.length));

    return merge(left, right);

      /*let l, k, r = 0;

      while(l < left.length & r < right.length){
        if(left[l][0] < right[r][0]){
          left[l] = arr[k];
          l++;

        }else{
          right[r] = arr[k];
          r++;
        }
        k++;
      }

      while(l < left.length){
        left[l] = arr[k];
        k++;
        l++;
      }

      while(r < right.length){
        right[l] = arr[k];
        k++;
        r++;
      }*/
  }

  function get_ten(arr){
    let count = 0;
    let temp = [];
    let prev = [];

    for(let k = 0; k < arr.length; k++){
      if(count == 10){
        break;
      }
      if(k>0){
        prev = arr[k-1];
      }
      const current = arr[k];

      if(current[1] == prev[1]){
        continue;
      }
      temp.push(searchList[arr[k][2].toString()]);
      count+=1;
    }

    return temp;
  }

  async function get_anime_info(obj){
    let type = null;

    if(obj.id){
      type = obj.id;
    }
    else if(obj.mal_id){
      type = obj.mal_id;
    }
    const res = await fetch("https://infernovertigo.pythonanywhere.com/anime/information", 
    {
        method:"POST",
        body:JSON.stringify({"title":obj.title, "id":type}),
     
        headers:{
            "Content-Type":"application/json"
        }
    }).then((res)=>{
        return res.json();
    })
    //console.log(res);
    //const entity = await res;

    //localStorage.setItem("tempSynopsis", entity["entity"]);
    
    navigate("/anime", {state:{jinx:obj, synopsis:res["entity"]}})
    //console.log("navigate");
  }

  function search(e, setEmpty=false){
    const result_holder = document.getElementsByClassName("result_list")[0];
    const search_load_string = document.getElementById("searching")
    result_holder.innerHTML = "";
    search_load_string.innerHTML = `Searching for ${e.target.value} ...`;
    search_load_string.style.display = "block";

    if(e.target.value == ""){
      result_holder.innerHTML = "";
      search_load_string.innerHTML = "";
      search_load_string.style.display = "none";
    }
    if(setEmpty){
      result_holder.style.display="none";
      search_load_string.innerHTML = "";
      search_load_string.style.display = "none";
      return;
    }
    clearTimeout(timeout);
    timeout = setTimeout(()=>{
      result_holder.innerHTML = "";
      let value = e.target.value.toString().toLowerCase().replace(/[-\:\,\"\[\]\;\'\+\=\!\`\~\(\)\*\&\^\%\$\>\<\?\/\\ ]+/g, "").trim();
      if(value.length == 0 || value==undefined || value==" "){
        setSearchUpdate(()=>true);
        return;
      }
      //console.log(e.target.value)
      let count = 0;
      const userInputLength = value.length;
      let showsList = [];
      setSearchUpdate(()=>true);
      //const startList = searchList[value[0]].slice(0,100);
      const startList = searchList//[value[0]];
      const keys = Object.keys(startList);
      let valueList = [];
      //console.log(keys.slice(1000,2000))
      //return;
      for(let i=0; i< keys.length; i++){
        const title = keys[i].replace(/[-\:\,\"\[\]\;\'\+\=\!\`\~\(\)\*\&\^\%\$\>\<\?\/\\ ]+/g, "").toLowerCase().trim();
        //const title = "ReZEROStartingLifeinAnotherWorld".toLowerCase();
        if(count == 10){
          break;
        }
        let stepThrough = 0;
        let matches = 0;
        let inArow = 0;
        let previousJapName = null;
        let previousEngName = null;
        if(value.substring(0, value.length) == title.substring(0, value.length)){
          const matches = value.length/title.length;
          //console.log(matches)
          valueList.push([1.0+matches, startList[keys[i]]["id"], startList[keys[i]]["title"], startList[keys[i]]["english_name"], startList[keys[i]]["japanese_name"]])
          continue;
        }
        let trigger = false;

        outter1:for(let k=0; k < value.length; k++){
          inner1:for(let h=stepThrough; h < title.length; h++){
            if(stepThrough == title.length-1){
              let matched = matches/title.length;
              //console.log(matched)
              valueList.push([matched, startList[keys[i]]["id"], startList[keys[i]]["title"], startList[keys[i]]["english_name"], startList[keys[i]]["japanese_name"]])
              //valueList.push([matched, "re zero stuff"]);
              break outter1;
            }
            if(inArow>1){
              matches+=1;
              //console.log(title);
            }
            if(value.charAt(k) == title.charAt(stepThrough)){
              if(trigger == true){
                stepThrough+=1
                continue inner1;
              }

              stepThrough = h;
              inArow+=1;
              stepThrough+=1;
              matches +=1;
              /*console.log("StepThrough: ", stepThrough);
              console.log(`Title char matched input char '${value.charAt(k)}' at title position: ${h}`)
              console.log("In a row: ", inArow)*/

              if(k == value.length-1){
                trigger=true;
                continue inner1;
              }
              break inner1;
            }
            inArow = 0;
            stepThrough+=1;
          }
        }
      }
      //console.log(valueList);
      const data = get_ten(merge_sort(valueList));
      //console.log(data);

      let img;
      let start;
      let end;

      let begin = data.length-1;
      for(let j=0; j<data.length; j++){
        if(data[j] == undefined){
          continue;
        }
        try{
          img = data[j]["img_url"]
        }catch{
          img=""
        }
        try{
          start = data[j]["start_date"]
        }catch{
          start = ""
        }
        try{
          end = data[j]["end_date"]
        }catch{
          end = ""
        }
        search_load_string.innerHTML = "";
        result_holder.innerHTML = result_holder.innerHTML + `<div class="result">`+
        `<img src=${img} height='100px' width='70px'/>` +
        `<div class='search_info'>`+
        `<h1>${data[j]["title"]}</h1>`+
        `</div>`

        /*result_holder.children[j].addEventListener("click", ()=>{
          console.log("Placebo of doom");
          get_anime_info(data[j]);
        })*/

        //console.log(result_holder.children[j].scrollHeight);
        /*if(result_holder.children[j] != undefined){
          console.log(result_holder.children[j].scrollHeight)
          if(result_holder.children[j].scrollHeight > 100){
            console.log(data[j]);
            result_holder.children[j].style.overflowY = "scroll";
          }
        }*/
        /*const outterDiv = document.createElement("div");
        outterDiv.setAttribute("className", "result");

        const image = document.createElement("img");
        image.setAttribute("height", "100px");
        image.setAttribute("width", "70px");

        try{
          image.setAttribute("src", data[j]["img_url"]);
        }catch{
          image.setAttribute("src", "");
        }
        
        outterDiv.appendChild(image);

        const innerDiv = document.createElement("div");
        innerDiv.setAttribute("className", "search_info");
        
        const title = document.createElement("h1");
        const textNode = document.createTextNode(data[j]["title"])
        title.appendChild(textNode);
        
        const date = document.createElement("p");

        let start_date = null;
        let end_date = null;
        try{
          start_date = document.createTextNode(data[j]["start_date"]);
        }catch(e){
          start_date = "?";
          console.log("Error: " + e.toString() + ", idx", j)
        }

        try{
          end_date = document.createTextNode(data[j]["end_date"]);
        }catch(e){
          end_date = "?";
          console.log("Error: " + e.toString() + ", idx", j)
        }
        const dateTextNode = document.createTextNode(start_date + " to " + end_date)
        date.appendChild(dateTextNode);

        innerDiv.appendChild(title);
        innerDiv.appendChild(date);

        outterDiv.appendChild(innerDiv);

        result_holder.appendChild(outterDiv);*/
        search_load_string.style.display="none";
      }

      //console.log(result_holder.children)

      //last for loop
      for(let k=0; k<result_holder.children.length; k++){
        //console.log(result_holder.children[k].scrollHeight);
        /*if(result_holder.children[k].scrollHeight > 100){
          result_holder.children[k].style.overflowY="scroll";
          result_holder.children[k].style.overflowX="hidden";
        }*/
        result_holder.children[k].addEventListener("click", ()=>{
          //console.log("Placebo of doom");
          get_anime_info(data[k])});
      }

      //console.log(valueList);
    }, delay)
    return;
  }
  var timeout2 = null;

  useEffect(()=>{
    $(".search_input").focusin(function(e){
      const result_holder = document.getElementsByClassName("result_list")[0];
      result_holder.style.display="block";
    })

    $(".search_input").focusout(function(e){
      if(!FocusingOut){
        setTimeout(()=>{
          const search_load_string = document.getElementById("searching")
          FocusingOut = true;
          const result_holder = document.getElementsByClassName("result_list")[0];
          result_holder.style.display="none";
          FocusingOut = false;
          search_load_string.style.display="none";
          //console.log("clear everything");
        }, 200)
      }
      
      //search(e, true);
    })

    $("form").submit(function(e){
      e.preventDefault();
      console.log("don't reload")
    })
  },[])

  /*$(window).resize(function(){
    const result_holder = document.getElementsByClassName("result_list")[0];
    clearTimeout(timeout2);
    timeout2 = setTimeout(()=>{
      for(let k = 0; k<result_holder.children.length; k++){
        if(result_holder.children[k].scrollHeight > 100){
          result_holder.children[k].style.overflowY="scroll";
          result_holder.children[k].style.overflowX="hidden";
        }
      }
    }, delay-1000)
  })*/
  function testefied(){
    console.log("delay bruv");
  }
  async function search_results(e){
    const searchBox = document.getElementsByClassName("search-box");
    let valueOutside = e.target.value.toString().toLowerCase();

    if(valueOutside.length == 0 || valueOutside==undefined || valueOutside==" "){
      return;
    }
    const percentMatch = 0.25;
    // get length of string and compare with max length of other string and get best percentage results
    if(allowSearchUpdate){
      setTimeout(()=>{
        let value = e.target.value.toString().toLowerCase().replace(/[-\:\,\"\[\]\;\'\+\=\!\`\~\(\)\*\&\^\%\$\>\<\?\/\\ ]+/g, "").trim();
        if(value.length == 0 || value==undefined || value==" "){
          setSearchUpdate(()=>true);
          return;
        }
        console.log(e.target.value)
        let count = 0;
        const userInputLength = value.length;
        let showsList = [];
        setSearchUpdate(()=>true);
        //const startList = searchList[value[0]].slice(0,100);
        const startList = searchList//[value[0]];
        const keys = Object.keys(startList);
        let valueList = [];
        //console.log(keys.slice(1000,2000))
        //return;
        for(let i=0; i< keys.length; i++){
          const title = keys[i].replace(/[-\:\,\"\[\]\;\'\+\=\!\`\~\(\)\*\&\^\%\$\>\<\?\/\\ ]+/g, "").toLowerCase().trim();
          //const title = "ReZEROStartingLifeinAnotherWorld".toLowerCase();
          if(count == 10){
            break;
          }
          let stepThrough = 0;
          let matches = 0;
          let inArow = 0;
          let previousJapName = null;
          let previousEngName = null;
          if(value.substring(0, value.length) == title.substring(0, value.length)){
            const matches = value.length/title.length;
            //console.log(matches)
            valueList.push([1.0+matches, startList[keys[i]]["id"], startList[keys[i]]["title"], startList[keys[i]]["english_name"], startList[keys[i]]["japanese_name"]])
            continue;
          }
          let trigger = false;

          outter1:for(let k=0; k < value.length; k++){
            inner1:for(let h=stepThrough; h < title.length; h++){
              if(stepThrough == title.length-1){
                let matched = matches/title.length;
                //console.log(matched)
                valueList.push([matched, startList[keys[i]]["id"], startList[keys[i]]["title"], startList[keys[i]]["english_name"], startList[keys[i]]["japanese_name"]])
                //valueList.push([matched, "re zero stuff"]);
                break outter1;
              }
              if(inArow>1){
                matches+=1;
                //console.log(title);
              }
              if(value.charAt(k) == title.charAt(stepThrough)){
                if(trigger == true){
                  stepThrough+=1
                  continue inner1;
                }

                stepThrough = h;
                inArow+=1;
                stepThrough+=1;
                matches +=1;
                /*console.log("StepThrough: ", stepThrough);
                console.log(`Title char matched input char '${value.charAt(k)}' at title position: ${h}`)
                console.log("In a row: ", inArow)*/

                if(k == value.length-1){
                  trigger=true;
                  continue inner1;
                }
                break inner1;
              }
              inArow = 0;
              stepThrough+=1;
            }
          }
        }

        //console.log(valueList);
        const data = get_ten(merge_sort(valueList));
        console.log(data);
        //console.log(valueList);
        return;
      }, 1500)
    }
    setSearchUpdate(()=>false)
    //console.log(Object.keys(searchList));
  }

  function redirectLeaderboard(e){
    props.setRedirect("leaderboard");
    //console.log(props);
    //navigate("/redirect", {state:"leaderboard"});
    navigate("/leaderboard/1");
  }

  function redirect(page){
    if(page == "home"){
      //navigate("/redirect", {state:"home"});
      navigate("/");
    }
    if(page == "about"){
      //navigate("/redirect", {state:"about"});
      navigate("/about");
    }
  }

  return (
    <div className='nav-container'>
    <nav className='ViewQueue'>
        <div className='left'>
          <a onClick={(e)=>redirect("home")} className="Link"><button>Home</button></a>
          {/*JSON.parse(localStorage.getItem("hidden"))  || JSON.parse(localStorage.getItem("logged_in"))? 
          <Link className="Link" to="/queue"><button>The Queue</button></Link> 
          : <></>*/}
          <a className="Link" onClick={(e)=>redirectLeaderboard(e)}><button style={{color:"red"}}>Maintanence</button></a>
          {/*JSON.parse(localStorage.getItem("hidden")) || JSON.parse(localStorage.getItem("logged_in"))?
          <Link className="Link" to="/stats"><button>Stats</button></Link>
          : <></>*/}
          <a onClick={(e)=>redirect("about")} className="Link"><button>About</button></a>
          
          <div className='search-box'>
            {(props.showSearch === true) && (
              <form onSubmit={props.handleSearch}>
                <input
                onKeyUp={e=>search(e)}
                className='search_input'
                value={props.search} 
                //onChange={e=>search_results(e)}
                type="search" 
                placeholder='Search for anime...'/>  
                <p id="searching">Searching For (show name) ...</p>
                <div className="search_results">
                  <div className="result_list">

                  </div>
                </div> 
              </form>
              )}
          </div>
        </div>
      </nav>
      </div>
  )
}

export default Nav