import React from "react";
import ReactDOM from "react-dom/client";

// Working Behind when we create element using react core method
// React.creatElement => React Element (JS Object) => HTMLElement(render) 

// JSX transpiled before it reaches JS engine - 
// Working Behind when we create element using react core method
// JSX => React.creatElement => React Element (JS Object) => HTMLElement(render) 

const jsxHeading = <h1 id="heading">Hello World</h1>;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(jsxHeading);