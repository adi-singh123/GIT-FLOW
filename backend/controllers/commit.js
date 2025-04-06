const fs = require("fs").promises;
const path = require("path");
const {v4:uuidv4} = require("uuid");


async function commitRepo(message){
const repoPath = path.resolve(process.cwd(),"git");
const stagingPath = path.join(repoPath,"staging");
const commitPath = path.join(repoPath,"commit");
try{
  const commitID = uuidv4();
  const commitDir = path.join(commitPath,commitID);
  await fs.mkdir(commitDir,{recursive:true});
  const files = await fs.readdir(stagingPath);
  for(const file of files){
    await fs.copyFile(path.join(stagingPath,file),path.join(commitDir,file));
  }

  await fs.writeFile(path.join(commitDir,"commit.json"),JSON.stringify({message,date: new Date().toISOString()}));

  console.log(`commit ${commitID} created with message ${message}`);
}catch(err){
  console.error("error commit file",err)
}
}

module.exports = commitRepo;