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

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerLocation({
      longitude: lng.toString(),
      latitude: lat.toString(),
    });
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  `Bearer ${token}`  
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
        <section>
          <button className="mt-2 bg-gray-900 rounded border-gray-300" type='submit' >Spara din fråga</button>
          <button className="mt-2 ml-2 bg-gray-900 rounded border-gray-300" type='button' onClick={handleNavigateToQuizzes}>Visa Alla quiz</button>
        </section>
        
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
