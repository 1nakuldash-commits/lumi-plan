import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TodoBoard } from "@/components/TodoBoard";
import { NotesEditor } from "@/components/NotesEditor";
import { HabitTracker } from "@/components/HabitTracker";
import { CheckSquare, FileText, Target, BarChart3, TrendingUp, Clock, MessageSquare, Zap, Calendar, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Dashboard = () => {
  const [activeView, setActiveView] = useState<"overview" | "todos" | "notes" | "habits">("overview");
  const [chatMessage, setChatMessage] = useState("");

  const navigationItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "todos", label: "Tasks", icon: CheckSquare },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "habits", label: "Habits", icon: Target },
  ];

  // Mock data for charts and tracking
  const weeklyProgress = [
    { day: 'Mon', tasks: 8, habits: 4 },
    { day: 'Tue', tasks: 12, habits: 5 },
    { day: 'Wed', tasks: 6, habits: 3 },
    { day: 'Thu', tasks: 15, habits: 5 },
    { day: 'Fri', tasks: 10, habits: 4 },
    { day: 'Sat', tasks: 4, habits: 2 },
    { day: 'Sun', tasks: 7, habits: 3 },
  ];

  const taskDistribution = [
    { name: 'Completed', value: 65, color: 'hsl(var(--success))' },
    { name: 'In Progress', value: 25, color: 'hsl(var(--info))' },
    { name: 'Pending', value: 10, color: 'hsl(var(--warning))' },
  ];

  const recentActivity = [
    { id: 1, type: 'task', message: 'Completed "Review project proposal"', time: '2 min ago', icon: CheckSquare },
    { id: 2, type: 'habit', message: 'Logged morning workout habit', time: '1 hour ago', icon: Target },
    { id: 3, type: 'note', message: 'Created new note "Meeting insights"', time: '3 hours ago', icon: FileText },
    { id: 4, type: 'task', message: 'Started working on "Fix authentication bug"', time: '5 hours ago', icon: Clock },
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // This would typically integrate with a real chat system
      console.log('Sending message:', chatMessage);
      setChatMessage("");
    }
  };

  const renderOverviewDashboard = () => (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-card shadow-card border-border hover:shadow-hover transition-all duration-300 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tasks Today</p>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +20% from yesterday
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <CheckSquare className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card shadow-card border-border hover:shadow-hover transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Habit Streak</p>
              <p className="text-2xl font-bold text-foreground">7 days</p>
              <p className="text-xs text-info flex items-center mt-1">
                <Zap className="w-3 h-3 mr-1" />
                Keep it up!
              </p>
            </div>
            <div className="p-3 bg-info/10 rounded-full">
              <Target className="w-6 h-6 text-info" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card shadow-card border-border hover:shadow-hover transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Productivity</p>
              <p className="text-2xl font-bold text-foreground">85%</p>
              <p className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Above average
              </p>
            </div>
            <div className="p-3 bg-success/10 rounded-full">
              <BarChart3 className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card shadow-card border-border hover:shadow-hover transition-all duration-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Focus Time</p>
              <p className="text-2xl font-bold text-foreground">4.2h</p>
              <p className="text-xs text-warning flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" />
                This week
              </p>
            </div>
            <div className="p-3 bg-warning/10 rounded-full">
              <Clock className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart */}
        <Card className="lg:col-span-2 p-6 bg-card shadow-card border-border animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Weekly Progress</h3>
            <Badge variant="outline" className="text-xs">Last 7 days</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Line 
                type="monotone" 
                dataKey="tasks" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="habits" 
                stroke="hsl(var(--info))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--info))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm text-muted-foreground">Tasks Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-info"></div>
              <span className="text-sm text-muted-foreground">Habits Tracked</span>
            </div>
          </div>
        </Card>

        {/* Task Distribution */}
        <Card className="p-6 bg-card shadow-card border-border animate-fade-in" style={{ animationDelay: '500ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-6">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={taskDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                strokeWidth={2}
              >
                {taskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {taskDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <Card className="p-6 bg-card shadow-card border-border animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <Badge variant="outline" className="text-xs">Live</Badge>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Actions & Chat */}
        <Card className="p-6 bg-card shadow-card border-border animate-fade-in" style={{ animationDelay: '700ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
              onClick={() => setActiveView("todos")} 
              className="h-auto p-4 flex-col space-y-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 transition-all duration-200 hover:scale-105"
              variant="outline"
            >
              <CheckSquare className="w-5 h-5" />
              <span className="text-xs">Add Task</span>
            </Button>
            
            <Button 
              onClick={() => setActiveView("notes")} 
              className="h-auto p-4 flex-col space-y-2 bg-info/10 text-info hover:bg-info/20 border-info/20 transition-all duration-200 hover:scale-105"
              variant="outline"
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs">New Note</span>
            </Button>
            
            <Button 
              onClick={() => setActiveView("habits")} 
              className="h-auto p-4 flex-col space-y-2 bg-success/10 text-success hover:bg-success/20 border-success/20 transition-all duration-200 hover:scale-105"
              variant="outline"
            >
              <Target className="w-5 h-5" />
              <span className="text-xs">Log Habit</span>
            </Button>
            
            <Button 
              className="h-auto p-4 flex-col space-y-2 bg-warning/10 text-warning hover:bg-warning/20 border-warning/20 transition-all duration-200 hover:scale-105"
              variant="outline"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Schedule</span>
            </Button>
          </div>

          {/* Mini Chat */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-foreground">Quick Notes</h4>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Jot down a quick thought..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 text-sm"
              />
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                className="px-3 transition-all duration-200 hover:scale-105"
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case "todos":
        return <TodoBoard />;
      case "notes":
        return <NotesEditor />;
      case "habits":
        return <HabitTracker />;
      default:
        return renderOverviewDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border p-6 min-h-screen">
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Productivity
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Stay organized & focused</p>
          </div>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeView === item.id
                      ? "bg-primary text-primary-foreground shadow-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground capitalize">
                {activeView}
              </h2>
              <p className="text-muted-foreground mt-2">
                {activeView === "overview" && "Your productivity at a glance"}
                {activeView === "todos" && "Manage your tasks efficiently"}
                {activeView === "notes" && "Capture your thoughts and ideas"}
                {activeView === "habits" && "Build better daily habits"}
              </p>
            </div>
            
            <div className="animate-fade-in">
              {renderActiveView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};