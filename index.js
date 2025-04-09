import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src'))); // Обслуживаем HTML/CSS/JS из папки src

// MongoDB
mongoose.connect('mongodb+srv://qwelskw:Katya021024@qwelskw.a79nq.mongodb.net/?retryWrites=true&w=majority&appName=qwelskw', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB error:', err));

// Модель задачи
const Task = mongoose.model('Task', {
  title: String,
  description: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, 'Task');

// Маршруты
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const task = new Task({
      title,
      description,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await task.save();
    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    console.error('POST /tasks error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

app.put('/tasks/:id', async (req, res) => {
  const { status } = req.body;
  await Task.findByIdAndUpdate(req.params.id, {
    status,
    updatedAt: new Date()
  });
  res.json({ message: 'Task updated' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
