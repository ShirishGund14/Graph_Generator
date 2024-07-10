import React, { useEffect, useRef, useState } from 'react';
import { FaCircleNodes } from "react-icons/fa6";

const Graph = () => {
    const [coordinateMap, setCoordinateMap] = useState({});
    const [edges, setEdges] = useState([]);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [dimensions, setDimensions] = useState({ w:5, h:5 });
    const [adj, setAdj] = useState([[1, 2, 3], [74, 0, 6, 9], [35, 2]]);
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

        const mapAllNodes = () => {
            const coordinate_map = {};

            for (let i = 0; i < adj.length; i++) {
                for (let j = 0; j < adj[i].length; j++) {
                    const { x, y } = generateRandomPosition(containerSize.width, containerSize.height, coordinate_map);
                    if (!coordinate_map[adj[i][j]]) {
                        coordinate_map[adj[i][j]] = { x, y };
                    }
                }
            }

            setCoordinateMap(coordinate_map);
        };

        mapAllNodes();
    }, [adj, containerSize]);

    useEffect(() => {
        const drawEdges = () => {
            const positions = [];
            adj.forEach(row => {
                const u = row[0];
                row.slice(1).forEach(v => {
                    if (coordinateMap[u] && coordinateMap[v]) {
                        const { x: x1, y: y1 } = coordinateMap[u];
                        const { x: x2, y: y2 } = coordinateMap[v];
                        positions.push([x1, y1, x2, y2]);
                    }
                });
            });
            setEdges(positions);
        };

        drawEdges();
    }, [coordinateMap, adj]);

    const handleDragStart = (e, node) => {
        e.dataTransfer.setData('node', node);
    };

    const handleDrag = (e, node) => {
        const x = e.clientX - containerRef.current.getBoundingClientRect().left;
        const y = e.clientY - containerRef.current.getBoundingClientRect().top;
        setCoordinateMap(prev => ({
            ...prev,
            [node]: { x, y }
        }));
    };

    const handleDragEnd = (e, node) => {
        const x = e.clientX - containerRef.current.getBoundingClientRect().left;
        const y = e.clientY - containerRef.current.getBoundingClientRect().top;
        setCoordinateMap(prev => ({
            ...prev,
            [node]: { x, y }
        }));
    };



    return (
        <div className='w-full h-screen flex flex-col gap-3 items-center  bg-[#212529] p-4 md:p-12  -z-10'>
            <div className='text-4xl  md:text-5xl font-bold my-4 text-[#6c757d] flex items-center gap-4 '>Graph Generator <span className='text-[#ff4000]'><FaCircleNodes /></span></div>

            <div className='flex  flex-col gap-4 w-full p-2 md:p-4 justify-between mb-5 bg-[#6c757d]'>

                <div className='text-black text-sm md:text-xl p-3 bg-slate-400'>
                    Enter adjacency in the form of comma(,) seperated 2d array  [[u1,v1,v2,v],[u2,v5],[u3]] where v<sub>i</sub> is the neighbouring node of
                    u<sub>i</sub> node <br></br>
                    <div className='flex md:gap-4 items-center overflow-y-auto'>
                        <div className='w-6 h-6 bg-[#efd6ac] mr-1'></div> shows unidirectional-edges
                        <div className='w-6 h-6 bg-blue-500 mr-1'></div> shows Bidirectional-edges
                    </div>
                </div>

                <div className='w-full flex items-center gap-5'>
                    <textarea
                        type='text'
                        className='border-2 p-3 rounded-md w-3/4 bg-gray-900 text-[#ff4000] border-none'
                        placeholder='Enter Adjacency List like: [[1, 2, 3], [4, 5, 6], [74, 0, 6, 9], [35, 2]]'
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <button
                        className='p-3 bg-[#ff6700] text-gray-100 font-medium  rounded-lg hover:shadow-xl '
                        onClick={parseAdjacencyList}
                    >
                        Generate Graph
                    </button>
                </div>
            </div>

            <div ref={containerRef} className="relative w-full h-3/4 md:m-5">
                {adj.map((vec, i) => (
                    <div key={i}>
                        {vec.map((node, j) => (
                            <div
                                key={node}
                                draggable
                                onDragStart={(e) => handleDragStart(e, node)}
                                onDrag={(e) => handleDrag(e, node)}
                                onDragEnd={(e) => handleDragEnd(e, node)}
                                style={{
                                    top: `${coordinateMap[node]?.y}px`,
                                    left: `${coordinateMap[node]?.x}px`,
                                    transform: 'translate(-50%, -50%)',
                                    height: `${dimensions.h}rem`,
                                    width: `${dimensions.w}rem`,
                                    position: 'absolute'
                                }}
                                className='z-10 bg-[#6c757d] text-xl text-[#f7f7f7] font-bold rounded-full flex justify-center items-center border-4 border-[#ff4000] hover:cursor-pointer'
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

                    const isBidirectional = edges.some(
                        ([x2Edge, y2Edge, x1Edge, y1Edge]) =>
                            x1 === x1Edge && y1 === y1Edge && x2 === x2Edge && y2 === y2Edge
                    );

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
                                backgroundColor: isBidirectional ? 'blue' : '#efd6ac',
                                transformOrigin: '0% 0%',

                            }}
                            className='m-4'
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Graph;
