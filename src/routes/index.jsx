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
    element: <RootLayout />,
    children: [
      { index: true, element: <PrivateRoute><Dashboard /></PrivateRoute> },
      { path: "dashboard", element: <PrivateRoute><Dashboard /></PrivateRoute> },
      { path: "surveys/create", element: <PrivateRoute><CreateSurvey /></PrivateRoute> },
      { path: "surveys/:surveyId/edit", element: <PrivateRoute><EditSurvey /></PrivateRoute> },
      { path: "surveys/:surveyId/results", element: <PrivateRoute><SurveyResults /></PrivateRoute> },
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
