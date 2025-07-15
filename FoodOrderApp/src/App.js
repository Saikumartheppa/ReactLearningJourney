import React from "react";
import ReactDOM from "react-dom/client";
import NavBar from "./components/NavBar";
import Body from "./components/Body";
import About from "./components/About";
import ErrorPage from "./components/ErrorPage";
import Contact from "./components/Contact";
import { createBrowserRouter, RouterProvider , Outlet } from "react-router-dom";
import RestaurantMenu from "./components/RestaurantMenu";

const AppLayOut = () => {
  console.log("App is Running");
  return (
    <div className="appContainer">
      <NavBar />
      <Outlet />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    element: <AppLayOut />,
    path: "/",
    children: [
      {
        element: <Body />,
        path: "/",
      },
      {
        element: <About />,
        path: "/about",
      },
      {
        element: <Contact />,
        path: "/contact",
      },
       {
        element: <RestaurantMenu />,
        path: "/restaurants/:resId",
      }
    ],
    errorElement: <ErrorPage />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
