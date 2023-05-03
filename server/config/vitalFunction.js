const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const SERVER_URL = process.env.SERVER_URL.toString() || "http://localhost:3500";
const brcypt = require('bcrypt');

//function support node-fetch
const result = async (e,url, method,log = true, statusCode = false)=>{
    let jsonReturn;
    let status;
    new_url = SERVER_URL + url;
    const data =  await fetch(new_url,{
        method: method,
        body: JSON.stringify(e),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      status = res.status;  
      return res.json();
    }).then(json => {jsonReturn = json}).catch(err=>console.log(err));
    if(log){
      console.log(jsonReturn);
    }
    if(statusCode){
      return [jsonReturn, status];
    }else{
      return jsonReturn;
    }
    
};

//made to serve MR. HUNG purpose
function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

module.exports={
    result,
    toTitleCase
};