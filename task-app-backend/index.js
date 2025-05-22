const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

const PORT = 3000;
app.use(cors());
app.use(express.json());

const path = require("path");
const DB_PATH = path.join(__dirname, "db.json");

function loadTasks() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveTasks(tasks) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
}

app.get("/tasks", (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  if (
    !req.body.text ||
    typeof req.body.text !== "string" ||
    !req.body.text.trim()
  ) {
    return res.status(400).json({ error: "Task text is required" });
  }

  const tasks = loadTasks();
  const newTask = {
    id: Date.now(),
    text: req.body.text.trim(),
    done: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

app.delete("/tasks/:id", (req, res) => {
  let tasks = loadTasks();
  const taskId = Number(req.params.id);
  const originalLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== taskId);

  if (tasks.length === originalLength) {
    return res.status(404).json({ error: "Task not found" });
  }

  saveTasks(tasks);
  res.status(204).send();
});

// Add endpoint to update task status
app.patch("/tasks/:id", (req, res) => {
  let tasks = loadTasks();
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    // Only allow updating specific fields
    const allowedUpdates = {};
    if ("done" in req.body && typeof req.body.done === "boolean") {
      allowedUpdates.done = req.body.done;
    }
    if (
      "text" in req.body &&
      typeof req.body.text === "string" &&
      req.body.text.trim()
    ) {
      allowedUpdates.text = req.body.text.trim();
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...allowedUpdates };
    saveTasks(tasks);
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
