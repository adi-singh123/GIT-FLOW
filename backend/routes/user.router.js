const express = require("express");

const userController = require("../controllers/userController");

const userRouter= express.Router()

userRouter.get("/allUsers",userController.getAllUsers)
userRouter.post("/signup",userController.signup)
userRouter.post("/login",userController.login)
userRouter.get("/userProfile",userController.userProfile)
userRouter.put("/updateProfile",userController.updateUserProfile)
userRouter.delete("/deleteProfile",userController.deleteUserProfile)