"use client";

import GamesPage from './game';
import { useState } from 'react';

export default function Landing() {

    const [isPlaying, setIsPlaying] = useState(true);

    if (!isPlaying) {
        return <GamesPage />;
    }

    return (
        <div>
            <h1>Play</h1>
            <p>Play your game here</p>
            work in progress...
            <button onClick={() => {
                setIsPlaying(false);
            }}>Back to games</button>
        </div>
    );
}