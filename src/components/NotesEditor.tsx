import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit3, Save, Calendar, X, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PREDEFINED_TAGS = ["review", "goals", "meeting", "work", "ideas", "projects", "personal", "urgent"];

export const NotesEditor = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setNotes(data.map(note => ({
        ...note,
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at)
      })));
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewNote = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          title: "Untitled Note",
          content: "",
          tags: [],
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const newNote: Note = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      setEditTitle("Untitled Note");
      setEditContent("");
      setEditTags([]);
      setIsEditing(true);
      
      toast({
        title: "Success",
        description: "Note created successfully",
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    }
  };

  const saveNote = async () => {
    if (selectedNote) {
      try {
        const { error } = await supabase
          .from('notes')
          .update({
            title: editTitle,
            content: editContent,
            tags: editTags
          })
          .eq('id', selectedNote.id);

        if (error) throw error;

        const updatedNote = { 
          ...selectedNote, 
          title: editTitle, 
          content: editContent, 
          tags: editTags,
          updatedAt: new Date() 
        };
        
        setNotes(notes.map(note => 
          note.id === selectedNote.id ? updatedNote : note
        ));
        setSelectedNote(updatedNote);
        setIsEditing(false);
        
        toast({
          title: "Success",
          description: "Note saved successfully",
        });
      } catch (error) {
        console.error('Error saving note:', error);
        toast({
          title: "Error",
          description: "Failed to save note",
          variant: "destructive",
        });
      }
    }
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags);
    setIsEditing(false);
  };

  const addTag = (tag: string) => {
    if (tag && !editTags.includes(tag)) {
      setEditTags([...editTags, tag]);
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Card className="p-4 bg-card shadow-card border-border">
          <div className="text-center">Loading notes...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-[calc(100vh-160px)] md:h-[calc(100vh-200px)]">
      {/* Notes List */}
      <Card className="bg-card shadow-card border-border overflow-hidden lg:h-full">
        <div className="p-3 md:p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-semibold text-foreground">Notes</h3>
            <Button 
              size="sm" 
              onClick={createNewNote}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs md:text-sm px-2 md:px-3"
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              New
            </Button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-60 lg:max-h-[calc(100vh-300px)]">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => selectNote(note)}
              className={`p-3 md:p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors duration-200 touch-manipulation ${
                selectedNote?.id === note.id ? "bg-accent" : ""
              }`}
            >
              <h4 className="text-sm md:text-base font-medium text-foreground truncate">{note.title}</h4>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                {note.content || "No content"}
              </p>
              <div className="flex items-center justify-between mt-2 md:mt-3">
                <div className="flex gap-1 flex-wrap">
                  {note.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {note.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">+{note.tags.length - 2}</Badge>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="hidden md:inline">{formatDate(note.updatedAt)}</span>
                  <span className="md:hidden">{formatDate(note.updatedAt).split(',')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Editor */}
      <div className="lg:col-span-2">
        {selectedNote ? (
          <Card className="bg-card shadow-card border-border h-full flex flex-col">
            <div className="p-3 md:p-4 border-b border-border">
              <div className="flex items-center justify-between gap-2">
                {isEditing ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-base md:text-lg font-semibold bg-transparent border-none p-0 h-auto focus:ring-0 flex-1"
                    placeholder="Note title..."
                  />
                ) : (
                  <h3 className="text-base md:text-lg font-semibold text-foreground truncate flex-1">{selectedNote.title}</h3>
                )}
                <div className="flex space-x-2">
                  {isEditing ? (
                    <Button size="sm" onClick={saveNote} className="bg-success text-success-foreground hover:bg-success/90 text-xs md:text-sm">
                      <Save className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      <span className="hidden md:inline">Save</span>
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      className="border-border text-foreground hover:bg-accent text-xs md:text-sm"
                    >
                      <Edit3 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      <span className="hidden md:inline">Edit</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-3 md:p-4">
              {isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Start writing your note..."
                  className="min-h-[300px] md:min-h-[400px] bg-transparent border-none p-0 resize-none focus:ring-0 text-foreground text-sm md:text-base"
                />
              ) : (
                <div className="min-h-[300px] md:min-h-[400px]">
                  <pre className="whitespace-pre-wrap text-foreground font-sans text-sm md:text-base">
                    {selectedNote.content || "This note is empty. Click Edit to add content."}
                  </pre>
                </div>
              )}
            </div>
            
            <div className="p-3 md:p-4 border-t border-border">
              {isEditing ? (
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                    <span className="text-xs md:text-sm font-medium text-foreground">Tags</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 md:gap-2 mb-3">
                    {editTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs">
                        {tag}
                        <X 
                          className="w-2 h-2 md:w-3 md:h-3 cursor-pointer hover:text-destructive" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-2">
                    <Select onValueChange={addTag}>
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Add tag..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PREDEFINED_TAGS.filter(tag => !editTags.includes(tag)).map(tag => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex gap-1">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Custom tag..."
                        className="flex-1 md:w-32"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag(newTag);
                          }
                        }}
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => addTag(newTag)}
                        disabled={!newTag || editTags.includes(newTag)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex gap-1 md:gap-2 flex-wrap">
                    {selectedNote.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Updated {formatDate(selectedNote.updatedAt)}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card className="bg-card shadow-card border-border h-full flex items-center justify-center min-h-[400px]">
            <div className="text-center p-4">
              <Edit3 className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-foreground mb-2">No note selected</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">Choose a note from the list or create a new one</p>
              <Button onClick={createNewNote} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm md:text-base">
                <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Create New Note
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};