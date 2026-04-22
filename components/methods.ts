export const shuffleArray = <T>(array: T[]): T[] => {
  
  const shuffled = [...array]; 
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    
    // Swap elements at i and j
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

export const getTimeFromString = (timeString: string) => {
  if (!timeString) return { hours: NaN, minutes: NaN };

  const clean = timeString.trim().toUpperCase();

  const parts = timeString.trim().toUpperCase().split(/\s+/);
  if (parts.length < 2) return { hours: NaN, minutes: NaN };

  const [time, modifier] = parts;
  const [hoursStr, minutesStr] = time.split(':');

  let hours = Number(hoursStr);
  let minutes = Number(minutesStr);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return { hours: NaN, minutes: NaN };
  }

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }

  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};