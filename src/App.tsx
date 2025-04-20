import "./App.css";
import { useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
}


const App = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/notes");
        const notes: Note[] = await response.json();
        setNotes(notes);
      } catch (e) {
        console.log(e);
      }
    }
    fetchNotes();
  }, []);

  const handleAddNote = async (e: React.FormEvent) => {
    e?.preventDefault();
    try {
      const response = await fetch("http://localhost:9000/api/notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });
      const newNote: Note = await response.json();
      setNotes([newNote, ...notes]); // update notes array with new note
      setTitle(""); // reset title and content to empty strings
      setContent("");
    } catch (e) {
      console.log(e);
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null); // reset selected note to null
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    try {
      e?.preventDefault();

      if (!selectedNote) {
        return;
      };

      const updatedNote: Note = {
        ...selectedNote,
        title: title,
        content: content,
      };

      const response = await fetch(`http://localhost:9000/api/notes/${updatedNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });
      const newNote: Note = await response.json();

      const updatedNotesList = notes.map((note) => (note.id === selectedNote.id ? newNote : note));

      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setSelectedNote(null); // reset selected note to null
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteNote = async (e: React.MouseEvent, noteId: number) => {
    e.stopPropagation();
    try {
      await fetch(`http://localhost:9000/api/notes/${noteId}`, {
        method: "DELETE",
      });
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <div className="app-container">
      <form onSubmit={(e) => (selectedNote ? handleUpdateNote(e) : handleAddNote(e))} className="note-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows={10}
          required
        />
        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="note-item" onClick={() => handleNoteClick(note)}>
            <div className="notes-header">
              <button onClick={(e) => handleDeleteNote(e, note.id)} >x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;