import React from "react";
import { createBrowserRouter, RouterProvider, Route, Link } from "react-router-dom";
import PublicPage from "./components/public-page";
import App from "./components/app";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicPage />,
  },
  {
    path: "/console",
    element: <App />,
  },
  {
    path: "/console/topic/:topic_id",
    element: <App />,
  },
]);

function ChitRouter() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default ChitRouter;
