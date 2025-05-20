const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

const PORT = 3000;
app.use(cors());
app.use(express.json());

const DB_PATH = "./db.json";

function loadTasks() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2));
}

app.get("/tasks", (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const tasks = loadTasks();
  const newTask = {
    id: Date.now(),
    text: req.body.text,
    done: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

app.delete("/tasks/:id", (req, res) => {
  let tasks = loadTasks();
  const taskId = Number(req.params.id);
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks(tasks);
  res.status(204).send();
});

// Add endpoint to update task status
app.patch("/tasks/:id", (req, res) => {
  let tasks = loadTasks();
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    saveTasks(tasks);
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
