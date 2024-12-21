import { Request, Response } from "express";
import { Todo } from "../types";
import prisma from "../../prisma/client";
import { log, validateHexColor } from "../utils";

const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const todos = await prisma.todo.findMany();

    if (!todos) {
      res.status(201).json({ message: "No todos found" });
      return;
    }

    res.json({
      message: "Todos",
      data: todos,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    log(error);
  }
};

const getTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID is required" });
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id: +id,
      },
    });

    res.json({
      message: `Todo ID ${id}`,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    log(error);
  }
};

const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, color } = req.body;

    if (!title) {
      res.status(400).json({ message: "Title is required" });
    }

    if (color) {
      const isValidColor = validateHexColor(color);

      if (!isValidColor) {
        res.status(400).json({ message: "Invalid color HEX" });
        return;
      }
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        color,
      },
    });

    res.status(201).json({
      message: "Todo created",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    log(error);
  }
};

const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, completed, color } = req.body;

    const updatedTodo = await prisma.todo.update({
      where: {
        id: +id,
      },
      data: {
        title,
        completed,
        color,
      },
    });

    res.json({
      message: `Todo ID ${id} updated`,
      data: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    log(error);
  }
};

const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID is required" });
    }

    await prisma.todo.delete({
      where: {
        id: +id,
      },
    });

    res.json({ message: `Todo ID ${id} deleted` });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    log(error);
  }
};

export { getTodos, getTodo, createTodo, updateTodo, deleteTodo };
