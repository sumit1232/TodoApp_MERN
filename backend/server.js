const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Todo = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// --- API ROUTES ---

// GET: Fetch all todos

app.get('/',async(req,res)=>{
  app.send('Homepage')
})

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// POST: Add a new todo
app.post('/todos', async (req, res) => {
  const newTodo = new Todo({ task: req.body.task });
  const savedTodo = await newTodo.save();
  res.json(savedTodo);
});

// PUT: Update completion status
app.put('/todos/:id', async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id, 
    { completed: req.body.completed },
    { new: true }
  );
  res.json(updatedTodo);
});

// DELETE: Remove a todo
app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));