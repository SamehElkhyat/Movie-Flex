import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SignUp from "./SignUp/SignUp";
import About from "./About/About";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import Start from "./Start/Start";
import Layout from "./Layout/Layout";
import SignIn from "./SignIn/SignIn";
import MovieSearch from "./components/MovieSearch";
import TopRatedMovies from "./components/TopRatedMovies";
import UpcomingMovies from "./components/UpcomingMovies";
import TVShows from "./components/TVShows";
import Details from "./Details/Details";
import reportWebVitals from './reportWebVitals';

let routers = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "", element: <Start /> },
      { path: "NavBar", element: <NavBar /> },
      { path: "Movies", element: <About /> },
      { path: "TopRated", element: <TopRatedMovies /> },
      { path: "Upcoming", element: <UpcomingMovies /> },
      { path: "TVShows", element: <TVShows /> },
      { path: "Search", element: <MovieSearch /> },
      { path: "SignUp", element: <SignUp /> },
      { path: "Home", element: <About /> },
      { path: "Footer", element: <Footer /> },
      { path: "Regestier", element: <SignIn /> },
      { path: "details/:id", element: <Details /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AnimatePresence>
    <RouterProvider router={routers}></RouterProvider>
  </AnimatePresence>
);

reportWebVitals();
