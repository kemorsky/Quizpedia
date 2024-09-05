// import { useState, useEffect } from "react"
// import LeafletMap from "./LeafletMap"

// export default function CreateQuiz() {
//     const [question, setQuestion] = useState<string>('')
//     const [answer, setAnswer] = useState<string>('')
//     const [location, setLocation] = useState<{ latitude: string, longitude: string } | null>(null);

//     function getPosition() {
//         if ('geolocation' in navigator && !location) {
//             navigator.geolocation.getCurrentPosition((position) => {
//                 setLocation({
//                     latitude: position?.coords.latitude.toString(),
//                     longitude: position?.coords.longitude.toString(),
//                 });
//             });
//         }
//     }

//     useEffect(() => {
//         if (!location) {
//             getPosition();
//         }
//     }, [location]);

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault()
//         const token = sessionStorage.getItem('token');
//         if (!token) {
//             console.log('Token is not valid');
//             return;
//         }
    
//         if (!question || !answer) {
//             console.log('Question or answer is missing');
//             return;
//         }
    
//         if (!location || !location.latitude || !location.longitude) {
//             console.log('Location data is missing or incomplete');
//             return;
//         }
//         console.log('Token:', token); // Debugging line
//         const API_URL = "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question"
        
//         const questionData = {
//             question,
//             answer,
//             location: {
//                 latitude: location?.latitude.toString(),
//                 longitude: location?.longitude.toString()
//             }
//         };

//         console.log(questionData)
//         console.log('Payload being sent to the API:', JSON.stringify(questionData));

//         try {
//             const response = await fetch(API_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify(questionData)
//             })

//         const data = await response.json();
//         console.log('Server response:', data); // More detailed output
    
//         if (!response.ok) {
//             console.error('Error response:', {
//                 status: response.status,
//                 statusText: response.statusText,
//                 body: data
//             });
//             console.log('Error message from server:', data.message || 'Unknown error');
//         } else {
//             console.log('Question added successfully:', data);
//         }
        
//         } catch (error) {
//             console.error('Error during fetch:', error);
//         }
//     }

//     return (
//         <div>
//             <form onSubmit={handleSubmit} action="">
//                 <label htmlFor="question">
//                     <input type="text"
//                     placeholder="Fråga"
//                     value={question}
//                     onChange={(e) => { setQuestion(e.target.value) }} />
//                 </label>
//                 <label htmlFor="answer">
//                     <input type="text"
//                     placeholder="Svar"
//                     value={answer}
//                     onChange={(e) => { setAnswer(e.target.value) }} />
//                 </label>
//                 <button type='submit'>Spara</button>
//             </form>
//             <LeafletMap location={location} setLocation={setLocation}/>
//         </div>
//     )
// }

import { useState } from 'react';
import LeafletMap from "./LeafletMap"
import { useLocation, useNavigate } from 'react-router-dom';

interface Marker {
  name: string;
  question: string;
  answer: string;
  location: {
    longitude: string;
    latitude: string;
  };
}

export default function CreateQuiz() {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [markerLocation, setMarkerLocation] = useState<{ longitude: string; latitude: string } | null>(null);
  const [savedMarkers, setSavedMarkers] = useState<Marker[]>([]);
  const location = useLocation();
  const quizName = location.state?.quizName || '';
  const navigate = useNavigate();


    // handle click på kartan och sätt markers på plats

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerLocation({
      longitude: lng.toString(),
      latitude: lat.toString(),
    });
  };


  // Hantera submitform och skicka data till servern
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

        // Kontrollera att alla inputfields är ifyllda + att man har valt plats på kartan innan formuläret skickas
    if (!markerLocation || !question || !answer) {
      console.error('Fyll i alla fält, tack)!');
      return;
    }

    const newMarker = {
      name: quizName,
      question: question,
      answer: answer,
      location: {
        longitude: markerLocation.longitude,
        latitude: markerLocation.latitude,
      },
    };

    try {
      const token = sessionStorage.getItem('token'); // Hämta token från sessionStorage för autentisering
      const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  `Bearer ${token}`  // Om en token finns, lägg till den som en Bearer-token i Authorization-headern
        },
        body: JSON.stringify(newMarker),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Något gick fel med att lägga till fråga:', errorData);
        throw new Error('Misslyckades att lägga till fråga');
      }

      const quizData = await response.json();
      console.log('Quiz uppdaterad:', quizData);
      console.log('Quiz fråga adderad:', newMarker);

      // Lägg till den nya markören i listan över sparade markörer
      setSavedMarkers([...savedMarkers, newMarker]);

    } catch (error: any) {
      console.error('Error:', error.message || 'Something went wrong');
    }
  };

  const handleNavigateToQuizzes = () => {
    navigate('/allquizzes');
  };

  const handleClearing = () => {
    setQuestion('');
    setAnswer('');
  }

  return (
    <>
      <h1 className='font-italic font-sans'>{quizName}</h1>
      <form className='flex justify-between items-center mb-4 mt-4' onSubmit={handleSubmit}>
        <label>
          Fråga:
          <input
            type='text'
            className='ml-2 bg-gray-600 rounded'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </label>
        <label>
          Svar:
          <input
            type='text'
            className='ml-2 bg-gray-600 rounded'
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </label>
        <button className="mt-2 bg-gray-900 rounded border-gray-300" type='submit' >Spara din fråga</button>
        <button className="mt-2 bg-gray-900 rounded border-gray-300" type='button' onClick={handleNavigateToQuizzes}>Visa Alla quiz</button>
      </form>
      <LeafletMap
        onMapClick={handleMapClick}
        savedMarkers={savedMarkers.map(marker => ({
          lat: parseFloat(marker.location.latitude),
          lng: parseFloat(marker.location.longitude),
          question: marker.question,
          answer: marker.answer,
        }))}
        isEditable={true} // Tillåter att lägga till markör
      />
    </>
  );
}
