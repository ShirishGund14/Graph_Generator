import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Graph from './components/Graph'

function App() {
  const adj = [[1, 2, 3], [4, 5, 6], [74, 0, 6, 9], [35, 2]];

  return (
    <>
      <div className=''>
        <Graph />
      </div>
     
    </>
  )
}

export default App
