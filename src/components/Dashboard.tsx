import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TodoBoard } from "@/components/TodoBoard";
import { NotesEditor } from "@/components/NotesEditor";
import { HabitTracker } from "@/components/HabitTracker";
import { CheckSquare, FileText, Target, Clock, Plus, Bell, Home } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Dashboard = () => {
  const [activeView, setActiveView] = useState<"overview" | "todos" | "notes" | "habits">("overview");
  
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const navigationItems = [
    { id: "overview", label: "Home", icon: Home },
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

  const quickStats = [
    { label: "Today's Tasks", value: "12", trend: "+3", icon: CheckSquare, color: "text-primary" },
    { label: "Streak", value: "7", trend: "days", icon: Target, color: "text-success" },
    { label: "Focus Time", value: "4.2h", trend: "today", icon: Clock, color: "text-info" },
  ];

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You've been signed out of your account.",
      });
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const renderOverviewDashboard = () => (
    <div className="flex-1 px-4 pt-6 pb-20 space-y-6 max-w-md mx-auto">
      {/* Mobile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning</h1>
          <p className="text-sm text-muted-foreground">Let's be productive today!</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2" onClick={handleSignOut}>
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {user?.email ? getInitials(user.email) : 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="space-y-3">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-accent/20`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Weekly Progress Chart */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Weekly Progress</h3>
          <Badge variant="outline" className="text-xs">7 days</Badge>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyProgress}>
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Line 
              type="monotone" 
              dataKey="tasks" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="habits" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center space-x-4 mt-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-xs text-muted-foreground">Tasks</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span className="text-xs text-muted-foreground">Habits</span>
          </div>
        </div>
      </Card>

      {/* Task Distribution */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Today's Tasks</h3>
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={taskDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={60}
              strokeWidth={2}
            >
              {taskDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {taskDistribution.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs text-muted-foreground block">{item.name}</span>
              <span className="text-sm font-medium text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: '500ms' }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => setActiveView("todos")} 
            className="h-16 flex-col space-y-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 transition-all duration-200 active:scale-95"
            variant="outline"
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-xs font-medium">Add Task</span>
          </Button>
          
          <Button 
            onClick={() => setActiveView("notes")} 
            className="h-16 flex-col space-y-2 bg-info/10 text-info hover:bg-info/20 border-info/20 transition-all duration-200 active:scale-95"
            variant="outline"
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs font-medium">New Note</span>
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case "todos":
        return (
          <div className="flex-1 px-4 pt-6 pb-20 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
              <Button size="sm" className="px-3">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            <TodoBoard />
          </div>
        );
      case "notes":
        return (
          <div className="flex-1 px-4 pt-6 pb-20 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground">Notes</h1>
              <Button size="sm" className="px-3">
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>
            <NotesEditor />
          </div>
        );
      case "habits":
        return (
          <div className="flex-1 px-4 pt-6 pb-20 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground">Habits</h1>
              <Button size="sm" className="px-3">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            <HabitTracker />
          </div>
        );
      default:
        return renderOverviewDashboard();
    }
  };

  // Mobile-first navigation component
  const MobileBottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/50 z-50 safe-area-pb">
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive
                  ? "text-primary transform scale-110"
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              }`}
            >
              <div className={`relative ${isActive ? "animate-pulse" : ""}`}>
                <Icon className="w-5 h-5" />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping" />
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Desktop fallback - simple layout for larger screens
  const DesktopNavigation = () => (
    <div className="hidden lg:block">
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Productivity Mobile
        </h1>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <Avatar className="w-6 h-6 mr-2">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {user?.email ? getInitials(user.email) : 'U'}
              </AvatarFallback>
            </Avatar>
            Sign Out
          </Button>
        </div>
      </div>
      <div className="flex justify-center p-4">
        <div className="flex space-x-2 bg-accent/20 p-1 rounded-lg">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeView === item.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DesktopNavigation />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:mx-auto lg:max-w-md">
        {renderActiveView()}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation />
    </div>
  );
};