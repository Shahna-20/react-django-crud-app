import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState(0);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addbook = async () => {
    const bookData = { title, release_year: releaseYear };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      setBooks((prev) => [...prev, data]);
    } catch (err) {
      console.log(err);
    }
  };

  const updateTitle = async (pk, release_year) => {
    const bookData = { title: newTitle, release_year };
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      setBooks((prev) =>
        prev.map((book) => (book.id === pk ? data : book))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBook = async (pk) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/books/${pk}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>📚 Book Website</h1>
      <form>
        <input
          type="text"
          placeholder="Book Title..."
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Release year"
          onChange={(e) => setReleaseYear(e.target.value)}
        />
        <button type="button" onClick={addbook}>Add Book</button>
      </form>

      <div className="book-list">
        {books.map((book) => (
          <div className="book" key={book.id}>
            <p><strong>Title:</strong> {book.title}</p>
            <p><strong>Release Year:</strong> {book.release_year}</p>
            <input
              type="text"
              placeholder="New Title..."
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button className="update" onClick={() => updateTitle(book.id, book.release_year)}>Change Title</button>
            <button className="delete" onClick={() => deleteBook(book.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
