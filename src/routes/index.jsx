import { createBrowserRouter } from "react-router-dom"
import RootLayout from "@/layouts/RootLayout"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
     // { path: "login", element: <Login /> },
      { path: "dashboard", element: <Dashboard /> },
    ],
  },
   {
    path: "/login",
    children: [
      { index:true , element: <Login /> },

    ],
  },
])
