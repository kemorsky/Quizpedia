import { useState, useEffect } from "react"
import LeafletMap from "./LeafletMap"

export default function CreateQuiz() {
    const [question, setQuestion] = useState<string>('')
    const [answer, setAnswer] = useState<string>('')
    const [location, setLocation] = useState<{ latitude: string, longitude: string } | null>(null);

    function getPosition() {
        if ('geolocation' in navigator && !location) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    latitude: position?.coords.latitude.toString(),
                    longitude: position?.coords.longitude.toString(),
                });
            });
        }
    }

    useEffect(() => {
        if (!location) {
            getPosition();
        }
    }, [location]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.log('Token is not valid');
            return;
        }
    
        if (!question || !answer) {
            console.log('Question or answer is missing');
            return;
        }
    
        if (!location || !location.latitude || !location.longitude) {
            console.log('Location data is missing or incomplete');
            return;
        }
        console.log('Token:', token); // Debugging line
        const API_URL = "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question"
        // Create questionData object matching the API structure
        const questionData = {
            question,
            answer,
            location: {
                latitude: location?.latitude.toString(),
                longitude: location?.longitude.toString()
            }
        };

        console.log(questionData)
        console.log('Payload being sent to the API:', JSON.stringify(questionData));

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(questionData)
            })

        const data = await response.json();
        console.log('Server response:', data); // More detailed output
    
        if (!response.ok) {
            // Improved error logging
            console.error('Error response:', {
                status: response.status,
                statusText: response.statusText,
                body: data
            });
            console.log('Error message from server:', data.message || 'Unknown error');
        } else {
            console.log('Question added successfully:', data);
        }
        
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} action="">
                <label htmlFor="question">
                    <input type="text"
                    placeholder="Fråga"
                    value={question}
                    onChange={(e) => { setQuestion(e.target.value) }} />
                </label>
                <label htmlFor="answer">
                    <input type="text"
                    placeholder="Svar"
                    value={answer}
                    onChange={(e) => { setAnswer(e.target.value) }} />
                </label>
                <button type='submit'>Spara</button>
            </form>
            <LeafletMap location={location} setLocation={setLocation}/> {/* Pass location as prop */}
        </div>
    )
}