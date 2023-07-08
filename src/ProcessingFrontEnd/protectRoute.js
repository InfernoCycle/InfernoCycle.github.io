import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';

function ProtectRoute(props) {
  if(JSON.parse(localStorage.getItem("logged_in"))){
    return <Navigate to="/" replace />
  }
  else{
    return props.children;
  }
}

export default ProtectRoute;