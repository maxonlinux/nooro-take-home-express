import express, { Express } from "express";
import dotenv from "dotenv";
import routes from "./routes";
import cors from "cors";

dotenv.config();

const app: Express = express();

const port = 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(cors());

// Routes
app.use("/api/todos", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
