import { useState } from 'react'
import './App.css'
import LeafletMap from './components/LeafletMap'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <h1>Quizpedia</h1>
      <LeafletMap />
    </main>
  )
}

export default App
