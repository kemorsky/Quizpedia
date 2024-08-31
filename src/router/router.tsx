import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../components/LoginPage"
import App from "../App"
import SignUp from "../components/SignUp"

const router = createBrowserRouter ([
    {
    path: "/",
    element: <LoginPage/>
},
{
    path: "/signup",
    element: <SignUp/>
},
{
    path: "/main",
    element: <App/>
}
])

export default router