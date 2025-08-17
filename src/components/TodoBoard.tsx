import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Circle, Clock, CheckCircle, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Todo {
  id: string;
  title: string;
  status: "pending" | "progress" | "completed";
  createdAt: Date;
}

export const TodoBoard = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTodos(data.map(todo => ({
        ...todo,
        status: todo.status as Todo["status"],
        createdAt: new Date(todo.created_at)
      })));
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() && user) {
      try {
        const { data, error } = await supabase
          .from('todos')
          .insert([{
            title: newTodo,
            status: "pending",
            user_id: user.id
          }])
          .select()
          .single();

        if (error) throw error;

        setTodos([{
          ...data,
          status: data.status as Todo["status"],
          createdAt: new Date(data.created_at)
        }, ...todos]);
        setNewTodo("");
        
        toast({
          title: "Success",
          description: "Todo added successfully",
        });
      } catch (error) {
        console.error('Error adding todo:', error);
        toast({
          title: "Error",
          description: "Failed to add todo",
          variant: "destructive",
        });
      }
    }
  };

  const updateTodoStatus = async (id: string, status: Todo["status"]) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.map(todo => todo.id === id ? { ...todo, status } : todo));
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
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

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Card className="p-4 bg-card shadow-card border-border">
          <div className="text-center">Loading todos...</div>
        </Card>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4 md:space-y-6">
        {/* Add new todo */}
        <Card className="p-3 md:p-4 bg-card shadow-card border-border animate-fade-in">
          <div className="flex flex-col md:flex-row gap-2 md:gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              className="flex-1 bg-input border-border text-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            <Button onClick={addTodo} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </Card>

        {/* Todo columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {columns.map((column, columnIndex) => (
            <Card key={column.id} className="bg-card shadow-card border-border animate-fade-in" style={{ animationDelay: `${columnIndex * 100}ms` }}>
              <div className="p-3 md:p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm md:text-base font-semibold text-foreground">{column.title}</h3>
                  <Badge className={`${getStatusBadge(column.status)} transition-all duration-200 animate-scale-in text-xs`}>
                    {column.count}
                  </Badge>
                </div>
              </div>
              
              <Droppable droppableId={column.status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-3 md:p-4 space-y-2 md:space-y-3 min-h-[300px] md:min-h-[400px] transition-all duration-300 ${
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
                            className={`group p-3 bg-secondary rounded-lg border border-border transition-all duration-200 cursor-grab active:cursor-grabbing touch-manipulation ${
                              snapshot.isDragging 
                                ? "shadow-2xl scale-105 rotate-2 bg-card border-primary/30" 
                                : "hover:shadow-hover hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95"
                            }`}
                            style={provided.draggableProps.style}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-2 flex-1 min-w-0">
                                <div {...provided.dragHandleProps} className="mt-0.5 opacity-60 md:opacity-0 md:group-hover:opacity-60 transition-opacity duration-200 shrink-0">
                                  <GripVertical className="w-3 h-3 text-muted-foreground" />
                                </div>
                                <div className="shrink-0 mt-0.5">
                                  {getStatusIcon(todo.status)}
                                </div>
                                <span className={`text-xs md:text-sm transition-all duration-200 break-words ${
                                  todo.status === "completed" 
                                    ? "line-through text-muted-foreground" 
                                    : "text-foreground"
                                }`}>
                                  {todo.title}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mt-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 md:translate-y-1 md:group-hover:translate-y-0">
                              {todo.status !== "pending" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateTodoStatus(todo.id, "pending")}
                                  className="h-6 px-2 text-xs hover:bg-warning/10 hover:text-warning transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                  Pending
                                </Button>
                              )}
                              {todo.status !== "progress" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateTodoStatus(todo.id, "progress")}
                                  className="h-6 px-2 text-xs hover:bg-info/10 hover:text-info transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                  Progress
                                </Button>
                              )}
                              {todo.status !== "completed" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateTodoStatus(todo.id, "completed")}
                                  className="h-6 px-2 text-xs hover:bg-success/10 hover:text-success transition-all duration-200 hover:scale-105 active:scale-95"
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
                      <div className="flex flex-col items-center justify-center py-8 md:py-12 text-muted-foreground">
                        <Circle className="w-6 h-6 md:w-8 md:h-8 mb-2 opacity-50" />
                        <p className="text-xs md:text-sm text-center">No tasks yet</p>
                        <p className="text-xs text-center">Drag tasks here or create new ones</p>
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