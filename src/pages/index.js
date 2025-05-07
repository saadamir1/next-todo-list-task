import { useState, useEffect } from 'react';
import Link from 'next/link';
import DarkModeToggle from '@/components/DarkModeToggle';
import { CheckSquare, Loader, Square, AlertCircle, Plus, X, Trash2 } from 'lucide-react';

export default function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`
            : '/api/tasks';

        const fetchTasks = async () => {
            try {
                const res = await fetch(apiUrl);

                if (!res.ok) {
                    // Try to get meaningful error message from server
                    const errorText = await res.text();
                    // Log only in dev
                    if (process.env.NODE_ENV === 'development') {
                        console.error(`Server responded with status ${res.status}: ${errorText}`);
                    }

                    setError('Failed to load tasks. Please try again later.');
                    return;
                }

                const data = await res.json();
                setTasks(data);
            } catch (err) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Fetch failed:', err);
                }

                let message = 'Unable to load tasks. Please check your network or try again later.';
                if (err.name === 'TypeError') {
                    message = 'Server is unreachable. Please make sure the backend is running.';
                }

                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Add new task
    const handleAddTask = async (e) => {
        e.preventDefault();

        if (!newTask.title.trim()) return;

        setSubmitting(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`
            : '/api/tasks';

        try {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });

            if (!res.ok) {
                throw new Error('Failed to add task');
            }

            const createdTask = await res.json();

            // Add the new task to the list
            setTasks(prevTasks => [...prevTasks, createdTask]);

            // Reset the form
            setNewTask({ title: '', description: '', priority: 'Medium' });
            setShowAddForm(false);

        } catch (err) {
            console.error('Error adding task:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete task
    const handleDeleteTask = async (taskId, e) => {
        e.preventDefault();  // Prevent navigation to task detail page
        e.stopPropagation(); // Stop event bubbling

        if (updating === taskId) return; // Prevent double clicks

        setUpdating(taskId);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`
            : `/api/tasks/${taskId}`;

        try {
            const res = await fetch(apiUrl, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error('Failed to delete task');
            }

            // Remove the task from the list
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

        } catch (err) {
            console.error('Error deleting task:', err);
        } finally {
            setUpdating(null);
        }
    };

    const toggleTaskCompletion = async (taskId, e) => {
        e.preventDefault();  // Prevent navigation to task detail page
        e.stopPropagation(); // Stop event bubbling

        if (updating === taskId) return; // Prevent double clicks

        setUpdating(taskId);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/toggle`
            : `/api/tasks/${taskId}/toggle`;

        try {
            const res = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error('Failed to update task');
            }

            const updatedTask = await res.json();

            // Update the tasks list with the updated task
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, completed: updatedTask.completed } : task
                )
            );

        } catch (err) {
            console.error('Error updating task:', err);
            // Could add error handling UI here
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <CheckSquare className="text-blue-500 dark:text-blue-400 mr-2" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        My Tasks
                    </h1>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="mr-4 flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
                    >
                        {showAddForm ? <X size={16} className="mr-1" /> : <Plus size={16} className="mr-1" />}
                        {showAddForm ? 'Cancel' : 'Add Task'}
                    </button>
                    <DarkModeToggle />
                </div>
            </div>

            {/* Add Task Form */}
            {showAddForm && (
                <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Add New Task</h2>
                    <form onSubmit={handleAddTask}>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                                placeholder="Enter task title"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                                placeholder="Enter task description"
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Priority
                            </label>
                            <select
                                id="priority"
                                value={newTask.priority}
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || !newTask.title.trim()}
                                className="flex items-center bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                {submitting ? <Loader size={16} className="mr-2 animate-spin" /> : <Plus size={16} className="mr-2" />}
                                Add Task
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader className="animate-spin text-blue-500" size={32} />
                </div>
            ) : error ? (
                <div className="text-center py-10">
                    <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
                    <p className="text-red-600 dark:text-red-400 text-xl font-semibold mb-2">
                        Something went wrong.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        {error} <br /> Please refresh the page or try again later.
                    </p>
                </div>
            ) : (
                <div className="mt-6">
                    {tasks.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No tasks available.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {tasks.map(task => (
                                <Link key={task.id} href={`/task/${task.id}`} legacyBehavior>
                                    <a className="block">
                                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600">
                                            <div className="flex items-center">
                                                {/* Make checkbox clickable */}
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={(e) => toggleTaskCompletion(task.id, e)}
                                                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                                                >
                                                    {updating === task.id ? (
                                                        <Loader className="text-blue-500 mr-2 flex-shrink-0 animate-spin" size={20} />
                                                    ) : task.completed ? (
                                                        <CheckSquare className="text-green-500 mr-2 flex-shrink-0 hover:text-green-600" size={20} />
                                                    ) : (
                                                        <Square className="text-gray-400 mr-2 flex-shrink-0 hover:text-gray-600" size={20} />
                                                    )}
                                                </div>
                                                <h2 className={`font-medium text-lg ${task.completed ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                                                    {task.title}
                                                </h2>
                                                <div className="flex ml-auto">
                                                    {task.priority && (
                                                        <span className={`mr-2 px-2 py-1 text-xs rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            }`}>
                                                            {task.priority}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={(e) => handleDeleteTask(task.id, e)}
                                                        className="text-gray-400 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                                        aria-label="Delete task"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            {task.description && (
                                                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 ml-7">
                                                    {task.description?.substring(0, 80)}...
                                                </p>
                                            )}
                                            <div className="mt-3 text-blue-500 text-sm ml-7">View details →</div>
                                        </div>
                                    </a>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}