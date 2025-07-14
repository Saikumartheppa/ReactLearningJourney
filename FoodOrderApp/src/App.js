
import React from "react";
import ReactDOM from "react-dom/client";
import NavBar from "./components/NavBar";
import Body from "./components/Body";
import About from "./components/About";
import ErrorPage from "./components/ErrorPage";
import Contact from "./components/Contact";
import {createBrowserRouter, RouterProvider } from "react-router-dom";


const AppLayOut = () => {
  console.log("App is Running");
  return ( 
    <div className="appContainer">
      <NavBar />
      <Body />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    element:<AppLayOut/>,
    path:"/",
    errorElement:<ErrorPage />
  },
  {
    element:<About />,
    path:"/about",
  },
  {
    element:<Contact />,
    path:"/contact",
  }
])
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
