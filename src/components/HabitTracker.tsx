import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Flame, CheckCircle2, Circle, Target } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  totalDays: number;
  completedDays: number;
  color: string;
}

export const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      name: "Morning Workout",
      streak: 7,
      completedToday: true,
      totalDays: 30,
      completedDays: 25,
      color: "success",
    },
    {
      id: "2",
      name: "Read for 30 minutes",
      streak: 5,
      completedToday: true,
      totalDays: 30,
      completedDays: 22,
      color: "info",
    },
    {
      id: "3",
      name: "Drink 8 glasses of water",
      streak: 3,
      completedToday: false,
      totalDays: 30,
      completedDays: 18,
      color: "primary",
    },
    {
      id: "4",
      name: "Meditate",
      streak: 12,
      completedToday: true,
      totalDays: 30,
      completedDays: 28,
      color: "warning",
    },
  ]);
  const [newHabit, setNewHabit] = useState("");

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([
        ...habits,
        {
          id: Date.now().toString(),
          name: newHabit,
          streak: 0,
          completedToday: false,
          totalDays: 0,
          completedDays: 0,
          color: "primary",
        },
      ]);
      setNewHabit("");
    }
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCompletedToday = !habit.completedToday;
        return {
          ...habit,
          completedToday: newCompletedToday,
          streak: newCompletedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1),
          completedDays: newCompletedToday ? habit.completedDays + 1 : Math.max(0, habit.completedDays - 1),
          totalDays: Math.max(habit.totalDays, habit.completedDays + (newCompletedToday ? 1 : 0)),
        };
      }
      return habit;
    }));
  };

  const getCompletionPercentage = (habit: Habit) => {
    return habit.totalDays > 0 ? (habit.completedDays / habit.totalDays) * 100 : 0;
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 7) return "🔥";
    if (streak >= 3) return "⚡";
    return "💪";
  };

  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const averageStreak = habits.length > 0 ? habits.reduce((sum, h) => sum + h.streak, 0) / habits.length : 0;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Card className="p-3 md:p-4 bg-card shadow-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Today's Progress</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{completedToday}/{totalHabits}</p>
            </div>
            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-success" />
          </div>
        </Card>
        
        <Card className="p-3 md:p-4 bg-card shadow-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Average Streak</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{Math.round(averageStreak)} days</p>
            </div>
            <Flame className="w-6 h-6 md:w-8 md:h-8 text-warning" />
          </div>
        </Card>
        
        <Card className="p-3 md:p-4 bg-card shadow-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0}%
              </p>
            </div>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Add new habit */}
      <Card className="p-3 md:p-4 bg-card shadow-card border-border">
        <div className="flex flex-col md:flex-row gap-2 md:gap-2">
          <Input
            placeholder="Add a new habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addHabit()}
            className="flex-1 bg-input border-border text-foreground"
          />
          <Button onClick={addHabit} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </Button>
        </div>
      </Card>

      {/* Habits List */}
      <div className="grid gap-3 md:gap-4">
        {habits.map(habit => (
          <Card key={habit.id} className="p-4 md:p-6 bg-card shadow-card border-border hover:shadow-hover transition-all duration-200 touch-manipulation">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                <Button
                  size="sm"
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full p-0 shrink-0 ${
                    habit.completedToday
                      ? "bg-success text-success-foreground hover:bg-success/90"
                      : "bg-secondary border-2 border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {habit.completedToday ? (
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <Circle className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </Button>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-medium text-foreground truncate">
                    {habit.name}
                  </h3>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-base md:text-lg">{getStreakIcon(habit.streak)}</span>
                      <span className="text-xs md:text-sm text-muted-foreground">
                        {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex-1 md:max-w-xs">
                      <div className="flex justify-between text-xs md:text-sm text-muted-foreground mb-1">
                        <span>{habit.completedDays}/{habit.totalDays}</span>
                        <span>{Math.round(getCompletionPercentage(habit))}%</span>
                      </div>
                      <Progress 
                        value={getCompletionPercentage(habit)} 
                        className="h-1.5 md:h-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Badge 
                className={`text-xs shrink-0 ${
                  habit.completedToday 
                    ? "bg-success/10 text-success" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {habit.completedToday ? "Done" : "Pending"}
              </Badge>
            </div>
          </Card>
        ))}
        
        {habits.length === 0 && (
          <Card className="p-6 md:p-8 bg-card shadow-card border-border text-center">
            <div className="text-muted-foreground">
              <Target className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 opacity-50" />
              <h3 className="text-base md:text-lg font-medium mb-2">No habits yet</h3>
              <p className="text-sm md:text-base">Start building better habits by adding your first one above</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};