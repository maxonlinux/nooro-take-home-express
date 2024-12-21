export const log = (message: unknown): void => {
  const datetime = new Date().toISOString();

  console.log(`[${datetime}] ${message}`);
};

export const validateHexColor = (color: string): boolean => {
  const regex = /^#(?:[0-9a-fA-F]{3,4}){1,2}$/;

  return regex.test(color);
};