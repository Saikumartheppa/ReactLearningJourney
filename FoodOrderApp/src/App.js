import ReactDOM from "react-dom/client";
import NavBar from "./components/NavBar";
import Body from "./components/Body";
// import About from "./components/About";
import ErrorPage from "./components/ErrorPage";
import Contact from "./components/Contact";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import RestaurantMenu from "./components/RestaurantMenu";
import { lazy, Suspense } from "react";
import { useState, useEffect } from "react";
import UserContext from "./utils/UserContext";
// Chunking
// Code Splitting
// Dynamic Bundling
// lazy Loading
// on demand loading
// dynamix imoprt
const About = lazy(() => import("./components/About"));
const AppLayOut = () => {
  console.log("App is Running");
  const[userName , setUserName] = useState(null);
  useEffect(() => {
    const data = {
      name : "John Doe"
    }
    setUserName(data.name);
  }, [])
  return (
   <UserContext.Provider value={{loggedInUser: userName}}>
    <div className="appContainer">
      <UserContext.Provider value={{loggedInUser: "Akshay Kumar"}}>
      <NavBar />
      </UserContext.Provider>
      <Outlet />
    </div>
    </UserContext.Provider>
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
        element: (
          <Suspense fallback={<h1>Loading...</h1>}>
            <About />
          </Suspense>
        ),
        path: "/about",
      },
      {
        element: <Contact />,
        path: "/contact",
      },
      {
        element: <RestaurantMenu />,
        path: "/restaurants/:resId",
      },
    ],
    errorElement: <ErrorPage />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
