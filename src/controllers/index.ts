import { Request, Response } from "express";
import { prisma } from "../utils";
import { asyncHandler, validateHexColor } from "../utils";

const getTodos = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const todos = await prisma.todo.findMany();

    if (!todos) {
      res.status(201).json({ message: "No todos found" });
      return;
    }

    res.json(todos);
  }
);

const getTodo = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID is required" });
      return;
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id: +id,
      },
    });

    if (!todo) {
      res.status(404).json({ message: `Todo ID ${id} not found` });
      return;
    }

    res.json(todo);
  }
);

const createTodo = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, color } = req.body;

    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    if (color && !validateHexColor(color)) {
      res.status(400).json({ message: "Invalid color HEX" });
      return;
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        color,
      },
    });

    res.status(201).json(todo);
  }
);

const updateTodo = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, color } = req.body;

    const todo = await prisma.todo.update({
      where: {
        id: +id,
      },
      data: {
        title,
        color,
      },
    });

    res.json(todo);
  }
);

const deleteTodo = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID is required" });
      return;
    }

    const todo = await prisma.todo.delete({
      where: {
        id: +id,
      },
    });

    res.json(todo);
  }
);

const toggleTodo = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { completed } = req.body;

    if (!id) {
      res.status(400).json({ message: "ID is required" });
    }

    const todo = await prisma.todo.update({
      where: {
        id: +id,
      },
      data: {
        completed,
      },
    });

    res.json(todo);
  }
);

export { getTodos, getTodo, createTodo, updateTodo, deleteTodo, toggleTodo };
