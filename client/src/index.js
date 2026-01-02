import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("INDEX.JS LOADED");

const rootEl = document.getElementById("root");
console.log("ROOT ELEMENT:", rootEl);

const root = ReactDOM.createRoot(rootEl);
root.render(<App />);
