'use client';

// imports
import { useState } from 'react';
import Button from "./components/ui/button/button";


// this is the home component
function Home() {

    // this is the state of the count
    const [ count, setCount ] = useState(0);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="m-16 text-4xl font-bold">Click to Count</h1>
            <Button variant="primary" disabled={false} size="large" onClick={() => setCount(count + 1)}>You clicked {count} times</Button>
        </div>
    )
}

export default Home;