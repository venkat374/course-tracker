import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import TopNavLayout from "@/components/layout/TopNavLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { BookOpen, CheckCircle2, Clock, Flame } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import Badges from "@/components/dashboard/Badges";

interface DashboardStats {
    totalCourses: number;
    inProgress: number;
    completed: number;
    streak: number;
    totalFocusMinutes: number;
}

interface ChartData {
    name: string;
    minutes: number;
    sessions: number;
}

interface Activity {
    id: string;
    courseName: string;
    action: string;
    time: string;
}

const Dashboard = () => {
    const { authToken } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalCourses: 0,
        inProgress: 0,
        completed: 0,
        streak: 0,
        totalFocusMinutes: 0,
    });
    const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
    const [dailyTrend, setDailyTrend] = useState<ChartData[]>([]);
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [sessionHistory, setSessionHistory] = useState<any[]>([]);
    const [badges, setBadges] = useState<any[]>([]);
    const [platformStats, setPlatformStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            if (!authToken) return;
            try {
                // Fetch Courses
                const coursesRes = await axios.get(`${backendUrl}/courses`, {
                    headers: { "x-auth-token": authToken },
                });
                const courses = coursesRes.data;

                // Fetch User Stats (Streak & Focus Time)
                const statsRes = await axios.get(`${backendUrl}/auth/stats`, {
                    headers: { "x-auth-token": authToken },
                });
                const userStats = statsRes.data;

                // Fetch Analytics (Badges & Platform Stats)
                const analyticsRes = await axios.get(`${backendUrl}/analytics`, {
                    headers: { "x-auth-token": authToken },
                });
                setBadges(analyticsRes.data.badges || []);
                setPlatformStats(analyticsRes.data.platformStats || []);

                // 1. Calculate Stats
                const total = courses.length;
                const completed = courses.filter((c: any) => c.status === "Completed").length;
                const inProgress = courses.filter((c: any) => c.status === "Ongoing").length;

                setStats({
                    totalCourses: total,
                    inProgress,
                    completed,
                    streak: userStats.streak || 0,
                    totalFocusMinutes: userStats.totalFocusMinutes || 0,
                });

                // 2. Process Focus History
                const history = userStats.focusHistory || [];
                // Sort by date ascending for charts
                history.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

                // Weekly Bar Chart (Last 7 Days)
                const days = [];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split('T')[0];
                    const found = history.find((h: any) => h.date === dateStr);
                    days.push({
                        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                        minutes: found ? found.minutes : 0,
                        sessions: found ? found.sessions || 0 : 0
                    });
                }
                setWeeklyData(days);

                // Daily Trend (All available history or last 30 days)
                const trendData = history.slice(-30).map((h: any) => ({
                    name: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    minutes: h.minutes,
                    sessions: h.sessions || 0
                }));
                setDailyTrend(trendData);

                // Session History (Reverse chronological)
                setSessionHistory([...history].reverse());

                // 3. Generate Recent Activity (Simplified)
                const sortedCourses = [...courses].sort((a: any, b: any) => {
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                }).slice(0, 5);

                const activities = sortedCourses.map((c: any) => ({
                    id: c._id,
                    courseName: c.courseName,
                    action: c.status === "Completed" ? "Completed" : "Updated",
                    time: new Date(c.updatedAt).toLocaleDateString(),
                }));

                setRecentActivity(activities);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [authToken]);

    return (
        <TopNavLayout>
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>

                {/* Badges Section */}
                <div className="mb-6">
                    <Badges badges={badges} />
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalCourses}</div>
                                    <p className="text-xs text-muted-foreground">All time</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.inProgress}</div>
                                    <p className="text-xs text-muted-foreground">Active learning</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.completed}</div>
                                    <p className="text-xs text-muted-foreground">Finished courses</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                                    <Flame className="h-4 w-4 text-orange-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.streak} Days</div>
                                    <p className="text-xs text-muted-foreground">Keep it up!</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Weekly Study Time</CardTitle>
                                    <CardDescription>Minutes studied per day (Last 7 Days)</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={weeklyData}>
                                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `${value}m`}
                                                domain={[0, (dataMax: number) => Math.max(dataMax, 60)]}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
                                                cursor={{ fill: 'hsl(var(--muted))' }}
                                            />
                                            <Bar dataKey="minutes" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Latest course updates</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RecentActivity activities={recentActivity} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Study Trends</CardTitle>
                                    <CardDescription>Daily study minutes over time</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <LineChart data={dailyTrend}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}m`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
                                            />
                                            <Line type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Platform Distribution</CardTitle>
                                    <CardDescription>Courses by platform</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <PieChart>
                                            <Pie
                                                data={platformStats}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="count"
                                                nameKey="_id"
                                                label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {platformStats.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </TopNavLayout>
    );
};

export default Dashboard;
