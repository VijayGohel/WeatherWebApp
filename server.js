const express = require("express");
const https = require("https");
const bodyparser = require("body-parser");

const app = express();

app.use(bodyparser.urlencoded({extended:true}));

app.get("/", (req,res)=>{

    res.sendFile(__dirname+"/index.html");      
})

app.post("/", (req,res)=>{


    const city=req.body.cityName;
    const api="9ad92fe0aa71d0aa442d8327623b2ecb";
    const units=req.body.units;
    const url= "https://api.openweathermap.org/data/2.5/weather?appid="+api+"&q="+city+"&units="+units;

    https.get( url, (response)=>{
        response.on('data', (d) => {
            const ResponseData = JSON.parse(d);
            
            if(ResponseData.cod=="200"){
                
                const weatherTemp = ResponseData.main.temp;   
                const weatherDesc = ResponseData.weather[0].description;

                const iconUrl = "http://openweathermap.org/img/wn/"+ ResponseData.weather[0].icon +"@2x.png";

                var unitName ; 
                units=="metric"? unitName="degrees celcius":(units=="imperial"?unitName="degrees fahrenheit":unitName="kelvin");

                res.write("<p>Weather is currently "+weatherDesc +"</p>");
                res.write("<h1>Temprature in "+city+" is "+ weatherTemp+" "+unitName +"</h1>");   
                res.write("<img src="+iconUrl+">");
                res.send();
            }
            else{
                res.write(ResponseData.message);
                res.write(". Please try again");
                res.send();
            }
        });

    
    })
})



app.listen(3000, ()=> console.log("Server started on port : 3000"));