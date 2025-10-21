import React from 'react';
import WorldClock from '../components/WorldClock';
import { getClocks, type ClockConfig } from '../utils/storage';

const Home: React.FC = () => {
  const [clocks, setClocks] = React.useState<ClockConfig[]>([]);

  React.useEffect(() => {
    const savedClocks = getClocks();
    setClocks(savedClocks);
  }, []);

  const handleRemoveClock = (index: number) => {
    const updatedClocks = clocks.filter((_, i) => i !== index);
    setClocks(updatedClocks);
    localStorage.setItem('world-clocks', JSON.stringify(updatedClocks));
  };

  if (clocks.length === 0) {
    return (
      <div className="home-page">
        <div className="container">
          <h1>World Clocks</h1>
          <div className="empty-state">
            <p>No clocks configured yet.</p>
            <p>Go to Settings to add your first world clock!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="container">
        <h1>World Clocks</h1>
        <div className="clocks-grid">
          {clocks.map((clock, index) => (
            <WorldClock
              key={`${clock.timezone}-${clock.city}-${index}`}
              timezone={clock.timezone}
              city={clock.city}
              isRemovable={true}
              onRemove={() => handleRemoveClock(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;