import React, { useEffect, useRef, useState } from 'react';

const Graph = () => {
    const [coordinatemap, setCoordinatemap] = useState({});
    const adj = [[1, 2, 3], [4, 5, 6], [74, 0, 6, 9], [35, 2]];
    const [edges, setEdges] = useState([]);
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
    const [dimentions, SetDimentions] = useState({
        w: 5,
        h: 5
    })


    //distance between  centers any 2 nodes  shoulbe greater than its diameter
    const valid = (x, y, coordinate_map) => {

        for (const node in coordinate_map) {
            const { x: x1, y: y1 } = coordinate_map[node];
            const dx = x1 - x;
            const dy = y1 - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 15* dimentions.w) return false;
        }
        return true;
    }

    const generateRandomPosition = (width, height, coordinate_map) => {

        let fl=true;
        let final_x,final_y;
        while (fl) {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);
            if(valid(x,y,coordinate_map)){
                final_x=x;
                final_y=y;
                fl=false;
                break;
            }
        }

        return{x:final_x,y:final_y}
    };

    useEffect(() => {
        const updateViewportSize = () => {
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        updateViewportSize();
        window.addEventListener('resize', updateViewportSize);

        return () => {
            window.removeEventListener('resize', updateViewportSize);
        };
    }, []);

    useEffect(() => {
        if (viewportSize.width === 0 || viewportSize.height === 0) return;

        const mapAllnodes = () => {
            const coordinate_map = {};

            for (let i = 0; i < adj.length; i++) {
                for (let j = 0; j < adj[i].length; j++) {
                    const { x, y } = generateRandomPosition(viewportSize.width, viewportSize.height, coordinate_map);
                    if (!coordinate_map[adj[i][j]]) {
                        coordinate_map[adj[i][j]] = { x, y };
                    }
                }
            }

            setCoordinatemap(coordinate_map);
        };

        mapAllnodes();
    }, [viewportSize]);

    useEffect(() => {
        const drawEdges = () => {
            const positions = [];
            adj.forEach(row => {
                const u = row[0];
                row.slice(1).forEach(v => {
                  
                    if (coordinatemap[u] && coordinatemap[v]) {
                        const { x: x1, y: y1 } = coordinatemap[u];
                        const { x: x2, y: y2 } = coordinatemap[v];
                        positions.push([x1, y1, x2, y2]);
                    }
                });
            });
            setEdges(positions);
        };

        drawEdges();
    }, [coordinatemap]);

    //console.log('map', coordinatemap);

    return (
        <div className="relative w-full h-screen p-5">
            {adj.map((vec, i) => (
                <div key={i}>
                    {vec.map((node, j) => (
                        <div
                            key={node}
                            style={{
                                top: `${coordinatemap[node]?.y}px`,
                                left: `${coordinatemap[node]?.x}px`,
                                transform: 'translate(-50%, -50%)', //making center accros the point
                                height: `${dimentions.h}rem`,
                                width: `${dimentions.w}rem`
                            }}
                            className='absolute  bg-green-500 text-white font-bold rounded-full flex justify-center items-center'>
                            {node}
                        </div>
                    ))}
                </div>
            ))}

            {edges.map((vec, i) => {
                const [x1, y1, x2, y2] = vec;
                const dx = x2 - x1;
                const dy = y2 - y1;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: `${distance}px`,
                            height: '5px',
                            transform: `rotate(${angle}deg)`,
                            left: `${x1}px`,
                            top: `${y1}px`,
                            zIndex: '-5',

                            backgroundColor: 'black',
                            transformOrigin: '0% 0%' // Rotate around starting point
                        }}
                    ></div>
                );
            })}
        </div>
    );
}

export default Graph;
