//https://myanimelist.net/animelist/Zupay_The_King

//const axios = require("axios");
//const cheerio = require("cheerio");
//var urls = [];
/*axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: ""
})

function convert_to_embed(value){
  //https://www.youtube.com/embed/
  let transform = value.replace("/watch", "/embed/");
  return transform;
}

async function call(sValue, isOpening=true){
  let urls = [];
  if(isOpening){
    sValue = sValue + " opening";
  }else{
    sValue = sValue + " ending";
  }

  const html = await client.get(`https://www.google.com/search?q=${sValue}&tbm=vid`,
  {headers: {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods':'GET'
  }})
  .then((res1)=>{
    return res1.data;
  }).catch(console.error);

  const $ = load(html);
  const div = $("a[href*='https://www.youtube.com']");
  const reMatch = new RegExp("https://www.youtube.com/watch[?%a-zA-Z0-9_-]+&");
  let format = null;

  div.each((idx, element)=>{
    let value = $(element).attr("href")
    let match = reMatch.exec(value);
    if(match === null){
      let temp = 0;
    }else{
      format = match[0].replace("%3Fv%3D","").replace("&", "");
      if(idx > 0 && format != urls[idx-1]){
        urls.push(convert_to_embed(format));
      }  
    }
  })
  return isOpening;
  //return urls
  //console.log(div.attr("data-ved"));
  //console.log(`https://www.google.com/search?q=${sValue}&tbm=vid`);
}*/