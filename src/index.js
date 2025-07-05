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
import reportWebVitals from './reportWebVitals';

let routers = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "NavBar", element: <NavBar /> },

      { path: "Movies", element: <About /> },

      { path: "SignUp", element: <SignUp /> },

      { path: "Home", element: <About /> },

      { path: "Movies", element: <Start /> },

      { path: "Footer", element: <Footer /> },

      { path: "Regestier", element: <SignIn /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={routers}></RouterProvider>
);

reportWebVitals();
