// import { useState } from "react"
// import { useNavigate } from "react-router-dom"

// export default function NameQuiz() {
//     const [name, setName] = useState<string>('')
//     const navigate = useNavigate()

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault()
//         const nameData = {name};
//         const token = sessionStorage.getItem('token');
//         console.log('Token:', token); // Debugging line
//         const API_URL = "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz"
//         if (!token) {
//             console.log('Token is not valid')
//             navigate('/')
//             return;
//         }

//         try {
//             const response = await fetch(API_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify(nameData)
//             })

//         const data = await response.json();
//         console.log('Server response:', data); // More detailed output
    
//         if (!response.ok) {
//             console.log('Något gick fel :(', data.message);
//         } else {
//             console.log('name sent', data);
//             navigate('/main');
//         }
        
//         } catch (error) {
//             console.error('Error during fetch:', error);
//         }
//     }
    
//     const handleClick = () => {
//         navigate('/allquizes')
//     }

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <label>
//                     <input type="text"
//                     value={name}
//                     onChange= {(e) => {setName(e.target.value)}} />
//                 </label>
//                 <button type='submit'>Spara</button>
//                 <label>
//                     Or
//                     <button onClick={handleClick}>Show all quizes</button>
//                 </label>
//             </form>
//         </div>
//     )
// }

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NameQuiz() {
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem('token');// Hämta token för autentisering
      const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '', // Om vi har en token, skicka med den så vi kan bevisa att vi är the chosen one!

        },
        body: JSON.stringify({ name: quizName }), // see how we are sending the quizname to the server? very demure, very mindful, very cutesy
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      const data = await response.json();
      console.log(data);

      navigate('/main', { state: { quizName } });
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="create-quiz">
      <h1>Skapa Quiz</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Vad ska ditt quiz heta?
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Nästa</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
