import { Router } from "express";
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo
} from "../controllers";

const router: Router = Router();

router.get("/", getTodos);
router.get("/:id", getTodo);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.patch('/:id', toggleTodo)
router.delete("/:id", deleteTodo);

export default router;
