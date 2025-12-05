import { createBrowserRouter } from "react-router-dom"
import RootLayout from "@/layouts/RootLayout"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import CreateSurvey from "@/pages/CreateSurvey"
import EditSurvey from "@/pages/EditSurvey"
import SurveyResults from "@/pages/SurveyResults"
import PublicSurvey from "@/pages/PublicSurvey"
import PrivateRoute from "@/components/PrivateRoute"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute><RootLayout /></PrivateRoute>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "surveys/create", element: <CreateSurvey />},
      { path: "surveys/:surveyId/edit", element: <EditSurvey /> },
      { path: "surveys/:surveyId/results", element: <SurveyResults />},
    ],
  },
  {
    path: "/login",
    children: [
      { index: true, element: <Login /> },
    ],
  },
  {
    // public survey page - no auth required
    path: "/survey/:token",
    element: <PublicSurvey />,
  },
])
