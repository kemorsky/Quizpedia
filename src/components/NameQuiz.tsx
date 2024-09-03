import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function NameQuiz() {
    const [name, setName] = useState<string>('')
    const navigate = useNavigate()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const nameData = {name};
        const token = sessionStorage.getItem('token');
        console.log('Token:', token); // Debugging line
        const API_URL = "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz"
        if (!token) {
            console.log('Token is not valid')
            navigate('/')
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(nameData)
            })

        const data = await response.json();
        console.log('Server response:', data); // More detailed output
    
        if (!response.ok) {
            console.log('Något gick fel :(', data.message); // Improved error logging
        } else {
            console.log('name sent', data);
            navigate('/main');
        }
        
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }
    
    const handleClick = () => {
        navigate('/allquizes')
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text"
                    value={name}
                    onChange= {(e) => {setName(e.target.value)}} />
                </label>
                <button type='submit'>Spara</button>
                <label>
                    Or
                    <button onClick={handleClick}>Show all quizes</button>
                </label>
            </form>
        </div>
    )
}