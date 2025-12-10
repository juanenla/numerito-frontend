import { useState, useEffect } from 'react';

interface GameTimerProps {
    startTime: number | null;
    endTime: number | null;
}

export function GameTimer({ startTime, endTime }: GameTimerProps) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!startTime) {
            setElapsed(0);
            return;
        }

        if (endTime) {
            // Si ya terminó, mostrar el tiempo final
            setElapsed(Math.floor((endTime - startTime) / 1000));
            return;
        }

        // Intervalo para actualizar el tiempo cada segundo
        const interval = setInterval(() => {
            const now = Date.now();
            setElapsed(Math.floor((now - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, endTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="game-timer" style={{
            margin: '10px 0',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#555'
        }}>
            ⏱️ {formatTime(elapsed)}
        </div>
    );
}
