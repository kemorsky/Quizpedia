import { useState } from 'react'
import './App.css'
import CreateQuiz from './components/CreateQuiz'
import './index.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <CreateQuiz />
    </main>
  )
}

export default App
