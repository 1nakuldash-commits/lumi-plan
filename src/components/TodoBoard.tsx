import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Circle, Clock, CheckCircle } from "lucide-react";

interface Todo {
  id: string;
  title: string;
  status: "pending" | "progress" | "completed";
  createdAt: Date;
}

export const TodoBoard = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", title: "Review project proposal", status: "pending", createdAt: new Date() },
    { id: "2", title: "Update portfolio website", status: "progress", createdAt: new Date() },
    { id: "3", title: "Morning workout", status: "completed", createdAt: new Date() },
    { id: "4", title: "Call client about requirements", status: "pending", createdAt: new Date() },
    { id: "5", title: "Fix bug in authentication", status: "progress", createdAt: new Date() },
    { id: "6", title: "Read 30 minutes", status: "completed", createdAt: new Date() },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          title: newTodo,
          status: "pending",
          createdAt: new Date(),
        },
      ]);
      setNewTodo("");
    }
  };

  const updateTodoStatus = (id: string, status: Todo["status"]) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, status } : todo));
  };

  const getStatusIcon = (status: Todo["status"]) => {
    switch (status) {
      case "pending": return <Circle className="w-4 h-4 text-status-pending" />;
      case "progress": return <Clock className="w-4 h-4 text-status-progress" />;
      case "completed": return <CheckCircle className="w-4 h-4 text-status-completed" />;
    }
  };

  const getStatusBadge = (status: Todo["status"]) => {
    const variants = {
      pending: "bg-warning/10 text-warning hover:bg-warning/20",
      progress: "bg-info/10 text-info hover:bg-info/20",
      completed: "bg-success/10 text-success hover:bg-success/20",
    };
    return variants[status];
  };

  const filterTodosByStatus = (status: Todo["status"]) => 
    todos.filter(todo => todo.status === status);

  const columns = [
    { id: "pending", title: "Pending", status: "pending" as const, count: filterTodosByStatus("pending").length },
    { id: "progress", title: "In Progress", status: "progress" as const, count: filterTodosByStatus("progress").length },
    { id: "completed", title: "Completed", status: "completed" as const, count: filterTodosByStatus("completed").length },
  ];

  return (
    <div className="space-y-6">
      {/* Add new todo */}
      <Card className="p-4 bg-card shadow-card border-border">
        <div className="flex space-x-2">
          <Input
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            className="flex-1 bg-input border-border text-foreground"
          />
          <Button onClick={addTodo} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </Card>

      {/* Todo columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <Card key={column.id} className="bg-card shadow-card border-border">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <Badge className={getStatusBadge(column.status)}>
                  {column.count}
                </Badge>
              </div>
            </div>
            
            <div className="p-4 space-y-3 min-h-[400px]">
              {filterTodosByStatus(column.status).map(todo => (
                <div
                  key={todo.id}
                  className="group p-3 bg-secondary rounded-lg border border-border hover:shadow-hover transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                      {getStatusIcon(todo.status)}
                      <span className={`text-sm ${
                        todo.status === "completed" 
                          ? "line-through text-muted-foreground" 
                          : "text-foreground"
                      }`}>
                        {todo.title}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {todo.status !== "pending" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateTodoStatus(todo.id, "pending")}
                        className="h-6 px-2 text-xs hover:bg-warning/10 hover:text-warning"
                      >
                        Pending
                      </Button>
                    )}
                    {todo.status !== "progress" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateTodoStatus(todo.id, "progress")}
                        className="h-6 px-2 text-xs hover:bg-info/10 hover:text-info"
                      >
                        Progress
                      </Button>
                    )}
                    {todo.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateTodoStatus(todo.id, "completed")}
                        className="h-6 px-2 text-xs hover:bg-success/10 hover:text-success"
                      >
                        Done
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};