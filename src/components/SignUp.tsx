import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function SignUp() {
    const navigate = useNavigate()
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const userData = {username, password};
        const API_URL = "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup"
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
        if (!response.ok) {
            console.log('Något gick fel :(')
        } 
        
        const data = await response.json();
        console.log('signup successful', data);
        sessionStorage.setItem('token', data.token);
        navigate('/namequiz')
        
        } catch (error) {
            console.error(error);
            
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text"
                    value={username}
                    onChange={(e) => {setUsername(e.target.value)}} />
                </label>
                <label>
                    <input type="password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}} />
                </label>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}