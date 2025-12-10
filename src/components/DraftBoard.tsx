import { useState } from 'react';

/**
 * Estado de cada dígito en el tablero borrador
 */
type DigitState = 'neutral' | 'eliminated' | 'potential';

/**
 * Componente Tablero Borrador (Mnemonic Draft Board)
 * Permite al usuario marcar números como ayuda visual
 */
export function DraftBoard() {
    // Estado para los dígitos 0-9
    const [digitStates, setDigitStates] = useState<DigitState[]>(
        Array(10).fill('neutral')
    );

    const toggleState = (index: number) => {
        setDigitStates((prev) => {
            const newStates = [...prev];
            const currentState = newStates[index];

            // Ciclo: Neutral -> Eliminated -> Potential -> Neutral
            if (currentState === 'neutral') {
                newStates[index] = 'eliminated';
            } else if (currentState === 'eliminated') {
                newStates[index] = 'potential';
            } else {
                newStates[index] = 'neutral';
            }

            return newStates;
        });
    };

    return (
        <div className="draft-board-container">
            <div className="draft-board-glass">
                <h4 className="draft-title">📝 Tablero de Ayuda</h4>
                <div className="digits-grid">
                    {digitStates.map((state, index) => (
                        <button
                            key={index}
                            className={`digit-card ${state}`}
                            onClick={() => toggleState(index)}
                            aria-label={`Dígito ${index}: ${state}`}
                            title="Click para cambiar estado"
                        >
                            <span className="digit-number">{index}</span>
                            {state === 'eliminated' && <span className="mark-x">✕</span>}
                            {state === 'potential' && <span className="mark-check">✓</span>}
                        </button>
                    ))}
                </div>
                <p className="draft-hint">
                    Click para marcar: <span className="hint-x">✕ Descartado</span> • <span className="hint-check">✓ Posible</span>
                </p>
            </div>
        </div>
    );
}
