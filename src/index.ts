import express, { Express } from "express";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app: Express = express();

const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/todos", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
