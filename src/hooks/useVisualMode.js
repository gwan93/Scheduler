import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    
    const dummyHistory = [...history];

    // Passing "true" to transition(THIRD, true) says "Transition to THIRD by REPLACING SECOND"
    // act(() => result.current.transition(THIRD, true));
    // expect(result.current.mode).toBe(THIRD);
    if (replace) {
      dummyHistory.pop();
    }

    setMode(newMode);
    dummyHistory.push(newMode)
    setHistory(dummyHistory)

  }

  function back() {
    if (history.length < 2) {
      return;
    }

    setHistory(prev => {
      const dummyHistory = [...prev]
      dummyHistory.pop();
      setMode(dummyHistory[dummyHistory.length - 1]);
      return dummyHistory;
    })
  }
  

  return { mode, transition, back };
}