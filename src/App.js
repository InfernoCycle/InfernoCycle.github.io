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
import View from "./User_Links/user_views/view";
import Cookies from "universal-cookie";
import axios from "axios";
import {Dexie} from 'dexie';
import moment from 'moment';
import months from 'moment-timezone';
import {useLiveQuery} from 'dexie-react-hooks'

//DexieB Docs: https://dexie.org/docs/Collection/Collection

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

  const [anime_by_day, setAnime] = useState({today:[], monday:[], tuesday:[], wednesday:[], thursday:[], friday:[], saturday:[], sunday:[]});

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

  const [isqueueLoaded, setQueueLoaded] = useState(false);
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
      const seasonsMe = await db.season.where("airing").above(0).toArray();
      setSeasonalAnime((obj)=>{
        return [...seasonsMe]
      })

      //console.log(results)
      //console.log(seasonsMe);

      /*const time = new Date();
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
      const japanNextDay = new Date(nextYear,nextMonth,nextDay);*/

      if(limiter == false){
        //limiter = true;
        for(let i = 0; i < results.length; i++){
          setTodayList(results[i], results[i]["broadcast"], i, results[i]["start_date"]);
        }
      }
      

      setcontentStatus(()=>{return false;})
      //console.log("Finished the finish task");
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

        //if count is 0 then run gateRequest
        const season = await db.season.where("id").above(0).count(async function(count){return count}).then(async(res)=>{
          seasonSize = res;
          if(res == 0){gateRequestSeason = true;}
          else{
            /*setSeasonalAnime(async()=>{
              finish();
              return [...await db.season.where("id").equals(1).toArray()];
            })*/
            //console.log("operate finish");
            //finish();
            return;
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
        setcontentStatus(()=>{return true;})
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

          let arr = [];
          let count = 0;
          await db.transaction("rw", db.anime, db.season, async function(){
            //console.log("modifying airing to all 0's");
            await db.season.where("airing").above(0).modify({airing: 0});
            
            for(const key in MainObject){
              if(MainObject[key]["airing"] == true){
                MainObject[key]["airing"] = 1;
              }
              else if(MainObject[key]["airing"] == false){
                MainObject[key]["airing"] = 0;
              }

              arr.push(MainObject[key]);
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
            //console.log(seasonObject);
            setMasterList(async()=>{return arr});
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
      }else{
        await finish();
      }
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
          //console.log(trigger)
          //setcontentStatus(()=>{return trigger})
        }catch(e){
          //UNCOMMENT setcontentStatus(()=>{return false});
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

  function single_double(day, isMonth=false){
    if(!isMonth){
      if(day.toString().length == 1){
        return "0" + day.toString()
      }
    }else{
      if(day.toString().length == 1){
        return "0" + day.toString()
      }
    }
    return day;
  }

  function double_single(day){
    if(day.toString().length > 1){
      if(day.toString().substring(0,1) == '0'){
        return day.toString().substring(1,2);
      }else{
        return day;
      }
    }return day;
  }

  function shorten_dayName(longname, regular=false){
    let shorthand = "";

    if(!regular){
      if(longname == "Sundays"){
        shorthand = "Sun";
      }
      if(longname == "Mondays"){
        shorthand = "Mon";
      }
      if(longname == "Tuesdays"){
        shorthand = "Tue";
      }
      if(longname == "Wednesdays"){
        shorthand = "Wed";
      }
      if(longname == "Thursdays"){
        shorthand = "Thu";
      }
      if(longname == "Fridays"){
        shorthand = "Fri";
      }
      if(longname == "Saturdays"){
        shorthand = "Sat";
      }
    }else{
      if(longname == "Sunday"){
        shorthand = "Sun";
      }
      if(longname == "Monday"){
        shorthand = "Mon";
      }
      if(longname == "Tuesday"){
        shorthand = "Tue";
      }
      if(longname == "Wednesday"){
        shorthand = "Wed";
      }
      if(longname == "Thursday"){
        shorthand = "Thu";
      }
      if(longname == "Friday"){
        shorthand = "Fri";
      }
      if(longname == "Saturday"){
        shorthand = "Sat";
      }
    }
    return shorthand;
  }

  function organize_date(date_str, show_min_hr, show_day, jap_day, jap_object, broadcast, show_object, user_date){
    //this is the user's current day date string.
    let split_date = date_str.split(" ");
    let day_short = split_date[0];
    let year = split_date[3];
    let month_short = split_date[1];
    let day_of_month = split_date[2];

    let user_time_ms = user_date.getTime();

    let day_distance = 0; //this will go up based on date largness
    
    //this will be used to get difference between days.
    let show_day_index = -1;
    let jap_day_index = -1;

    let days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    //console.log(show_day, jap_day)
    for(let i = 0; i < days.length; i++){
      if(days[i] == show_day){
        show_day_index=i;
      }if(days[i] == jap_day){
        jap_day_index=i;
      }
    }

    var japan = moment(jap_object)//.tz("Asia/Tokyo"); //day in tokyo, japan
    var japan_clone = moment(japan);

    let milliseconds_in_day = (86400*1000); //seconds in a day times 1000 milliesonds
    
    day_distance = jap_day_index - show_day_index;
    //console.log(day_distance);
    let amt_days_back_fwd = "0";

    let raw_distance = 0;
    
    if(day_distance < 0){
      //console.log(`${show_object.title} has yet to air this week`);
      //amt_days_back_fwd = "+" + Number(day_distance).toString().substring(1,2);
      raw_distance = Number(day_distance.toString().substring(1,2));
      japan_clone.add(raw_distance, 'days').add(Number(double_single(show_min_hr.show_hr)), 'hours').add(Number(double_single(show_min_hr.show_min)), 'minutes');
    }else if(day_distance == 0){
      //console.log(`${show_object.title} airs today`);
      japan_clone.add(Number(double_single(show_min_hr.show_hr)), 'hours').add(Number(double_single(show_min_hr.show_min)), 'minutes');
    }else if(day_distance > 0){  
      //amt_days_back_fwd = "-" + Number(day_distance).toString().substring(1,2);
      //console.log(`${show_object.title} has already aired`);
      raw_distance = day_distance;
      japan_clone.subtract(raw_distance, 'days').add(show_min_hr.show_hr, 'hours').add(show_min_hr.show_min, 'minutes');
    }

    var date_to_userTime = new Date(Date.parse(`${japan_clone.year()}-${single_double(japan_clone.month()+1)}-${single_double(japan_clone.date())}T${single_double(japan_clone.hour())}:${single_double(japan_clone.minute())}:00.000+09:00`));
    
    let difference = 0;

    show_day_index = -1;
    jap_day_index = -1;

    //console.log(show_day, jap_day)
    for(let i = 0; i < 7; i++){
      if(days[i] == date_to_userTime.getDay()){
        show_day_index=i;
      }if(days[i] == jap_day){
        jap_day_index=i;
      }
    }

    day_distance = user_date.getDay() - date_to_userTime.getDay();
    difference = milliseconds_in_day * day_distance;

    let last = null;
    if(difference < 0){
      last = moment(new Date(user_time_ms - difference));
    }else if(difference > 0){
      last = moment(new Date(user_time_ms - difference));
    }else{
      last = moment(new Date());
    }
    
    last.set("hours", date_to_userTime.getHours()).set("minutes", date_to_userTime.getMinutes()).set("seconds", 0);
    /*console.log(last)
    console.log(date_to_userTime)
    console.log(difference)
    console.log(user_time_ms)
    console.log(user_time_ms + difference)*/
    //console.log(date_to_userTime, user_date)
    //console.log(day_distance);
    //console.log(date_to_userTime)
    //console.log(date_to_userTime, `${japan_clone.year()}-${single_double(japan_clone.month()+1)}-${single_double(japan_clone.date())}T${single_double(japan_clone.hour())}:${single_double(japan_clone.minute())}:00.000+09:00`);
    /*console.log(broadcast)
    console.log(date_to_userTime)
    console.log(date_to_userTime.getDate());
    console.log(raw_distance)
    console.log(day_distance)*/

    return [date_to_userTime, last.toDate()];

    /*let sign = amt_days_back_fwd.substring(0,1);
    let diff = day_distance;

    if(sign == "+"){
      raw_distance = raw_distance * milliseconds_in_day;
    }else if(sign == "-"){
      raw_distance = raw_distance * milliseconds_in_day * -1;
    }else{
      raw_distance = milliseconds_in_day;
    }
    
    var japan = moment().tz("Asia/Tokyo");
    var japan_clone = moment(japan);
    var day = new Date(japan.year(), japan.month()-1, japan.date());
    var stuff = moment(day);
    console.log(stuff)
    console.log(`To Now: ${japan.toNow()}`);
    console.log(`Formatted:  ${japan.format()}`);
    console.log(`Japan UTC: ${japan.utc()}`);
    console.log(`Japan Year: ${japan.year()}`);
    console.log(`Japan Day: ${japan.day()}`);
    console.log(`Japan Month: ${japan.month()}`);
    console.log(` ${japan}`);

    /*console.log(raw_distance);
    console.log(milliseconds_in_day);
    console.log(jap_object);

    if(raw_distance < milliseconds_in_day){
      jap_object.setTime(jap_object.getTime()+raw_distance)
    }if(raw_distance > milliseconds_in_day){
      jap_object.setTime(jap_object.getTime()-raw_distance)
    }else{
      
    }*/
    //console.log(jap_object);
    //console.log(raw_distance);
    //console.log(show_day_index, jap_day_index);
  }

  function setTodayList(object, broadcast, index, first_episode){
    //console.log(`Japan Standard Time: ${japanese_time.getHours()}:${japanese_time.getMinutes()}:${japanese_time.getSeconds()}`)
    //console.log(`Japanese Standard Day: ${japanese_time.getDate()}, Day of Week: ${japanese_time.getDay()}`)
    //console.log()
    if(broadcast != null && broadcast != '' && object.img_url != ''){
      //time stuff
      let timeSplit = broadcast.split(" at ");
      let day = timeSplit[0];
      let date_Hour = timeSplit[1].substring(0,2);
      let date_Min = timeSplit[1].substring(2,4);
      let shorten_day = shorten_dayName(day);
      let short_date = "";

      //date stuff
      let dateSplit = first_episode.split(",");
      let month_date = dateSplit[0].split(" ");
      let month = month_date[0];
      let first_day = month_date[1];
      let year = dateSplit[1].trim();

      //get user's current day by localtime
      let user_date = new Date();

      //get japanese day
      let old_date = new Date();
      
      let dateFormat = new Intl.DateTimeFormat("en-US",{
        timeZone:"Asia/Tokyo",
        hour:"numeric",
        hour12:false,
        minute:"numeric",
        weekday:"long",
        year:"numeric",
        month:"2-digit",
        day:"2-digit"
      }).format(old_date);

      let full_jap_date = dateFormat.split(",");
      let longDayName = full_jap_date[0];
      let short_japDayName = shorten_dayName(longDayName, true);

      //date section
      let date_only = full_jap_date[1].split("/");
      let japMonth = date_only[0].trim();
      let japYear = date_only[2];
      let japDay = date_only[1];

      //time section
      let time_only = full_jap_date[2].split(":")
      let japtime_hour = time_only[0];
      let japtime_minute = time_only[1];

      //get a day before and after for the anime as well
      let jap_object = [date_only, japMonth, japYear, japtime_hour, japtime_minute]
      let outter_obj = new Date(japYear, japMonth-1, japDay,0,0,0);
      //console.log(outter_obj);
      let final_match = organize_date(outter_obj.toDateString(), {show_hr:date_Hour, show_min:date_Min}, shorten_day, short_japDayName, outter_obj, broadcast, object, old_date);
      let matcher = final_match[0];
      
      object["user_date"] = matcher;
      object["time_difference"] = final_match[1];
      //filter only for shows that come out in same day it is right now in japan
      //console.log(matcher.getDay(), user_date.getDay())
      if(matcher.getDay() == user_date.getDay()){
        setTodays((obj)=>{
          obj.push(object);
          return obj;
        })

        setAnime((obj)=>{
          obj.today.push(object);
          return obj;
        })
      }

      setAnime((obj)=>{
        if(matcher.getDay() == 0){
          obj.sunday.push(object);
          return obj;
        }
        else if(matcher.getDay() == 1){
          obj.monday.push(object);
          return obj;
        }
        else if(matcher.getDay() == 2){
          obj.tuesday.push(object);
          return obj;
        }
        else if(matcher.getDay() == 3){
          obj.wednesday.push(object);
          return obj;
        }
        else if(matcher.getDay() == 4){
          obj.thursday.push(object);
          return obj;
        }
        else if(matcher.getDay() == 5){
          obj.friday.push(object);
          return obj;
        }
        else if(matcher.getDay() == 6){
          obj.saturday.push(object);
          return obj;
        }
      })
      
      /*if(day.substring(0, day.length-1) == longDayName){
        //console.log(object.title)
        //console.log(`${japYear}-${single_double(japMonth)}-${single_double(japDay)}T${date_Hour}:${date_Min}:00`)
        let inner_obj = new Date(`${japYear}-${single_double(japMonth)}-${single_double(japDay)}T${date_Hour}:${date_Min}:00.000Z`);
        
        if(old_date.getDay() == inner_obj.getDay()){
          setTodays((obj)=>{
            obj.push(object);
            return obj;
          })
        }
      }else{
        let inner_obj = new Date(`${japYear}-${single_double(japMonth)}-${single_double(japDay)}T${date_Hour}:${date_Min}:00.000-09:00`);
        //console.log(inner_obj)
      }*/ 
    }
 }

//<Header/>
//<Nav/>
//<MainContent animeList={AnimeList} setSearch={setGetAnime} search={getAnime} handleSearch={handleSearch} topAnime={topAnime}/>
//
//
  return (
    <div>
      <ContextHead.Provider value={{"masterList":masterAllAnime, "db":db, "queueLoaded":isqueueLoaded, "setQueueLoaded":setQueueLoaded}}>
      <Router basename={process.env.PUBLIC_URL}>
        <Header loggedIn={isLoggedIn} setLoggedIn={setLoggedIn} username={username}/>
        <Nav showSearch={true} searchList={null} setRedirect={setRedirect} masterAllAnime={masterAllAnime} setMasterList={setMasterList}/>
        <Routes>
            <Route path="/redirect" element={<Redirecting/>}/>
            <Route path="/queue" element={<Queue animeList={AnimeList} setInQueue={setInQueue}/>}/>
            <Route path="/anime" element={<Animedetail loggedIn={isLoggedIn} setloggedIn={setLoggedIn} addState={addState}/>}/>
            <Route path="/user/:username/" element={<View url={window.location.href}/>} />
            <Route path="/" element={
              <>
                <ErrorBoundary status={status} addState={addState} 
                animeList={AnimeList} setSearch={setGetAnime} 
                search={getAnime} handleSearch={handleSearch} topAnime={topAnime}>
                <MainContent showContent={contentStatus} status={status} addState={addState} seasonAnime={seasonalAnime}
                animeList={AnimeList} setSearch={setGetAnime} todayAnime={todaysList}
                search={getAnime} handleSearch={handleSearch} topAnime={topAnime}
                anime_by_day={anime_by_day}/>
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