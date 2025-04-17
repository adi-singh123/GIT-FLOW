import React, { useEffect } from "react";
 import {useNavigate,useRoutes} from "react-router-dom";

 //Page List 

 import Dashboard from "./components/dashboard/Dashboard";
import  Profile  from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

// Auth Context

import {useAuth} from "./AuthContext";

const ProjectRouter = ()=>{
  const {currentUser , SetCurrentUser} = useAuth();

  const navigate = useNavigate();

  useEffect(()=>{
    const userIdFromStorage = localStorage.getItem("userId");

    if(userIdFromStorage && !currentUser){
      SetCurrentUser(userIdFromStorage)
    }

    if(!userIdFromStorage && !["/auth","/signup"].includes(window.location.pathname)){
      navigate("/auth")
    }

    if(userIdFromStorage && window.location.pathname=="/auth" ){
      navigate("/");
    }
  },[currentUser,navigate,SetCurrentUser]);


  let element = useRoutes([
    {
      path:"/",
      element:<Dashboard/>
    },
    {
      path:"/auth",
      element:<Login/>
    },
    {
      path:"/signup",
      element:<Signup/>
    },
    {
      path:"/profile",
      element:<Profile/>
    },

  ])
  return element;

}


export default ProjectRouter;
