import React, { useEffect, useRef, useState } from 'react';

const Graph = () => {
    const [coordinatemap, setCoordinatemap] = useState({});
    const [edges, setEdges] = useState([]);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [dimensions, setDimensions] = useState({
        w: 5,
        h: 5
    });
    const [adj, setAdj] = useState([[1, 2, 3],[74, 0, 6, 9], [35, 2]]);
    const [inputValue, setInputValue] = useState('[[1, 2, 3],[74, 0, 6, 9], [35, 2]]');

    const containerRef = useRef(null);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const parseAdjacencyList = () => {
        try {
            const parsedAdj = JSON.parse(inputValue);
            if (!Array.isArray(parsedAdj)) {
                throw new Error('Input must be a valid 2D array');
            }
            // Ensure each element in parsedAdj is an array
            for (const arr of parsedAdj) {
                if (!Array.isArray(arr)) {
                    throw new Error('Each element in the adjacency list must be an array');
                }
            }
            setAdj(parsedAdj);
        } catch (error) {
            console.error('Error parsing adjacency list:', error);
        }
    };

    const valid = (x, y, coordinate_map) => {
        for (const node in coordinate_map) {
            const { x: x1, y: y1 } = coordinate_map[node];
            const dx = x1 - x;
            const dy = y1 - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 15 * dimensions.w) return false;
        }
        return true;
    };

    const generateRandomPosition = (width, height, coordinate_map) => {
        let fl = true;
        let final_x, final_y;
        while (fl) {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);
            if (valid(x, y, coordinate_map)) {
                final_x = x;
                final_y = y;
                fl = false;
                break;
            }
        }

        return { x: final_x, y: final_y };
    };

    useEffect(() => {
        const updateContainerSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        updateContainerSize();
        window.addEventListener('resize', updateContainerSize);

        return () => {
            window.removeEventListener('resize', updateContainerSize);
        };
    }, []);

    useEffect(() => {
        if (containerSize.width === 0 || containerSize.height === 0) return;

        const mapAllnodes = () => {
            const coordinate_map = {};

            for (let i = 0; i < adj.length; i++) {
                for (let j = 0; j < adj[i].length; j++) {
                    const { x, y } = generateRandomPosition(containerSize.width, containerSize.height, coordinate_map);
                    if (!coordinate_map[adj[i][j]]) {
                        coordinate_map[adj[i][j]] = { x, y };
                    }
                }
            }

            setCoordinatemap(coordinate_map);
        };

        mapAllnodes();
    }, [adj, containerSize]);

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
    }, [coordinatemap, adj]);

    return (
        <div className='w-full h-screen flex flex-col gap-3 justify-center items-center bg-gray-900 p-20 -z-10'>
            <div className='text-4xl font-bold my-2 text-green-500'>Graph Generator</div>

            <div className='flex gap-4 w-full items-center justify-between'>
                <textarea
                    type='text'
                    className='border-2 p-3 rounded-md w-3/4 bg-transparent text-green-400'
                    placeholder='Enter Adjacency List like: [[1, 2, 3], [4, 5, 6], [74, 0, 6, 9], [35, 2]]'
                    value={inputValue}
                    onChange={handleInputChange}
                >
                </textarea>
                <button
                    className='p-3 bg-green-500 text-gray-100 font-medium'
                    onClick={parseAdjacencyList}
                >
                    Generate Graph
                </button>
            </div>

            <div ref={containerRef} className="relative w-full h-3/4 m-5 ">
                {adj.map((vec, i) => (
                    <div key={i}>
                        {vec.map((node, j) => (
                            <div
                                key={node}
                                style={{
                                    top: `${coordinatemap[node]?.y}px`,
                                    left: `${coordinatemap[node]?.x}px`,
                                    transform: 'translate(-50%, -50%)',
                                    height: `${dimensions.h}rem`,
                                    width: `${dimensions.w}rem`
                                }}
                                className='absolute z-10 bg-green-500 text-white font-bold rounded-full flex justify-center items-center'
                            >
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
                                //zIndex: '-5',
                                backgroundColor: 'orange',
                                transformOrigin: '0% 0%'
                            }}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
}

export default Graph;
