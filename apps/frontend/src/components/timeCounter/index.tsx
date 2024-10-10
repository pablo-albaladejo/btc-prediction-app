import React, { useState, useEffect } from 'react';

interface TimeCounterProps {
  resetTrigger: number;
}

const TimeCounter: React.FC<TimeCounterProps> = ({ resetTrigger }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setSeconds(0);
  }, [resetTrigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <p>Last update: {seconds} seconds ago</p>;
};

export default TimeCounter;
