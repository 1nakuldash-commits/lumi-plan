import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Circle, Clock, CheckCircle, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as Todo["status"];
    updateTodoStatus(draggableId, newStatus);
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-6">
        {/* Add new todo */}
        <Card className="p-4 bg-card shadow-card border-border animate-fade-in">
          <div className="flex space-x-2">
            <Input
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              className="flex-1 bg-input border-border text-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            <Button onClick={addTodo} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </Card>

        {/* Todo columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column, columnIndex) => (
            <Card key={column.id} className="bg-card shadow-card border-border animate-fade-in" style={{ animationDelay: `${columnIndex * 100}ms` }}>
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge className={`${getStatusBadge(column.status)} transition-all duration-200 animate-scale-in`}>
                    {column.count}
                  </Badge>
                </div>
              </div>
              
              <Droppable droppableId={column.status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 space-y-3 min-h-[400px] transition-all duration-300 ${
                      snapshot.isDraggingOver 
                        ? "bg-primary/5 border-primary/20 border-2 border-dashed" 
                        : ""
                    }`}
                  >
                    {filterTodosByStatus(column.status).map((todo, index) => (
                      <Draggable key={todo.id} draggableId={todo.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`group p-3 bg-secondary rounded-lg border border-border transition-all duration-200 cursor-grab active:cursor-grabbing ${
                              snapshot.isDragging 
                                ? "shadow-2xl scale-105 rotate-2 bg-card border-primary/30" 
                                : "hover:shadow-hover hover:scale-[1.02] hover:-translate-y-0.5"
                            }`}
                            style={provided.draggableProps.style}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-2 flex-1">
                                <div {...provided.dragHandleProps} className="mt-0.5 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
                                  <GripVertical className="w-3 h-3 text-muted-foreground" />
                                </div>
                                {getStatusIcon(todo.status)}
                                <span className={`text-sm transition-all duration-200 ${
                                  todo.status === "completed" 
                                    ? "line-through text-muted-foreground" 
                                    : "text-foreground"
                                }`}>
                                  {todo.title}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-1 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                              {todo.status !== "pending" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateTodoStatus(todo.id, "pending")}
                                  className="h-6 px-2 text-xs hover:bg-warning/10 hover:text-warning transition-all duration-200 hover:scale-105"
                                >
                                  Pending
                                </Button>
                              )}
                              {todo.status !== "progress" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateTodoStatus(todo.id, "progress")}
                                  className="h-6 px-2 text-xs hover:bg-info/10 hover:text-info transition-all duration-200 hover:scale-105"
                                >
                                  Progress
                                </Button>
                              )}
                              {todo.status !== "completed" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateTodoStatus(todo.id, "completed")}
                                  className="h-6 px-2 text-xs hover:bg-success/10 hover:text-success transition-all duration-200 hover:scale-105"
                                >
                                  Done
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {filterTodosByStatus(column.status).length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Circle className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">No tasks yet</p>
                        <p className="text-xs">Drag tasks here or create new ones</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </Card>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};