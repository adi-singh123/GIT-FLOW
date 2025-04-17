const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const {MongoClient} = require("mongodb");
const dotenv = require("dotenv");
const { use } = require("../routes/main.router");
var ObjectId = require("mongodb").ObjectId;
dotenv.config();

const url = process.env.MONGODB_URI;




let client;

async function connectClient(){
  if(!client){
    client = new MongoClient(url,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
    });
  }
  await client.connect();
}


async function getAllUsers(req, res) {
  try {
    await connectClient();
    const db = client.db("gitflow");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
}

async  function signup(req,res){
  const {username,password,email} = req.body;
  try{
    await connectClient();
    const db = client.db("gitflow")
    const userCollection = db.collection("users")

    const user = await userCollection.findOne({username})
    if(user){
      return res.status(400).json({message:"user is already is present"})
    }

    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);


    const newUser = {
      username,
      password:hashedPassword,
      email,
      repositories:[],
      followedUsers:[],
      starRepos:[]
    }

    const result = await userCollection.insertOne(newUser);

    const token = jwt.sign({id:result.insertId},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
    res.json(token)
  }catch(err){
    console.error("error during sign up",err.message);
    res.status(500).send("server error")
  }
  
}

async function login(req,res){
  const {email,password} =req.body;
  try{
    await connectClient();
    const db = client.db("gitflow")
    const userCollection = db.collection("users")

    const user = await userCollection.findOne({email})
    if(!user){
      return res.status(400).json({message:"invalid"})
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({message:"invalid"})
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
    res.json({token,userId:use._id});
    
  }catch(err){
    console.error("error during login up",err.message)
    res.status(500).send("server is error");
  }

}





async function getUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    await connectClient();
    const db = client.db("gitflow");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(currentID),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(user);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("gitflow");
    const usersCollection = db.collection("users");

    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(currentID),
      },
      { $set: updateFields },
      { returnDocument: "after" }
    );
    if (!result.value) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(result.value);
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function deleteUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    await connectClient();
    const db = client.db("gitflow");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currentID),
    });

    if (result.deleteCount == 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};