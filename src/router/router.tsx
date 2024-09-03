import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../components/LoginPage"
import App from "../App"
import SignUp from "../components/SignUp"
import NameQuiz from "../components/NameQuiz";
import GetQuizes from "../components/GetQuizes";

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
    path: '/namequiz',
    element: <NameQuiz/>
},
{
    path: '/allquizes',
    element: <GetQuizes/>
},
{
    path: "/main",
    element: <App/>
}
])

export default router