import { useState, useEffect } from "react"; 
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./comp/Header";
import MainContent from "./comp/MainContent";
import Nav from "./comp/Nav";
import Queue from "./comp/Queue";
import ErrorBoundary from "./comp/ErrorBoundary";
import Seasonal from "./comp/Seasonal";
import About from "./comp/About";
import Stats from "./comp/Stats";
import CopyQueue from "./comp/CopyQueue";
import ExportQueue from "./comp/ExportQueue";
import RegisterPage from "./AccountsComp/Pages/RegisterPage";
import LoginPage from "./AccountsComp/Pages/LoginPage"
import Cookies from "universal-cookie";
import axios from "axios";

const cookies = new Cookies()

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "https://infernovertigo.pythonanywhere.com"
})

function App() {
  //https://api.jikan.moe/v3/top/type/page/subtype

  if(localStorage.getItem("First_Log") == null){
    localStorage.setItem("First_Log", JSON.stringify(true));
  }

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
  const [csrfValue, setCSRF] = useState(null);
  const [inQueue, setInQueue] = useState([]);

  useEffect(()=>{
    async function getCSRFIn(){
      if(localStorage.getItem("token") == null || localStorage.getItem("token") == ''){
        localStorage.setItem("token", "");
        console.log("token is empty right now so no session")
        //return;
      }
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
      console.log(stuff.data)
      let csrfCookie = stuff.data;

      const res2 = await client.get(
        "check/req",
        {data:{
          password:localStorage.getItem("password"),
          user: localStorage.getItem("user"),
          salt:localStorage.getItem("salt")
        }},
        { headers: 
          { 'X-CSRFToken': csrfCookie,
          'Authorization':` Token ${localStorage.getItem("token")}`
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
      if(res2["user"]){
        setLoggedIn(true);
        setUsername(localStorage.getItem("user"));
      }else{
        setUsername(localStorage.getItem(null));
        setLoggedIn(false);
      }
      console.log(res2);

      //setCSRF(cookies.get("csrftoken"));
      //console.log(cookies.get("csrftoken"));
      
      //console.log(res);
    }
    getCSRFIn();
  }, [])

  useEffect(()=>{
    //Check login status
    //console.log(csrfValue);
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
    temp.synopsis = "";
    temp["watching"] = watching;
    temp["rating"] = userRating;
    temp["watched"] = watched;
    temp["broadcast"] = broadcast;
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

  const getTopAnime = async () =>{
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
  }, [topAnime])

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


//<Header/>
//<Nav/>
//<MainContent animeList={AnimeList} setSearch={setGetAnime} search={getAnime} handleSearch={handleSearch} topAnime={topAnime}/>
//
//
  return (
    <div>
      <Router>
        <Routes>
            <Route path="/queue" element={<Queue animeList={AnimeList} status={status} setInQueue={setInQueue} loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/" element={
              <>
                <ErrorBoundary status={status} addState={addState} 
                animeList={AnimeList} setSearch={setGetAnime} 
                search={getAnime} handleSearch={handleSearch} topAnime={topAnime}>
                <Header loggedIn={isLoggedIn} setLoggedIn={setLoggedIn} username={username}/>
                <MainContent status={status} addState={addState} 
                animeList={AnimeList} setSearch={setGetAnime} 
                search={getAnime} handleSearch={handleSearch} topAnime={topAnime}
                />
                </ErrorBoundary>
              </>
              }
            />
            <Route path="/seasonal" element={<Seasonal status={status} updateSeason={updateSeason} seasonAnime={seasonAnime} addState={addState}  loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/about" element={<About  loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/stats" element={<Stats  loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/mal_queue" element={<CopyQueue  loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/mal_queue_in" state={inQueue} element={<ExportQueue inQueue={inQueue}  loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/login" element={<LoginPage token={csrfValue} loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
            <Route path="/register" element={<RegisterPage token={csrfValue} loggedIn={isLoggedIn} setloggedIn={setLoggedIn} setUsername={setUsername}/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;

// 48:43 https://www.youtube.com/watch?v=w7ejDZ8SWv8&ab_channel=TraversyMedia
