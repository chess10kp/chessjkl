import React from "react";
import "./Container.css";
import Sidebar from "../ui/Sidebar";

const Container = (props) => {
  return (
    <div className="container">
      {props.children}
      <Sidebar></Sidebar>
    </div>
  );
};

export default Container;
