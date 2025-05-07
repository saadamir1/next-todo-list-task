const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Mock task data
const tasks = [
    {
        id: '1',
        title: 'Complete project proposal',
        description: 'Write up the detailed project proposal for the new client including timeline, budget, and resource allocation. Make sure to address all their requirements from the initial meeting.',
        completed: false,
        priority: 'High'
    },
    {
        id: '2',
        title: 'Weekly team meeting',
        description: 'Prepare agenda and notes for the weekly team sync-up. Topics include project status updates, roadblocks, and planning for next sprint.',
        completed: false,
        priority: 'Medium'
    },
    {
        id: '3',
        title: 'Buy groceries',
        description: 'Pick up milk, eggs, bread, fruits, and vegetables from the grocery store. Remember to use the discount coupon before it expires this weekend.',
        completed: true,
        priority: 'Low'
    },
    {
        id: '4',
        title: 'Schedule dentist appointment',
        description: 'Call Dr. Smiths office to schedule the annual checkup and cleaning. Their number is 555-1234. Best time to call is morning hours.',
        completed: false,
        priority: 'Medium'
    }
];

// Routes
app.get('/api/tasks', (req, res) => {
    console.log('GET /api/tasks - Request received');

    // Return a simplified version for the task list
    const simplifiedTasks = tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description.substring(0, 100), // Truncated description for list view
        completed: task.completed,
        priority: task.priority
    }));

    console.log('Sending tasks:', simplifiedTasks.length);
    res.json(simplifiedTasks);
});

app.get('/api/tasks/:id', (req, res) => {
    console.log(`GET /api/tasks/${req.params.id} - Request received`);

    const task = tasks.find(t => t.id === req.params.id);

    if (task) {
        console.log('Task found, sending:', task.title);
        res.json(task);
    } else {
        console.log('Task not found');
        res.status(404).json({ message: 'Task not found' });
    }
});

// Root route for testing
app.get('/', (req, res) => {
    res.send('Task API server is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});