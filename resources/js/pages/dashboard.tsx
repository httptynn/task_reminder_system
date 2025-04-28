import { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Chart, registerables } from 'chart.js';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BreadcrumbItem, Task } from '@/types';

// Register Chart.js components
Chart.register(...registerables);

interface DashboardProps {
    stats?: {
        pending: number;
        done: number;
        overdue: number;
        on_progress: number;
    };
    recentTasks?: Task[];
    breadcrumbs: BreadcrumbItem[];
    isAdmin: boolean;
}

export default function Dashboard({
    stats = { pending: 0, done: 0, overdue: 0, on_progress: 0 },
    recentTasks = [],
    breadcrumbs,
    isAdmin,
}: DashboardProps) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    // Initialize Chart
    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                // Destroy existing chart if it exists
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Pending', 'Done', 'Overdue', 'On Progress'],
                        datasets: [
                            {
                                data: [stats.pending, stats.done, stats.overdue, stats.on_progress],
                                backgroundColor: ['#7e22ce', '#22c55e', '#ef4444', '#f59e0b'],
                                borderColor: ['#fff'],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        aspectRatio: 1.5,
                        cutout: '50%',
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    font: { size: 14 },
                                    padding: 5,
                                    boxWidth: 20,
                                },
                            },
                            title: {
                                display: true,
                                text: 'Task Status Distribution',
                                font: { size: 16 },
                                padding: { top: 5, bottom: 5 },
                            },
                            tooltip: {
                                enabled: true,
                                callbacks: {
                                    label: (context) => {
                                        const label = context.label || '';
                                        const value = context.parsed || 0;
                                        const total = context.dataset.data.reduce(
                                            (a: number, b: number) => a + b,
                                            0
                                        );
                                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                        return `${label}: ${value} (${percentage}%)`;
                                    },
                                },
                            },
                        },
                    },
                });
            }
        }

        // Cleanup on unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [stats]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 bg-sidebar">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <Card className="bg-purple-200">
                        <CardHeader>
                            <CardTitle className="text-gray-800 text-xl">Pending Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-yellow-200">
                        <CardHeader>
                            <CardTitle className="text-gray-800 text-xl">On Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-800">{stats.on_progress}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-200">
                        <CardHeader>
                            <CardTitle className="text-gray-800 text-xl">Completed Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-800">{stats.done}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-200">
                        <CardHeader>
                            <CardTitle className="text-gray-800 text-xl">Overdue Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-800">{stats.overdue}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart and Recent Tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Task Distribution Chart */}
                    <Card className="bg-chart-2/20">
                        <CardHeader>
                            <CardTitle className="text-xl">Visual Distribution of Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats.pending + stats.done + stats.overdue + stats.on_progress > 0 ? (
                                <canvas ref={chartRef} className="w-full h-48"></canvas>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No task data available for chart.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Tasks */}
                    <Card className="bg-chart-2/20">
                        <CardHeader className="flex items-center">
                            <div className="flex justify-between gap-4 w-full">
                                <CardTitle className="text-xl">Recent Tasks</CardTitle>
                                <Link
                                    href="/assignee"
                                    className="text-blue-600 hover:underline text-sm font-medium"
                                >
                                    View All Tasks
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentTasks.length > 0 ? (
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg overflow-hidden">
                                    <thead className="text-xs text-gray-700 uppercase bg-chart-2/20 dark:bg-gray-700 dark:text-gray-400 rounded-t-lg">
                                        <tr>
                                            <th className="px-6 py-3">Title</th>
                                            <th className="px-6 py-3">{isAdmin ? 'Assignee' : 'Description'}</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Due Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTasks.map((task, index) => (
                                            <tr
                                                key={task.id}
                                                className={`border-b dark:border-gray-700 ${
                                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                } dark:bg-gray-800`}
                                            >
                                                <td className="px-6 py-4">{task.title}</td>
                                                <td className="px-6 py-4">
                                                    {isAdmin
                                                        ? task.assignee || 'Unknown'
                                                        : task.description || 'No description'}
                                                </td>
                                                <td className="px-6 py-4 capitalize">{task.status}</td>
                                                <td className="px-6 py-4">
                                                    {task.due_date_time
                                                        ? new Date(task.due_date_time).toLocaleDateString()
                                                        : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No recent tasks available.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}