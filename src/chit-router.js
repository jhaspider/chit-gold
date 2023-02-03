import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./components/app";
import NewPage from "./components/new-page";

const router = createBrowserRouter([
  {
    path: "/console",
    element: <App />,
  },
  {
    path: "/console/topic/:topic_id",
    element: <App />,
  },
  {
    path: "/",
    element: <NewPage />,
  },
]);

function ChitRouter() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default ChitRouter;
