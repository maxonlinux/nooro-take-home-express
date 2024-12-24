import { Request, Response } from "express";

// Log message with timestamp
export const log = (message: unknown): void => {
  const datetime = new Date().toISOString();

  console.log(`[${datetime}] ${message}`);
};

// Validate if color is a valid hex color
export const validateHexColor = (color: string): boolean => {
  const regex = /^#(?:[0-9a-fA-F]{3,4}){1,2}$/;

  return regex.test(color);
};

// Async handler
export const asyncHandler = (
  handler: (req: Request, res: Response) => Promise<void>
) => {
  return async (req: Request, res: Response) => {
    try {
      await handler(req, res);
    } catch (error) {
      log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };
};
