const QueueToFile = (queue, userId = 0, username = "") =>{
  try{
    const firstLine = '<?xml version="1.0" encoding="UTF-8" ?>\n';

  const firstListTag = "<myanimelist>\n";

  const userInfo = `\n
    <myinfo>
      <user_id>${userId}</user_id>
      <user_name>${username}</user_name>
      <user_export_type>1</user_export_type>
      <user_total_anime>1</user_total_anime>
      <user_total_watching>1</user_total_watching>
      <user_total_completed>0</user_total_completed>
      <user_total_onhold>0</user_total_onhold>
      <user_total_dropped>0</user_total_dropped>
      <user_total_plantowatch>0</user_total_plantowatch>
    </myinfo>\n
  `;

  const lastListTag = "</myanimelist>";

  var fullest = firstLine + firstListTag + userInfo;
  for(var i = 0; i < queue.length; i++){
    var data = "";

    var watching = "";

    if(Number((queue[i].episodes) === Number(queue[i].watched))){
      watching = "Completed"
    }

    else if((queue[i].watching === true)){
      watching = "Watching"
    }

    else if((queue[i].watched > 0) && (queue[i].watched < queue[i].episodes) && (queue[i].watching != true)){
      watching = "On-Hold"
    }

    else{
      watching = "Plan to Watch"
    }
    
    /*if((queue[i].watching === false && queue[i].episodes === queue[i].watched) || (queue[i].episodes === queue[i].watched && queue[i].watched > 0)){
      watching = "Completed"
    }*/

    data+=`
    <anime>
      <series_animedb_id>${queue[i].id}</series_animedb_id>
      <series_title><![CDATA[${queue[i].title}]]></series_title>
      <series_type>${queue[i].type}</series_type>
      <series_episodes>${queue[i].episodes}</series_episodes>
      <my_id>0</my_id>
      <my_watched_episodes>${queue[i].watched}</my_watched_episodes>
      <my_start_date>0000-00-00</my_start_date>
      <my_finish_date>0000-00-00</my_finish_date>
      <my_rated></my_rated>
      <my_score>${queue[i].rating}</my_score>
      <my_storage></my_storage>
      <my_storage_value>0.00</my_storage_value>
      <my_status>${watching}</my_status>
      <my_comments><![CDATA[]]></my_comments>
      <my_times_watched>0</my_times_watched>
      <my_rewatch_value></my_rewatch_value>
      <my_priority>LOW</my_priority>
      <my_tags><![CDATA[]]></my_tags>
      <my_rewatching>0</my_rewatching>
      <my_rewatching_ep>0</my_rewatching_ep>
      <my_discuss>1</my_discuss>
      <my_sns>default</my_sns>
      <update_on_import>1</update_on_import>
	</anime>\n
    `;
    fullest += data;
  }
  fullest += lastListTag
  //console.log(fullest)
  return fullest;
  }catch{
    console.log("error")
  }
}
export default QueueToFile;