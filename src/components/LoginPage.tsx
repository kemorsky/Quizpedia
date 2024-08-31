import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function LoginPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSubmit = async (event: React.FormEvent) => {
        event?.preventDefault()
        const userData = {username, password}
        const API_URL = "vdfvfdv"
        try {
            console.log(userData);
            const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        console.log(response);
        if (!response.ok) {
            throw new Error ("Zjebalo sie cos")
        }
        const data = await response.json()
        console.log(data)
        sessionStorage.setItem('token', data.token);
        
        } catch (error) {
            console.log(error)
        }
        navigate('/')
    }

    const handleClick = () => {
        navigate('/signup')
    }

    return (
        <section>
            Login:
            <form onSubmit={handleSubmit} action="">
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