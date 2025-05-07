import { useState, useEffect } from 'react';
import Link from 'next/link';
import DarkModeToggle from '@/components/DarkModeToggle';
import { CheckSquare, Loader, Square, AlertCircle } from 'lucide-react';

export default function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <CheckSquare className="text-blue-500 dark:text-blue-400 mr-2" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        My Tasks
                    </h1>
                </div>
                <DarkModeToggle />
            </div>

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
                                                {task.completed ? (
                                                    <CheckSquare className="text-green-500 mr-2 flex-shrink-0" size={20} />
                                                ) : (
                                                    <Square className="text-gray-400 mr-2 flex-shrink-0" size={20} />
                                                )}
                                                <h2 className={`font-medium text-lg ${task.completed ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                                                    {task.title}
                                                </h2>
                                                {task.priority && (
                                                    <span className={`ml-auto px-2 py-1 text-xs rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        }`}>
                                                        {task.priority}
                                                    </span>
                                                )}
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