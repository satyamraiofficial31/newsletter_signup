const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();
app.use(express.static("public")); // static folder which push all the local files
app.use(bodyParser.urlencoded({extended: true}));
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
})
app.post("/",function(req,res){
  const fname=req.body.fname;
  const lname=req.body.lname;
  const email=req.body.email;
  const data={
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname
        }
      }
    ]
  };
  const jsonData=JSON.stringify(data);
  const url ="https://us8.api.mailchimp.com/3.0/lists/1d1650fe6f";
  const options = {
    method: "POST",
    auth: "satyrai:0ca48ffe5ff38126f7a153ed730fdead-us8"
  }
  const request=https.request(url, options, function(response){
    if(response.statusCode === 200)
    {
        res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){

      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});
app.post("/failure",function(req,res){
  res.redirect("/");
})
app.listen(process.env.PORT || 3000,function(){ //adding the line instead of 3000
  //because heroku may not like working with port 3000
  console.log("server started at port 3000");
})

//api key
//0ca48ffe5ff38126f7a153ed730fdead-us8
//list id
// 1d1650fe6f
