import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function LoginPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSubmit = async (event: React.FormEvent) => {
        event?.preventDefault()
        const userData = {username, password}
        const API_URL = "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login"
        try {
            console.log(userData);
            const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error ("Zjebalo sie cos")
        }
        const data = await response.json();
        console.log(data);
        sessionStorage.setItem('token', data.token);
        navigate('/namequiz')
        
        } catch (error) {
            console.log(error)
        }

    }

    const handleClick = () => {
        navigate('/signup')
    }

    return (
        <section>
            Login:
            <form onSubmit={handleSubmit}>
                Användarenamn:
                <label htmlFor="username">
                    <input type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value) }} />
                </label>
                Lösenord:
                <label htmlFor="password">
                    <input type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }} />
                </label>
                <button type="submit">Logga in</button>
            </form>
            Inte medlem?
            <button onClick={handleClick}>Registrera dig</button>
        </section> 
    )
}