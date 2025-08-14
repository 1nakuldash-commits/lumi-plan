import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TodoBoard } from "@/components/TodoBoard";
import { NotesEditor } from "@/components/NotesEditor";
import { HabitTracker } from "@/components/HabitTracker";
import { CheckSquare, FileText, Target, BarChart3 } from "lucide-react";

export const Dashboard = () => {
  const [activeView, setActiveView] = useState<"overview" | "todos" | "notes" | "habits">("overview");

  const navigationItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "todos", label: "Tasks", icon: CheckSquare },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "habits", label: "Habits", icon: Target },
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case "todos":
        return <TodoBoard />;
      case "notes":
        return <NotesEditor />;
      case "habits":
        return <HabitTracker />;
      default:
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 bg-card shadow-card border-border hover:shadow-hover transition-all duration-300">
              <h3 className="font-semibold mb-4 text-foreground">Quick Tasks</h3>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">3 tasks pending</div>
                <div className="text-sm text-muted-foreground">2 in progress</div>
                <div className="text-sm text-muted-foreground">5 completed today</div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card shadow-card border-border hover:shadow-hover transition-all duration-300">
              <h3 className="font-semibold mb-4 text-foreground">Habit Progress</h3>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">7 day streak 🔥</div>
                <div className="text-sm text-muted-foreground">4/5 habits completed</div>
                <div className="text-sm text-muted-foreground">80% completion rate</div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card shadow-card border-border hover:shadow-hover transition-all duration-300 md:col-span-2">
              <h3 className="font-semibold mb-4 text-foreground">Recent Notes</h3>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Meeting Notes - 2 hours ago</div>
                <div className="text-sm text-muted-foreground">Project Ideas - Yesterday</div>
                <div className="text-sm text-muted-foreground">Weekly Review - 3 days ago</div>
              </div>
            </Card>
          </div>
        );
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