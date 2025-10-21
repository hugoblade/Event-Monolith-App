export interface ClockConfig {
  timezone: string;
  city: string;
}

const STORAGE_KEY = 'world-clocks';

export const getClocks = (): ClockConfig[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading clocks from storage:', error);
    return [];
  }
};

export const saveClocks = (clocks: ClockConfig[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clocks));
  } catch (error) {
    console.error('Error saving clocks to storage:', error);
  }
};

export const addClock = (clock: ClockConfig): void => {
  const clocks = getClocks();
  clocks.push(clock);
  saveClocks(clocks);
};

export const removeClock = (index: number): void => {
  const clocks = getClocks();
  clocks.splice(index, 1);
  saveClocks(clocks);
};