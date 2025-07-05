import "./App.css";
import React from "react";
import NavBar from "./NavBar/NavBar";
import { Outlet } from "react-router-dom";

function App() {

  return (
    <>
  
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;
