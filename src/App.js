import { useState, useEffect, createContext } from "react"; 
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./comp/Header";
import MainContent from "./comp/MainContent";
import Nav from "./comp/Nav";
import Queue from "./comp/Queue";
import ErrorBoundary from "./comp/ErrorBoundary";
import Seasonal from "./comp/Seasonal";
import About from "./comp/About";
import Leaderboard from "./comp/Leaderboard";
import Stats from "./comp/Stats";
import CopyQueue from "./comp/CopyQueue";
import ExportQueue from "./comp/ExportQueue";
import RegisterPage from "./AccountsComp/Pages/RegisterPage";
import LoginPage from "./AccountsComp/Pages/LoginPage";
import ProtectRoute from "./ProcessingFrontEnd/protectRoute";
import Animedetail from "./AccountsComp/Anime_detail";
import PasswordRecover from "./AccountsComp/Pages/PasswordRecover"
import Redirecting from "./comp/redirecting";
import Cookies from "universal-cookie";
import axios from "axios";
import {Dexie} from 'dexie';
import {useLiveQuery} from 'dexie-react-hooks'

export const db = new Dexie('myDatabase');
db.version(1).stores({
  anime: 'id, airing, start_date, broadcast', // Primary key and indexed props
  season: 'id, airing, start_date, broadcast', // Primary key and indexed props
})

//open database
db.open().then((res)=>{
  //console.log(res)
}).catch((res)=>{
  console.log(res)
  console.log("failed to open")
})

const cookies = new Cookies()

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "https://infernovertigo.pythonanywhere.com"
})

export const ContextHead = createContext();

