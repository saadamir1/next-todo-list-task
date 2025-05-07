import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Loader, Info, CheckSquare, Square } from 'lucide-react';

export default function TaskPage() {
    const router = useRouter();
    const { id } = router.query;
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!id) return;

        // Using the API URL from environment variable or falling back to relative path
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`
            : `/api/tasks/${id}`;

        fetch(apiUrl)
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status === 404 ? 'Task not found' : 'Failed to load task');
                }
                return res.json();
            })
            .then(data => {
                setTask(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching task:', err);
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const toggleTaskCompletion = async () => {
        if (updating || !task) return;

        setUpdating(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}/toggle`
            : `/api/tasks/${id}/toggle`;

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
            setTask(updatedTask);

        } catch (err) {
            console.error('Error updating task:', err);
            // Could add error handling UI here
        } finally {
            setUpdating(false);
        }
    };

    if (error) return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 text-center">
            <Info size={40} className="mx-auto text-red-500 mb-2" />
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">{error}</h2>
            <button
                className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
                onClick={() => router.push('/')}
            >
                Return to Tasks
            </button>
        </div>
    );

    if (loading) return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 text-center">
            <Loader size={40} className="mx-auto animate-spin text-blue-500 mb-2" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">Loading task details...</h2>
        </div>
    );

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
            <button
                onClick={() => router.push('/')}
                className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6 transition-colors"
            >
                <ArrowLeft size={18} className="mr-1" />
                <span>Back to Tasks</span>
            </button>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                    <div
                        className="cursor-pointer"
                        onClick={toggleTaskCompletion}
                        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                        {updating ? (
                            <Loader className="text-blue-500 mr-3 flex-shrink-0 animate-spin" size={24} />
                        ) : task.completed ? (
                            <CheckSquare className="text-green-500 mr-3 flex-shrink-0 hover:text-green-600" size={24} />
                        ) : (
                            <Square className="text-gray-400 mr-3 flex-shrink-0 hover:text-gray-600" size={24} />
                        )}
                    </div>
                    <h1 className={`text-3xl font-bold ${task.completed ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                        {task.title}
                    </h1>
                </div>

                <div className="h-1 w-20 bg-blue-500 mb-6 ml-9"></div>

                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed ml-9">{task.description}</p>

                {task.priority && (
                    <div className="mt-6 ml-9">
                        <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                            Priority: {task.priority}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}