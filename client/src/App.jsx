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


      


            {/* {adj.map((vec, vecIndex) => (
                vec.map((node, nodeIndex) => {
                    const { top, left } = generateRandomPosition();
                   
                    return (
                        <div
                            key={`${vecIndex}-${nodeIndex}`}
                            style={{ position: 'absolute', top, left }}
                            className="w-20 h-20 p-4 bg-green-600 text-gray-200 rounded-full flex justify-center items-center font-bold"
                        >
                            {node}
                        </div>
                    );
                })
            ))} */}
     
    </>
  )
}

export default App