function App() {
  //https://api.jikan.moe/v3/top/type/page/subtype

  /*if(localStorage.getItem("First_Log") == null){
    localStorage.setItem("First_Log", JSON.stringify(true));
  }
  if(localStorage.getItem("trigger") == null){
    localStorage.setItem("trigger", false);
    setcontentStatus(()=>{return false})
  }
  if(localStorage.getItem("reloader") == null){
    localStorage.setItem("reloader", false);
  }
  if(localStorage.getItem("dbVersion") == null){
    localStorage.setItem("dbVersion", 1);
  }
  if(JSON.parse(localStorage.getItem("dbVersion")) != 1){
    localStorage.setItem("dbVersion", 1);
  }*/
  if(localStorage.getItem("undefined")){
    localStorage.removeItem("undefined");
  }

  async function reload(synthesize=false){
    if(!synthesize){
      setTimeout(async()=>{
        localStorage.setItem("reloader", true);
        window.location.href = window.location.href;
      }, 100)
    }
    else if(synthesize == true){
      window.location.reload();
    }
  }

  const [masterAllAnime, setMasterList] = useState([]);
  const [todaysList, setTodays] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [AnimeList, setAnimeList] = useState(()=>[]);
  const [topAnime, setTopAnime] = useState(()=>[]);
  const [getAnime, setGetAnime] = useState("");
  //const [queue, setAddQueue] = useState([]);
  //const [currentStatus, setcurrentStatus] = useState(false);
  //const [status, setStatus] = useState(()=>[]);
  const [status, setStatus] = useState(() => [])

  const [seasonAnime, updateSeason] = useState([]);
  //const [Season, updateseason] = useState("Fall");
  //const [Year, updateYear] = useState(new Date().getFullYear());
  const [results, updateResults] = useState(10);
  //const [csrfValue, setCSRF] = useState(null);
  const [token, setToken] = useState("");
  const [inQueue, setInQueue] = useState([]);
  //const [user_id, setId] = useState(null);
  const [attempts, setAttempts] = useState(8);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [todayAnime, setTodayAnime] = useState([]);
  const [redirectTo, setRedirect] = useState("");
  const [contentStatus, setcontentStatus] = useState(true);

  var limiter = false;
  //var db = null;

  const [Season, updateseason] = useState("Fall");
  const [Year, updateYear] = useState(new Date().getFullYear());
  //const [results, updateResults] = useState(10);

  //const [SeasonLabel, updateLabel] = useState(`Fall ${Year}`);

  const [winter, setWinter] = useState(false); 
  const [summer, setSummer] = useState(false);
  const [spring, setSpring] = useState(false); 
  const [fall, setFall] = useState(false);

  useEffect(()=>{
      if((new Date().getMonth() >= 11 && new Date().getMonth <=2)){
          //console.log("it's winter")
          updateseason((obj)=>{
              setWinter(true);
              //fall = false;
              //summer = false;
              //spring = false;
              return "Winter";
          })
      }
      if((new Date().getMonth() >= 2 && new Date().getMonth() <= 5)){
          //console.log("it's spring")
          updateseason((obj)=>{
              setSpring(true);
              //fall = false;
              //summer = false;
              //winter = false;
              return "Spring";
          })
      }
      if((new Date().getMonth() >= 6 && new Date().getMonth() <= 8)){
          //console.log("it's summer")
          updateseason((obj)=>{
              setSummer(true);
              //fall = false;
              //spring = false;
              //winter = false;
              return "Summer"
          })
      }
      if((new Date().getMonth() >= 9 && new Date().getMonth() <= 11)){
          //console.log("it's fall")
          updateseason((obj)=>{
              setFall(true);
              //summer = false;
              //spring = false;
              //winter = false;
              return "Fall"
          })
      }
  }, [])

  async function finish(versionNumber=JSON.parse(localStorage.getItem("version"))){
    //console.log("this ran instead")
      //console.log(animeSize);
      //console.log(seasonSize);
      const results = await db.anime.where("airing").equals(1).toArray();
      const seasonsMe = await db.season.where("id").above(0).toArray();
      setSeasonalAnime((obj)=>{
        return [...seasonsMe]
      })

      const time = new Date();
      const DOW = time.getDay();
      const local = new Date();
      const localParse = Date.parse(`${local.getFullYear()}-0${local.getMonth()}-${local.getDate()}T23:59:00.000+09:00`);
      const japanese_time = new Date();
      japanese_time.setTime(time.getTime()+(540*60*1000));
      const japanDOW = japanese_time.getDay();
      const japanDOM = japanese_time.getDate();
      const japanMonth = japanese_time.getMonth();
      const japanYear = japanese_time.getFullYear();
      //section to get next day after Japan
      let nextDay = 0;
      const days_month = new Date(japanYear, japanMonth+1, 0)
      const days_in_month = days_month.getDate();
      if(japanDOM == days_in_month){nextDay = 1;}
      else{nextDay = japanDOM + 1;}
      if(nextDay < 10){nextDay = "0" + nextDay.toString();}
      let nextMonth = japanMonth;
      let nextYear = japanYear;
      if(nextMonth == 12 & japanDOM == days_in_month){nextMonth = 1;nextYear+=1;}
      if(nextMonth < 10){nextMonth = "0" + nextMonth.toString();}
      const japanNextDay = new Date(nextYear,nextMonth,nextDay);
      
      //if(limiter == false){
        //limiter = true;
        for(let i = 0; i < results.length; i++){setTodayList(results[i], results[i]["broadcast"], time, japanese_time, days_month, japanNextDay);}
      //}
      

      setcontentStatus(()=>{return false;})
      localStorage.setItem("version", versionNumber);
  }

  useEffect(()=>{
    //console.log("running this")
    let req2 = null;
    const SeasonString = `${Season.toLowerCase()} + "_" + ${Year.toString().toLowerCase()}`
    async function world(){
      //console.log(db)
    // Add the new friend!
      /*const id = await db.anime.add({
        name:"cammy",
        age:23,
        id:23
      });*/

      let animeSize = 0;
      let seasonSize = 0;

      //generate keys up to 10k
      let keys = [];
      for(let i = 1; i < 101; i++){
        keys.push(i)
      }

      let gateRequestAnime = false;
      let gateRequestSeason = false;

      await db.transaction("r", db.anime, db.season, async function(){
        //console.log("run transaction")
        const anime = await db.anime.where("id").above(0).count(async function(count){return count}).then(async(res)=>{
          animeSize = res;
          //console.log(res)
          if(res == 0){gateRequestSeason = true;}
          else{
            const results = await db.anime.where("id").above(0).toArray()
            setMasterList(async()=>{return results});
          }
        })

        const season = await db.season.where("id").above(0).count(async function(count){return count}).then(async(res)=>{
          seasonSize = res;
          if(res == 0){gateRequestSeason = true;}
          else{
            /*setSeasonalAnime(async()=>{
              finish();
              return [...await db.season.where("id").equals(1).toArray()];
            })*/
            //console.log("operate finish");
            finish();
            //setcontentStatus(()=>{return false})
          }
        })
        
      }).then((res)=>{
        //console.log("successful transaction")
      }).catch((res)=>{
        //console.log("failure")
      })

      const serverVersion = await client.get("/version", {
        headers:{
          "Content-Type":"application/json"
        }
      }).then((res)=>{
        return res.data;
      })
      
      const versionNumber = serverVersion["version"];
      const curVer = localStorage.getItem("version")

      //console.log(versionNumber)
      //console.log(curVer)
      let DOW = new Date().getDay();

      //console.log(gateRequestAnime)
      //console.log(gateRequestSeason)

      if(gateRequestAnime == true || gateRequestSeason == true || JSON.parse(curVer) != versionNumber){
        //console.log("running request")     
        try{
          req2 = await client.get(`/anime=info/season=${SeasonString}`,
          {
            headers:{"Content-Type":"application/json"}
          }).then((res)=>{
            return res.data;
          })

          //console.log(req2)
          const MainObject = req2["date_obj"];
          const seasonObject = req2["seasonInfo"];

          if(req2["date_obj"].length == 0){
            //console.log("zero date_obj for no reason")
          }

          await db.transaction("rw", db.anime, db.season, async function(){
            for(const key in MainObject){
              if(MainObject[key]["airing"] == true){
                MainObject[key]["airing"] = 1;
              }
              else if(MainObject[key]["airing"] == false){
                MainObject[key]["airing"] = 0;
              }
              await db.anime.put(MainObject[key], key)
            }

            for(const key in seasonObject){
              if(seasonObject[key]["airing"] == true){
                seasonObject[key]["airing"] = 1;
              }
              else if(seasonObject[key]["airing"] == false){
                seasonObject[key]["airing"] = 0;
              }
              await db.season.put(seasonObject[key], key)
              //console.log("successfully added");
            }
          }).then(async()=>{
            //console.log("Transaction completed")
            await finish(versionNumber);
          }).catch(function(erro){
            console.log(erro);
          })
        }catch(e){
          //console.log("error running request");
          localStorage.setItem("trigger", false)
          setcontentStatus(()=>{return true;})
          //reload(true);
          //return;
        }
      }/*else{
        await finish();
      }*/
    }
    world();
  }, [])

  useEffect(()=>{
    async function getCSRFIn(){
      /*if(localStorage.getItem("token") == null || localStorage.getItem("token") == ''){
        localStorage.setItem("token", "");
        console.log("token is empty right now so no session")
        //return;
      }*/
      //"https://infernovertigo.pythonanywhere.com/AB45743939443952/startup"
      /*const res = await fetch("https://infernovertigo.pythonanywhere.com/retrieve/csrf", 
      {"method":"GET",
        "credentials":"same-origin"})
      .then((res)=>{
        return res.json();
      })
      //setCSRF(res["csrfToken"]);*/

      //"https://infernovertigo.pythonanywhere.com/AB45743939443952/startup"
      
      let stuff = await client.get("api/setcsrf/");
      //console.log(stuff.data)
      let csrfCookie = stuff.data;

      const res1 = await fetch("https://infernovertigo.pythonanywhere.com/api/ret/gettoken", {
      method:"POST",
      body:JSON.stringify({
        username:localStorage.getItem("user"),
        password:localStorage.getItem("password"),
        salt:localStorage.getItem("salt")
      }),
      headers:{
        'Accept': 'application/json',
        "content-type":"application/json"
      }
      })
      let stuff2 = await res1.json();
      let token = stuff2["data"];

      if(token == null){
        /*console.log(token)
        console.log(csrfCookie)
        setLoggedIn(false);
        let top_anime = localStorage.getItem("top_anime")
        localStorage.clear(); // clean out the localStorage completely
        //reset all the values
        localStorage.setItem("user", "");
        localStorage.setItem("password", "");
        localStorage.setItem("salt", "");
        localStorage.setItem("logged_in", JSON.stringify(false));
        localStorage.setItem("top_anime", top_anime);
        return;*/
      }
      /*console.log(token)
      console.log(csrfCookie["cookie"])*/
      const res2 = await axios.get("https://infernovertigo.pythonanywhere.com/check/req",
      {
        headers: 
          { 
            'X-CSRFToken':csrfCookie["cookie"],
            'Authorization':` Token ${token}`,
            "Content-Type":"application/json",
            "Accept":"application/json"
          }
      }
      ).then((response)=>{
        return response.data;
      })
      /*const res3 = await fetch("https://infernovertigo.pythonanywhere.com/check/req", 
      {"method":"GET",
        "credentials":"same-origin",
        })
      .then((res)=>{
        return res.json();
      })*/
      //return;
      //console.log(res2);
      let version = localStorage.getItem("version");

      if(res2["user"]){
        //setLoggedIn(false);
        let trigger = JSON.parse(localStorage.getItem("trigger"));
        let dbVersion = JSON.parse(localStorage.getItem("dbVersion"))
        setLoggedIn(true);
        localStorage.setItem("user", res2["name"]);
        localStorage.setItem("logged_in", JSON.stringify(true));
        localStorage.setItem("password", res2["pass"]);
        localStorage.setItem("salt", res2["salt"]);
        localStorage.setItem("trigger", trigger)
        localStorage.setItem("dbVersion", dbVersion)
        try{
          setcontentStatus(()=>{return trigger})
        }catch(e){
          setcontentStatus(()=>{return false});
        }
        setUsername(localStorage.getItem("user"));
        //console.log(res2);
      }else{
        setUsername(localStorage.getItem(null));
        setLoggedIn(false);
        
        localStorage.setItem("logged_in", JSON.stringify(false));
        let top_anime = localStorage.getItem("top_anime")
        let trigger = JSON.parse(localStorage.getItem("trigger"))
        let dbVersion = JSON.parse(localStorage.getItem("dbVersion"))
        localStorage.clear(); // clean out the localStorage completely
        
        //reset all the values
        localStorage.setItem("user", "");
        localStorage.setItem("password", "");
        localStorage.setItem("salt", "");
        //localStorage.setItem("token", "");
        localStorage.setItem("logged_in", JSON.stringify(false));
        localStorage.setItem("top_anime", top_anime);
        localStorage.setItem("version", version);
        localStorage.setItem("trigger", trigger);
        localStorage.setItem("dbVersion", dbVersion)
      }
      //console.log(res2);

      //setCSRF(cookies.get("csrftoken"));
      //console.log(cookies.get("csrftoken"));
      
      //console.log(res);
    }
    getCSRFIn();
  }, [])

  useEffect(()=>{
    //Check login status
    if(JSON.parse(localStorage.getItem("logged_in")) == true){
      setLoggedIn(true);
    }else{
      setLoggedIn(false);
    }
  }, [])

  //fetch anime
  /*const fetchAnimes = async()=>{
    const res = await fetch("http://127.0.0.1:8000/anime/", {mode:'cors'});
    const data = await res.json();

    //console.log(data);
    return data;
  }*/

  /*//update status
  const fetchAnime = async(id)=>{
    const res = await fetch("http://localhost:5010/anime");
    const data = await res.json();

    console.log(data);
    return data;
  }*/

  /*const update = async(id, status1) =>{
      var index = 0;
  }*/

  //delete animeQueue
  /*const deleteAnime = async (id) =>{
    await fetch(`http://localhost:5010/anime/${id}`,{
      method:'DELETE'
    })

    setStatus(status.filter((obj)=>obj.id !== id));
  }*/

  /*useEffect(()=>{
    const getAnime = async()=>{
      const animeFromServer = await fetchAnimes();
      setStatus(animeFromServer);
      console.log(status);
    }
    getAnime();
  }, [])*/

  /*const search = (id) =>{
    let count = 0;
    let saw = false;
    status.map((obj)=>{
      if(obj.id === id){
        saw = true;
      }
      else if(count === Number(obj.length)-1){
        //console.log("not in")
        saw = false;
      }
      count++;
    })
    return saw;
  }*/

  let count = 0;
  const addState = async(id, status1, name="", img_url="", url="", episodes=0, avgScore=0.0, 
    type="", synopsis="", airing=false, start_date="", end_date="", members=0, rating="", japanese_name = "", english_name = "", date_added="", proper=null, broadcast, userRating=0, watched=0,
    watching=false) =>{
    const check = 0;

    /*const res = await fetch(`http://127.0.0.1:8000/anime/${id}/`, {mode:"cors"});
    const data = await res.json();*/
    //console.log(proper, 88)
    var temp = {...proper}
    temp.status = status1;
    temp.synopsis = synopsis;
    temp["watching"] = watching;
    temp["rating"] = userRating;
    temp["watched"] = watched;
    temp["broadcast"] = broadcast;
    temp["modified"] = true;
    temp["query_id"] = JSON.parse(localStorage.getItem("user_id"))
    //console.log(temp, 94)

    const data = localStorage.getItem(id)
    //if(data.length == 0){
    if(data === null){
      localStorage.setItem(id, JSON.stringify(temp));
      //console.log(localStorage)
      //console.log("added that item to the thingy");
      /*if(english_name.equals(" ")){
        english_name = null;
      }
      if(japanese_name.equals(" ")){
        japanese_name = null;
      }*/
      /*console.log("not found");
      console.log(english_name, 101)
      console.log(japanese_name, 101)
      console.log(date_added, 101)
      console.log(name, 101)

      const inside = await fetch(`http://127.0.0.1:8000/anime/`, {
        mode:"cors",
        method:'POST',
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({"id":Number(id), "status":status1, "name":name, 
        "userRating":Number(userRating), 
        "watched":Number(watched), "img_url":img_url,
        "url":url,
        "airing":Boolean(airing),
        "avgScore":Number(avgScore),
        "synopsis":synopsis,
        "type":type,
        "episodes":Number(episodes),
        "start_date":start_date,
        "end_date":end_date,
        "members":members,
      "rating":rating,
      "watching":Boolean(false),
      "japanese_name":null,
      "english_name":null,
      "date_added":null})
      })

      const data2 = inside.json();
      try{
        setStatus([...status, JSON.parse(data2)]);
      }catch (error){
        console.log("Error: " + error)
      }
      console.log("Data added to server and array")*/
    }
    else{
      localStorage.setItem(id, JSON.stringify(temp));
      //console.log(localStorage)
      /*console.log(english_name, 100);
      console.log("the data existed so update the junk");
      const inside2 = await fetch(`http://127.0.0.1:8000/anime/${id}/`, {
        mode:"cors",
        method:'PUT',
        headers:{
          'Content-type':'application/json'
        },
        body:JSON.stringify({'name':name, 'id':id, 'status':!status1, 
        "userRating":userRating, "watched":watched, "img_url":img_url,
        "url":url,
        "airing":airing,
        "avgScore":avgScore,
        "synopsis":synopsis,
        "type":type,
        "episodes":episodes,
        "start_date":start_date,
        "end_date":end_date,
        "members":members,
      "rating":rating,
      "watching":watching,
      "japanese_name":japanese_name,
      "english_name":english_name,
      "date_added":date_added})
      });
      const data3 = await inside2.json();*/
      //update(id);
    }
  }
  
  useEffect(()=>{
    setRedirect("home")
    //console.log(status, 99)
  }, [status])

  const aFunc = async() =>{
    const res1 = await fetch(`https://infernovertigo.pythonanywhere.com/anime/season/val=latest/limit=${results}`)
    .then((res)=>res.json())

    //console.log(res1)
    updateSeason([...res1]);
  }

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

  const checkLocalTop = async(obj, localS) =>{
    const maxCount = 10;
    let count = 0;
    for(let i =0; i < obj.length; i++){
      if(obj[i]["title"] == localS[i]["title"]){
        count++;
      }
      if(count == maxCount){
        break;
        //console.log("There are " + count.toString() + " matches");
      }
      else if(i == obj.length-1){
        //if count is not maxCount update list
        setTopAnime(()=>[...obj])
        localStorage.setItem("top_anime", JSON.stringify(obj))
      }
    }
  }

  /*const getTopAnime = async () =>{
    if(localStorage.getItem("top_anime") == null){
      const temp = await fetch("https://infernovertigo.pythonanywhere.com/anime/top_Anime/", {mode:"cors"})
      .then(res=>res.json());
      localStorage.setItem("top_anime", JSON.stringify(temp))
    }
    else{
      let top = JSON.parse(localStorage.getItem("top_anime"));
      setTopAnime(()=>[...top]);

      const temp = await fetch("https://infernovertigo.pythonanywhere.com/anime/top_Anime/", {mode:"cors"})
      .then(res=>res.json());
      //setTopAnime(()=>[...temp]);
      await checkLocalTop(temp, JSON.parse(localStorage.getItem("top_anime")));
    }
  }
  
  useEffect(()=>{
    getTopAnime();
  }, [])

  useEffect(()=>{
    aFunc();
  }, [topAnime])*/

  const handleSearch = e =>{
    e.preventDefault();

    anime(getAnime);
    //console.log(AnimeList);
  }

  const anime = async (SearchResult) =>{
    //`http://127.0.0.1:8000/anime/search/val=${SearchResult}/`
    //`https://api.jikan.moe/v3/search/anime?q=${SearchResult}&order_by=title&sort=asc&limit=10`
    //`http://127.0.0.1:8000/anime/search/val=${SearchResult}/` current stuff
    try{
    const temp = await fetch(`https://infernovertigo.pythonanywhere.com/search/${SearchResult}`, {mode:"cors"})
    .then(res=>res.json());

    //console.log(temp , "9"/*temp.results*/);
    setAnimeList([])
    setAnimeList(temp.main/*temp.results*/);
    //console.log(temp);
    //localStorage.clear()
    //localStorage.setItem("show2", "only show 3")
    //localStorage.setItem("3", ["hi", "how", "are", "you"])
    //console.log(localStorage, 0);
    }
    catch (error){
      setAnimeList([]);
    }
  }

  function hoursTomilli(hour, minute=0){
    if(minute == null)
      return hour*1440*60*1000
    else
      return hour*1440*60*1000 + (minute*60*1000)//this is the difference in milliseconds between show and current japan time
  }
  function splitTime(time){
    let hour = time.substring(0,2);
    let minutes = time.substring(2, 4);

    return [hour, minutes];
  }
  function broadcastToTime(broadcast){
    let splitter = broadcast;
    let hour = splitter.substring(0,2);
    let minutes = splitter.substring(2, 4);

    if(hour[0] == "0" & hour[1] != 0){
      hour = hour[1];
    }
    else if(hour[0] == "0" & hour[1] == 0){
      hour = 0;
    }

    if(minutes[0] == "0"){
      minutes = minutes[1]
    }
    else{
      minutes = minutes
    }

    return [Number(hour), Number(minutes), broadcast];
  }

  function daysFrom(currentDay, showsDay){
    let showDayNum = null;
    if(showsDay == "Sundays")
      showDayNum = 0
    else if(showsDay == "Mondays")
      showDayNum = 1
    else if(showsDay == "Tuesdays")
      showDayNum = 2
    else if(showsDay == "Wednesdays")
      showDayNum = 3
    else if(showsDay == "Thursdays")
      showDayNum = 4    
    else if(showsDay == "Fridays")
      showDayNum = 5    
    else if(showsDay == "Saturdays")
      showDayNum = 6
    
    console.log("current day (est): ", currentDay);
    console.log("show day (jst): ", showDayNum);
    return showDayNum-currentDay;

    /*let showsDate = null;
    if(japanMonth.length > 1){
      showsDate = new Date(Date.parse(`${japanYear}-${japanMonth+1}-${japanDOM}T${showHour}:${showMinutes}:00.000+09:00`))
    }else{
      showsDate = new Date(Date.parse(`${japanYear}-0${japanMonth+1}-${japanDOM}T${showHour}:${showMinutes}:00.000+09:00`))
    }*/
  }

  function setTodayList(object, broadcast, time, japanese_time, days_month, japanNextDay){
    //console.log(`Japan Standard Time: ${japanese_time.getHours()}:${japanese_time.getMinutes()}:${japanese_time.getSeconds()}`)
    //console.log(`Japanese Standard Day: ${japanese_time.getDate()}, Day of Week: ${japanese_time.getDay()}`)
    let antiDupe = [];
    const japanDOW = japanese_time.getDay();
    const japanDOM = japanese_time.getDate();
    const japanMonth = japanese_time.getMonth();
    const japanYear = japanese_time.getFullYear();

    const DOW = time.getDay();
    
    const nextDay_DOW = japanNextDay.getDay();
    const nextDay_DOM = japanNextDay.getDate();
    const nextDay_Year = japanNextDay.getFullYear();
    const nextDay_Month = japanNextDay.getMonth();

    //console.log(nextDay_DOM);

    let animeDay = null;

    if(broadcast == null || broadcast == "" || broadcast == undefined){
      return
    }else{
      animeDay = broadcast.split(" ");
    }

    //console.log(animeDay[2]);
  
    /*const year = time.getFullYear();

    console.log("Epoch GMT Time Milliseconds: ", time.getTime())
    console.log("Offset of Local to GMT (Minutes): " ,offsetFromGMT);
    console.log("Year: ", year)
    console.log("GMT Day(0 is sunday): ", DOW)

    console.log("Hour", time.getHours())
    console.log("Minute", time.getMinutes())
    console.log("Second", time.getSeconds())*/
    
    //user local time settings
    /*const localTime = new Date()
    const localDay = localTime.getDate();
    const localYear = localTime.getFullYear();

    console.log("Local Hour", localTime.getHours())
    console.log("Local Minute: ", localTime.getMinutes());
    console.log("Local Second", localTime.getSeconds());*/
    //const customTime = time.setUTCSeconds();
    //console.log(time.getDa)
  let DayWord = null;
  let afterDayWord = null

   if(DOW == 0){
    DayWord = "Sundays"
    afterDayWord = "Mondays"
   }
   else if(DOW == 1){
    DayWord = "Mondays"
    afterDayWord = "Tuesdays"
   }
   else if(DOW == 2){
    DayWord = "Tuesdays"
    afterDayWord = "Wednesdays"
   }
   else if(DOW == 3){
    DayWord = "Wednesdays"
    afterDayWord = "Thursdays"
   }
   else if(DOW == 4){
    DayWord = "Thursdays"
    afterDayWord = "Fridays"
   }    
   else if(DOW == 5){
    DayWord = "Fridays" 
    afterDayWord = "Saturday"
   }   
   else if(DOW == 6){
    DayWord = "Saturdays"
    afterDayWord = "Sundays"
   }
  
  let jDayWord = null;
  let beforejDayWord = null;
  let afterjDayWord = null;

  if(japanDOW == 0){
    jDayWord = "Sundays";
    beforejDayWord = "Saturdays";
    afterjDayWord = "Mondays";
  }
  else if(japanDOW == 1){
    jDayWord = "Mondays";
    beforejDayWord = "Sundays";
    afterjDayWord = "Tuesdays";
  }
  else if(japanDOW == 2){
    jDayWord = "Tuesdays";
    beforejDayWord = "Mondays";
    afterjDayWord = "Wednesdays";
  }
  else if(japanDOW == 3){
    jDayWord = "Wednesdays";
    beforejDayWord = "Tuesdays";
    afterjDayWord = "Thursdays";
  }
  else if(japanDOW == 4){
    jDayWord = "Thursdays";
    beforejDayWord = "Wednesdays";
    afterjDayWord = "Fridays";
  }    
  else if(japanDOW == 5){
    jDayWord = "Fridays";
    beforejDayWord = "Thursdays";
    afterjDayWord = "Saturdays";
  }    
  else if(japanDOW == 6){
    jDayWord = "Saturdays";
    beforejDayWord = "Fridays";
    afterjDayWord = "Sundays";
  }

  if(animeDay[0] == afterjDayWord){
    const broadcastStuff = animeDay[2].replace(":", "");
    const showHour = splitTime(broadcastStuff)[0]
    const showMinutes = splitTime(broadcastStuff)[1]

    let showsDate = null;

    if(nextDay_Month.length > 1){
      if(japanDOM.toString().length > 1){
        showsDate = new Date(Date.parse(`${nextDay_Year}-${nextDay_Month+1}-${japanDOM+1}T${showHour}:${showMinutes}:00.000+09:00`))
      }else{
        showsDate = new Date(Date.parse(`${nextDay_Year}-${nextDay_Month+1}-0${japanDOM+1}T${showHour}:${showMinutes}:00.000+09:00`))
      }
    }else{
      if(japanDOM.toString().length > 1){
        showsDate = new Date(Date.parse(`${nextDay_Year}-0${japanMonth+1}-${japanDOM+1}T${showHour}:${showMinutes}:00.000+09:00`))
      }else{
        showsDate = new Date(Date.parse(`${nextDay_Year}-0${japanMonth+1}-0${japanDOM+1}T${showHour}:${showMinutes}:00.000+09:00`))
      }
    }
    
    const showDOW_InEST = showsDate.getDay();
    let estDayWord = null;
    if(showDOW_InEST == 0)
      estDayWord = "Sundays"
    else if(showDOW_InEST == 1)
      estDayWord = "Mondays"
    else if(showDOW_InEST == 2)
      estDayWord = "Tuesdays"
    else if(showDOW_InEST == 3)
      estDayWord = "Wednesdays"
    else if(showDOW_InEST == 4)
      estDayWord = "Thursdays"    
    else if(showDOW_InEST == 5)
      estDayWord = "Fridays"    
    else if(showDOW_InEST == 6)
      estDayWord = "Saturdays"

    //console.log(`${object["title"]} airs: `, showsDate)
    //console.log(object)
    if(object["img_url"] == ""){
      return;
    }

    if(estDayWord == DayWord){
      //console.log("this ran")
      //console.log(object.title)
      //return;
      setTodays((obj)=>{
        return [...obj, object]
      })
    }
  }
  if(animeDay[0] == beforejDayWord){
    const broadcastStuff = animeDay[2].replace(":", "");
    const showHour = splitTime(broadcastStuff)[0]
    const showMinutes = splitTime(broadcastStuff)[1]

    let showsDate = null;
    if(japanDOM > 1){
      if(japanMonth.length > 1){
        if(japanDOM.toString().length > 1){
          showsDate = new Date(Date.parse(`${japanYear}-${japanMonth+1}-${japanDOM-1}T${showHour}:${showMinutes}:00.000+09:00`))
        }else{
          showsDate = new Date(Date.parse(`${japanYear}-${japanMonth+1}-0${japanDOM-1}T${showHour}:${showMinutes}:00.000+09:00`))
        }
      }else{
        if(japanDOM.toString().length > 1){
          showsDate = new Date(Date.parse(`${japanYear}-0${japanMonth+1}-${japanDOM-1}T${showHour}:${showMinutes}:00.000+09:00`))
        }else{
          showsDate = new Date(Date.parse(`${japanYear}-0${japanMonth+1}-0${japanDOM-1}T${showHour}:${showMinutes}:00.000+09:00`))
        }
      }
    }else{
      if(japanMonth.length > 1){
        if(japanDOM.toString().length > 1){
          showsDate = new Date(Date.parse(`${japanYear}-${japanMonth+1}-${japanDOM}T${showHour}:${showMinutes}:00.000+09:00`))
        }else{
          showsDate = new Date(Date.parse(`${japanYear}-${japanMonth+1}-0${japanDOM}T${showHour}:${showMinutes}:00.000+09:00`))
        }
      }else{
        if(japanDOM.toString().length > 1){
          showsDate = new Date(Date.parse(`${japanYear}-${japanMonth+1}-${japanDOM}T${showHour}:${showMinutes}:00.000+09:00`))
        }else{
          showsDate = new Date(Date.parse(`${japanYear}-0${japanMonth+1}-0${japanDOM}T${showHour}:${showMinutes}:00.000+09:00`))
        }
        
      }
    }
    const showDOW_InEST = showsDate.getDay();
    //console.log(`timeObj: ${showsDate}, Title: `, object.title);
  
    let estDayWord = null;
    if(showDOW_InEST == 0)
      estDayWord = "Sundays"
    else if(showDOW_InEST == 1)
      estDayWord = "Mondays"
    else if(showDOW_InEST == 2)
      estDayWord = "Tuesdays"
    else if(showDOW_InEST == 3)
      estDayWord = "Wednesdays"
    else if(showDOW_InEST == 4)
      estDayWord = "Thursdays"    
    else if(showDOW_InEST == 5)
      estDayWord = "Fridays"    
    else if(showDOW_InEST == 6)
      estDayWord = "Saturdays"

    //console.log(`${object["title"]} airs: `, showsDate)
    //console.log(object)
    if(object["img_url"] == ""){
      return;
    }

    if(estDayWord == DayWord){
      setTodays((obj)=>{
        //console.log(obj)
        antiDupe.push(object);
        return [...obj, object]
      })
    }
  }

  if(animeDay[0] == jDayWord){
    const broadcastStuff = animeDay[2].replace(":", "");
    const showHour = splitTime(broadcastStuff)[0]
    const showMinutes = splitTime(broadcastStuff)[1]
    //const showHour = broadcastToTime(broadcastStuff)[0]
    //const showMinutes = broadcastToTime(broadcastStuff)[1]

    let showsDate = null;
    if(japanMonth.length > 1){
      if(japanDOM.toString().length > 1){
        showsDate = new Date(Date.parse(`${japanYear}-${japanMonth+1}-${japanDOM}T${showHour}:${showMinutes}:00.000+09:00`))
      }else{
        showsDate = new Date(Date.parse(`${japanYear}-${japanMonth+1}-0${japanDOM}T${showHour}:${showMinutes}:00.000+09:00`))
      }
      
    }else{
      if(japanDOM.toString().length > 1){
        showsDate = new Date(Date.parse(`${japanYear}-0${japanMonth+1}-${japanDOM}T${showHour}:${showMinutes}:00.000+09:00`))
      }else{
        showsDate = new Date(Date.parse(`${japanYear}-0${japanMonth+1}-0${japanDOM}T${showHour}:${showMinutes}:00.000+09:00`))
      }
    }

    const showDOW_InEST = showsDate.getDay();
    //console.log(jDayWord);
    //console.log(`timeObj: ${showsDate}, Title: `, object.title);
    //if(showDOW_InEST > DOW){
      //console.log(showsDate)
      //console.log(`Title: ${object.title}, Japan Day to U.S.: ${showDOW_InEST}, Current Day to U.S.: `, DOW)
    //}
    //console.log(`Title: ${object.title}, Japan Day to U.S.: ${showDOW_InEST}, Current Day to U.S.: `, DOW)
    //return;

    //console.log(showDOW_InEST);
    let estDayWord = null;
    if(showDOW_InEST == 0)
      estDayWord = "Sundays"
    else if(showDOW_InEST == 1)
      estDayWord = "Mondays"
    else if(showDOW_InEST == 2)
      estDayWord = "Tuesdays"
    else if(showDOW_InEST == 3)
      estDayWord = "Wednesdays"
    else if(showDOW_InEST == 4)
      estDayWord = "Thursdays"    
    else if(showDOW_InEST == 5)
      estDayWord = "Fridays"    
    else if(showDOW_InEST == 6)
      estDayWord = "Saturdays"

    //console.log(`${object["title"]} airs: `, showsDate)
    //console.log(object)
    if(object["img_url"] == ""){
      return;
    }

    if(estDayWord == DayWord){
      setTodays((obj)=>{
        antiDupe.push(object);
        return [...obj, object]
      })
    }

    let check = false;
    for(let a = 0; a < antiDupe.length; a++){
      for(let b = a; b < antiDupe.length; b++){
        if(antiDupe[a]["title"] == antiDupe[b]["title"]){
          check = true;
        }
      }
    }
  }
 }

//<Header/>
//<Nav/>
//<MainContent animeList={AnimeList} setSearch={setGetAnime} search={getAnime} handleSearch={handleSearch} topAnime={topAnime}/>
//
//
  return (
    <div>
      <ContextHead.Provider value={masterAllAnime}>
      <Router basename={process.env.PUBLIC_URL}>
        <Header loggedIn={isLoggedIn} setLoggedIn={setLoggedIn} username={username}/>
        <Nav showSearch={true} searchList={null} setRedirect={setRedirect} masterAllAnime={masterAllAnime} setMasterList={setMasterList}/>
        <Routes>
            <Route path="/redirect" element={<Redirecting/>}/>
            <Route path="/queue" element={<Queue animeList={AnimeList} status={status} setInQueue={setInQueue} loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/anime" element={<Animedetail loggedIn={isLoggedIn} setloggedIn={setLoggedIn} addState={addState}/>}/>
            <Route path="/" element={
              <>
                <ErrorBoundary status={status} addState={addState} 
                animeList={AnimeList} setSearch={setGetAnime} 
                search={getAnime} handleSearch={handleSearch} topAnime={topAnime}>
                <MainContent showContent={contentStatus} status={status} addState={addState} seasonAnime={seasonalAnime}
                animeList={AnimeList} setSearch={setGetAnime} todayAnime={todaysList}
                search={getAnime} handleSearch={handleSearch} topAnime={topAnime}
                />
                </ErrorBoundary>
              </>
              }
            />
            <Route path="/leaderboard/:id" element={<Leaderboard redirectTo={redirectTo}/>}/>
            <Route path="/seasonal" element={<Seasonal status={status} updateSeason={updateSeason} seasonAnime={seasonAnime} addState={addState}  loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/about" element={<About  loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/stats" element={<Stats  loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/mal_queue" element={<CopyQueue  loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/mal_queue_in" state={inQueue} element={<ExportQueue inQueue={inQueue}  loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/login" element={<ProtectRoute><LoginPage settoken={setToken} loggedIn={isLoggedIn} setUsername={setUsername} setloggedIn={setLoggedIn} attempts={attempts} setAttempts={setAttempts}/></ProtectRoute>}/>
            <Route path="/register" element={<ProtectRoute><RegisterPage settoken={setToken} loggedIn={isLoggedIn} setloggedIn={setLoggedIn} setUsername={setUsername}/></ProtectRoute>}/>
            <Route path="/recovery" element={<PasswordRecover></PasswordRecover>}/>
        </Routes>
      </Router>
      </ContextHead.Provider>
    </div>
  );
}
export default App;

// 48:43 https://www.youtube.com/watch?v=w7ejDZ8SWv8&ab_channel=TraversyMedia