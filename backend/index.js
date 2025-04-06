 const express = require("express");
 const dotenv =  require("dotenv");
 const cors = require("cors");
 const mongoose = require("mongoose");
 const bodyParser = require("body-parser");
 const http =require("http");
 const path = require("path");
 const {Server} = require("socket.io")
 
 
 
 const yargs  = require("yargs");
 const {hideBin} =require("yargs/helpers");

 const initRepo = require("./controllers/init.js")
 const addRepo  = require("./controllers/add.js")
 const commitRepo  = require("./controllers/commit.js")
 const pushRepo = require("./controllers/push.js")
 const pullRepo = require("./controllers/pull.js")
 const revertRepo  = require("./controllers/revert.js");
const { Socket } = require("dgram");

dotenv.config();



 yargs(hideBin(process.argv))
 .command("start","server is start",{}, serverStart)
 .command("init","Initialise new repo",{}, initRepo)
 .command("add <file>", "Add a new file to the repo", (yargs) => {
  yargs.positional("file", {
    describe: "File to add to the staging area",
    type: "string",
  });
}, (argv)=>{
  addRepo(argv.file)
})
.command("commit <message>","commit your file",(yargs) => {
  yargs.positional("message", {
    describe: "commit message",
    type: "string",
  })
}, (argv)=>{
  commitRepo(argv.message);
})
.command("push","push your file",{}, pushRepo)
.command("pull","pull your file",{}, pullRepo)
.command("revert <commitID>","revert to a specific commit",(yargs) => {
  yargs.positional("commitID", {
    describe: "commit ID to revert to",
    type: "string",
  })
}, revertRepo)
.demandCommand(1,"you need at least one command").help().argv;

function serverStart(){
  const app = express();
  const port = process.env.PORT || 3000
  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGODB_URI;

  mongoose.connect(mongoURI).then(()=>{
    console.log("mongodb is connected!")
    }).catch((err)=>{
      console.log("not connected",err)
    })

  app.use(cors({origin:"*"}));

  app.get("/",(req,res)=>{
    res.send("good");
  })

  let user = "test";

  const httpServer = http.createServer(app);
  const io = new Server(httpServer,{
    cors:{
      origin:"*",
      methods:["get","post"],
    }
  })

  io.on("connection",(Socket)=>{
    Socket.on("joinRoom",(userID)=>{
      user = userID;
      console.log("=====");
      console.log(user);
      console.log("=====");
      console.log(userID);
    });
  });

  const db =mongoose.connection;

  db.once("open",async()=>{
    console.log("curd operation");
  })

  httpServer.listen(port,()=>{
    console.log(`server is start on port ${port}`);
  })
}
