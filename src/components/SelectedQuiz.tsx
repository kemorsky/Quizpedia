
// import { useState } from "react"

// interface Quiz {
//     quizId: string,
//     userId: string,
//     username: string
// }

// export default function SelectedQuiz() {
//     const [quizzes, setQuizzes] = useState<Quiz[]>([])
//     const renderQuizes = async (event: React.FormEvent) => {
//         event.preventDefault()
//         const token = sessionStorage.getItem('token');
//         console.log('Token:', token); // Debugging line
//         const API_URL = `https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${userId}/${quizId}`;
//         if (!token) {
//             console.log('Token is not valid')
//             return;
//         }

//         try {
//             const response = await fetch(API_URL, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 }
//             })

//         const data = await response.json();
//         console.log('Server response:', data); // More detailed output
    
//         if (!response.ok) {
//             console.log('Något gick fel :(', data.message); // Improved error logging
//         } else {
//             console.log('name sent', data);
//             setQuizzes(data.quizzes)
//         }
        
//         } catch (error) {
//             console.error('Error during fetch:', error);
//         }
//     }

//     return (
//         <div>Selected quiz</div>
//     )
// }

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import leaflet from "leaflet";

const BAS_URL = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com';

interface Question {
    question: string;
    answer: string;
    location: {
        longitude: number;
        latitude: number;
    };
}

interface Quiz {
    questions: Question[];
    userId: string;
    quizId: string;
}

interface LocationState {
    userId: string;
    quizId: string;
}

function SelectedQuiz() {
    const location = useLocation();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const { userId, quizId } = location.state as LocationState;
    const mapRef = useRef<leaflet.Map | null>(null); // Ref to store the map instance


    const fetchSelectedQuiz = async () => {
        try {
            const response = await fetch(`${BAS_URL}/quiz/${userId}/${quizId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                console.log('Something wrong with response');
                return;
            }

            const data = await response.json();
            setQuiz(data.quiz);
        } catch (error) {
            console.log('Failed to fetch quiz');
        }
    };
    useEffect(() => {
        fetchSelectedQuiz();
    }, [userId, quizId]);


    useEffect(() => {
        if (quiz && quiz.questions.length > 0) {
            const { latitude, longitude } = quiz.questions[0].location;

            // Initialize map if not already initialized
            if (!mapRef.current) {
                mapRef.current = leaflet.map('thisMap').setView([latitude, longitude], 15);

                leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }).addTo(mapRef.current);
            }

            // Adding markers for all quiz questions
            if (mapRef.current) {
                quiz.questions.forEach((question) => {
                    leaflet.marker([question.location.latitude, question.location.longitude])
                        .addTo(mapRef.current)
                        .bindPopup(question.question)
                        .bindPopup(question.answer) // add hover so that the question appears on hover but when you click on it it shows the answer
                        .openPopup();
                });
            }
        }

            // Cleanup map on unmount
            return () => {
                if (mapRef.current) {
                    mapRef.current.remove();
                    mapRef.current = null; // Reset the ref
                }
            };
        }, [quiz]);

    if (!quiz) {
        return <p>Loading...</p>;
    }


    return (
        <div>
            <h1>Quiz ID: {quiz.quizId}</h1>
            <p>User ID: {quiz.userId}</p>
            <section>
                {quiz.questions.map((question) => (
                    <article key={`${quiz.quizId}`}>
                        <p>Question: {question.question}</p>
                        <p>Answer: {question.answer}</p>
                        <p>Location: ({question.location.latitude}, {question.location.longitude})</p>
                    </article>
                ))}
            </section>
            <div id="thisMap" style={{ width: '60svw', height: '60svh' }} />
        </div>
    );
}
export default SelectedQuiz