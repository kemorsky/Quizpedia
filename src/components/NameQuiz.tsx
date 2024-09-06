import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NameQuiz() {
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '', 
        },
        body: JSON.stringify({ name: quizName }), 
      });

      if (!response.ok) {
        throw new Error('Kan inte hämta quiz');
      }

      const data = await response.json();
      console.log(data);

      navigate('/main', { state: { quizName } });
    } catch (error: any) {
      setError(error.message || 'Något gick fel');
    }
  };

  return (
    <div className='flex flex-col wrap items-center p-4 justify-center border rounded bg-gray-800'>
      <h2 className='text-3xl'>Skapa Quiz</h2>
      <form onSubmit={handleSubmit} className="flex flex-col p-4 m-2 items-center  ">
        Ge ett namn till ditt quiz:
        <label className='mt-5 mb-1'>
          <input
            type="text"
            value={quizName}
            className="bg-gray-600 rounded mb-2"
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
        </label>
        <button className="mt-2 bg-gray-900 rounded border-gray-300" type="submit">Nästa</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
