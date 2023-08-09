export const random = (max: number, min?: number) => {
  const randomNumber = Math.floor(Math.random() * (max + 1));

  return min === undefined ? randomNumber : Math.max(randomNumber, min);
};

export const randomBoolean = () => Math.random() >= 0.5;

export const randomId = () => `${Date.now()}${random(10)}`;
