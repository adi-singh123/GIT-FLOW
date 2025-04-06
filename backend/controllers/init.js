const fs = require("fs").promises;
const path = require("path");

async function initRepo(){
  const repoPath = path.resolve(process.cwd(),"git");
  const commitPath = path.join(repoPath,"commit");

  try{
    await fs.mkdir(repoPath,{recursive:true});
    await fs.mkdir(commitPath,{recursive:true});
    await fs.writeFile(path.join(repoPath,"config.json"),JSON.stringify({bucket:process.env.S3_BUCKET}));

    console.log("success")
  }catch(err){
    console.error("error in initition file",err)
  }

};

module.exports = initRepo; 
