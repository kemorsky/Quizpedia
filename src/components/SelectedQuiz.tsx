
import { useState } from "react"

interface Quiz {
    quizId: string,
    userId: string,
    username: string
}

export default function SelectedQuiz() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const renderQuizes = async (event: React.FormEvent) => {
        event.preventDefault()
        const token = sessionStorage.getItem('token');
        console.log('Token:', token); // Debugging line
        const API_URL = `https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${userId}/${quizId}`;
        if (!token) {
            console.log('Token is not valid')
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

        const data = await response.json();
        console.log('Server response:', data); // More detailed output
    
        if (!response.ok) {
            console.log('Något gick fel :(', data.message); // Improved error logging
        } else {
            console.log('name sent', data);
            setQuizzes(data.quizzes)
        }
        
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    return (

    )
}