import "./App.css";
import { useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
}


const App = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "test note 1",
      content: "bla bla note1",
    },
    {
      id: 2,
      title: "test note 2 ",
      content: "bla bla note2",
    },
    {
      id: 3,
      title: "test note 3",
      content: "bla bla note3",
    },
    {
      id: 4,
      title: "test note 4 ",
      content: "bla bla note4",
    },
    {
      id: 5,
      title: "test note 5",
      content: "bla bla note5",
    },
    {
      id: 6,
      title: "test note 6",
      content: "bla bla note6",
    },
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleAddNote = (e: React.FormEvent) => {
    e?.preventDefault();
    console.log("title: ", title);
    console.log("content: ", content);
    const newNote: Note = {
      id: notes.length + 1,
      title: title,
      content: content,
    }
    setNotes([newNote, ...notes]); // update notes array with new note
    setTitle(""); // reset title and content to empty strings
    setContent("");
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

  const handleUpdateNote = (e: React.FormEvent) => {
    e?.preventDefault();

    if (!selectedNote) {
      return;
    };

    const updatedNote: Note = {
      ...selectedNote,
      title: title,
      content: content,
    };

    const updatedNotesList = notes.map((note) => (note.id === selectedNote.id ? updatedNote : note));

    setNotes(updatedNotesList);
    setTitle("");
    setContent("");
    setSelectedNote(null); // reset selected note to null
  };

  const handleDeleteNote = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
  };


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