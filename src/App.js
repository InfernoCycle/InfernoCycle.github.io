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
import LoginPage from "./AccountsComp/Pages/LoginPage";
import ProtectRoute from "./ProcessingFrontEnd/protectRoute";
import Animedetail from "./AccountsComp/Anime_detail";
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
  const [token, setToken] = useState("");
  const [inQueue, setInQueue] = useState([]);
  const [user_id, setId] = useState(null);
  const [attempts, setAttempts] = useState(8);
  var db = null;
  const [version, setVersion] = useState(1);

  useEffect(()=>{
    const req = window.indexedDB.open("innerData", 1);
    
    //let db = null;
    req.onerror = (e) =>{
      console.log("Something failed");
    }

    req.onsuccess = (e) =>{
      async function call(){
        
        const req2 = await client.get("/anime=info", {
          headers:{
            "Content-Type":"application/json"
          }
        }).then((res)=>{
          return res.data
        })

        db = e.target.result;

        const obj = req2;
        const MainObject = req2["date_obj"]

        const curVer = localStorage.getItem("version")

        const transact = db.transaction("anime", "readwrite");
        const objectStore = transact.objectStore("anime");
        
        if(curVer == null || JSON.parse(curVer) != obj["version"]){
          localStorage.setItem("version", obj["version"]);

          objectStore.openCursor().onsuccess = (e2) =>{
            const cursor = e2.target.result;
            if(cursor){
              objectStore.put(MainObject[cursor.key]);
              delete MainObject[cursor.key];
              //console.log(`key: ${cursor.key}, title ${cursor.value.title}`)
              cursor.continue();
            }else{
              if(MainObject.length > 0){
                for(const key in MainObject){
                  objectStore.add(MainObject[key]);
                }
              }
              //console.log("end of entries");
            }
          }
          //console.log(db);
        }
      }
      call();
    }

    req.onupgradeneeded = (e) =>{
      async function call(){
        db = e.target.result;
        db.createObjectStore("anime", {keyPath: "id"});
        //const transact = db.transaction("anime", "readwrite");
        const anime = e.target.transaction;

        anime.oncomplete = async () =>{
          const req2 = await client.get("/anime=info", {
            headers:{
              "Content-Type":"application/json"
            }
          }).then((res)=>{
            return res.data
          })
          
          const obj = req2;
          const MainObject = obj["date_obj"]
          const curVer = localStorage.getItem("version")
          if(curVer == null || JSON.parse(curVer) < obj["version"]){
            localStorage.setItem("version", obj["version"]);
          }

          const transact = db.transaction("anime", "readwrite");
          const ob = transact.objectStore("anime");
          for(const key in MainObject){
            ob.add(MainObject[key]);
          }
          //console.log(JSON.parse(localStorage.getItem("version")));
        }

        console.log(await req);
        //load up database with new anime info;
      }
      call();
      console.log("upgrade was called");
    }
  },[])

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
      if(res2["user"]){
        setLoggedIn(true);
        /*localStorage.setItem("user", res2["name"]);
        localStorage.setItem("logged_in", JSON.stringify(true));
        localStorage.setItem("password", res2["password"]);
        localStorage.setItem("salt", res2["salt"]);*/
        setUsername(localStorage.getItem("user"));
        //console.log(res2);
      }else{
        setUsername(localStorage.getItem(null));
        setLoggedIn(false);
        
        localStorage.setItem("logged_in", JSON.stringify(false));
        let top_anime = localStorage.getItem("top_anime")
        localStorage.clear(); // clean out the localStorage completely

        //reset all the values
        localStorage.setItem("user", "");
        localStorage.setItem("password", "");
        localStorage.setItem("salt", "");
        //localStorage.setItem("token", "");
        localStorage.setItem("logged_in", JSON.stringify(false));
        localStorage.setItem("top_anime", top_anime);
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
            <Route path="/anime" element={<Animedetail loggedIn={isLoggedIn} setloggedIn={setLoggedIn}/>}/>
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
            <Route path="/login" element={<ProtectRoute><LoginPage settoken={setToken} loggedIn={isLoggedIn} setUsername={setUsername} setloggedIn={setLoggedIn} attempts={attempts} setAttempts={setAttempts}/></ProtectRoute>}/>
            <Route path="/register" element={<ProtectRoute><RegisterPage settoken={setToken} loggedIn={isLoggedIn} setloggedIn={setLoggedIn} setUsername={setUsername}/></ProtectRoute>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;

// 48:43 https://www.youtube.com/watch?v=w7ejDZ8SWv8&ab_channel=TraversyMedia
