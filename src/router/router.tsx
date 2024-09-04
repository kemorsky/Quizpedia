import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../components/LoginPage"
import App from "../App"
import SignUp from "../components/SignUp"
import NameQuiz from "../components/NameQuiz";
import GetQuizes from "../components/GetQuizes";
import SelectedQuiz from "../components/SelectedQuiz";

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
    path: '/allquizzes',
    element: <GetQuizes/>
},
 {
    path: '/selectedquiz',
    element: <SelectedQuiz/>
 },
{
    path: "/main",
    element: <App/>
}
])

export default router