export const calculateFare = (distance, duration, type) => {
  const rates = {
    economy: 1,
    xl: 1.5,
    premium: 2,
  };

  return (distance / 1000) * 500 * rates[type] + (duration / 60) * 200;
};