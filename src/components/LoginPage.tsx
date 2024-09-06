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
            throw new Error ("Det blev paj")
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
        <section className='flex flex-col wrap items-center p-4 justify-center border rounded bg-gray-800'>
            <h2 className="text-3xl">Logga in:</h2>
            <form onSubmit={handleSubmit} className="flex flex-col p-4 m-2 items-center  ">
                <h3 className="mb-2">Användarenamn:</h3>
                <label htmlFor="username">
                    <input type="text"
                    className="bg-gray-600 rounded mb-2"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value) }} />
                </label>
                <h3 className="mb-2">Lösenord:</h3>
                <label htmlFor="password">
                    <input type="password"
                    className="bg-gray-600 rounded mb-2"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }} />
                </label>
                <button className="mt-2 bg-gray-900 rounded border-gray-300" type="submit">Logga in</button>
            </form>
            <h3 className="mb-2">Inte medlem?</h3>
            <button className="mt-2 bg-gray-900 rounded border-gray-300" onClick={handleClick}>Registrera dig</button>
        </section> 
    )
}