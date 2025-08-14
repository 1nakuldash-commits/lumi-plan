import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Save, Calendar } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

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
    setIsEditing(true);
  };

  const saveNote = () => {
    if (selectedNote) {
      setNotes(notes.map(note => 
        note.id === selectedNote.id 
          ? { ...note, title: editTitle, content: editContent, updatedAt: new Date() }
          : note
      ));
      setSelectedNote({ ...selectedNote, title: editTitle, content: editContent });
      setIsEditing(false);
    }
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Notes List */}
      <Card className="bg-card shadow-card border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notes</h3>
            <Button 
              size="sm" 
              onClick={createNewNote}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => selectNote(note)}
              className={`p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors duration-200 ${
                selectedNote?.id === note.id ? "bg-accent" : ""
              }`}
            >
              <h4 className="font-medium text-foreground truncate">{note.title}</h4>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {note.content || "No content"}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(note.updatedAt)}
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
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-lg font-semibold bg-transparent border-none p-0 h-auto focus:ring-0"
                    placeholder="Note title..."
                  />
                ) : (
                  <h3 className="text-lg font-semibold text-foreground">{selectedNote.title}</h3>
                )}
                <div className="flex space-x-2">
                  {isEditing ? (
                    <Button size="sm" onClick={saveNote} className="bg-success text-success-foreground hover:bg-success/90">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      className="border-border text-foreground hover:bg-accent"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4">
              {isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Start writing your note..."
                  className="min-h-[400px] bg-transparent border-none p-0 resize-none focus:ring-0 text-foreground"
                />
              ) : (
                <div className="min-h-[400px]">
                  <pre className="whitespace-pre-wrap text-foreground font-sans">
                    {selectedNote.content || "This note is empty. Click Edit to add content."}
                  </pre>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {selectedNote.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Updated {formatDate(selectedNote.updatedAt)}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="bg-card shadow-card border-border h-full flex items-center justify-center">
            <div className="text-center">
              <Edit3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No note selected</h3>
              <p className="text-muted-foreground mb-4">Choose a note from the sidebar or create a new one</p>
              <Button onClick={createNewNote} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create New Note
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};