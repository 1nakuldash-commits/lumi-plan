import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit3, Save, Calendar, X, Tag } from "lucide-react";

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
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Project Ideas",
      content: "• Build a productivity app with notion-like interface\n• Create a habit tracker with streaks\n• Develop a note-taking system with tags",
      tags: ["ideas", "projects"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Meeting Notes",
      content: "Discussed the Q4 roadmap:\n- Focus on user experience improvements\n- Implement real-time collaboration features\n- Optimize performance for mobile devices",
      tags: ["meetings", "work"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "Weekly Review",
      content: "This week's achievements:\n✅ Completed the authentication system\n✅ Fixed 5 critical bugs\n✅ Improved page load times by 30%\n\nNext week's goals:\n• Launch beta version\n• Gather user feedback\n• Plan next iteration",
      tags: ["review", "goals"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setEditTitle("Untitled Note");
    setEditContent("");
    setEditTags([]);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (selectedNote) {
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