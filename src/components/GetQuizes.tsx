import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Quiz {
    questions: {
        question: string;
        answer: string;
        location: {
            longitude: string;
            latitude: string;
        };
    }[];
    userId: string;
    quizId: string;
    username: string;
}

export default function GetQuizes() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const navigate = useNavigate();
    useEffect(() => {
        const renderQuizes = async () => {
            const token = sessionStorage.getItem('token');
            console.log('Token:', token); // Debugging line
            const API_URL = "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz"
            if (!token) {
                console.log('Token is not valid')
                return;
            }
    
            try {
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
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
        renderQuizes()
    }, []);

    const handleQuizClick = (userId: string, quizId: string) => {
        navigate('/selectedQuiz', { state: { userId, quizId } });
    };
    

    return (
        <main className='flex justify-center items-center flex-col'>
                {quizzes.map((quiz) => (
                    <article className="border rounded w-104 bg-gray-900 flex flex-col w-3/4 mb-4 p-5 items-start">
                        <h2>Quiz ID: {quiz.quizId}</h2>
                        <p>User ID: {quiz.userId}</p>
                        <p>Username: {quiz.username}</p>
                        {/* <section className="">
                            {quiz.questions.map((question, index) => (
                                <p key={`${quiz.quizId}-${index}`}>
                                    <p>Question: {question.question}</p>
                                    <p>Answer: {question.answer}</p>
                                    <p>Location: ({question.location.latitude}, {question.location.longitude})</p>
                                </p>
                            ))}
                        </section> */}
                        <button className="mt-2 bg-gray-900 rounded border-gray-300" onClick={() => handleQuizClick(quiz.userId, quiz.quizId)} key={quiz.quizId}>Spela</button>
                    </article>
                ))}
            </main>
    )
}
