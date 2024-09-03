import { useState } from 'react'
import './App.css'
import CreateQuiz from './components/CreateQuiz'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <h1>Quizpedia</h1>
      <CreateQuiz />
    </main>
  )
}

export default App
