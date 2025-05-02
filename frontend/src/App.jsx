import { useEffect, useState } from "react";

const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${apiUrl}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError("Failed to fetch todos.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        const newTodo = await res.json();
        setTodos([...todos, newTodo]);
        setTitle("");
        setDescription("");
        setMessage("Item added successfully!");

        setTimeout(() => setMessage(""), 3000);
      } else {
        setError("Unable to create todo item.");
      }
    } catch {
      setError("Network error: Unable to reach server.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleUpdate = async () => {
    setError("");
    if (!editTitle.trim() || !editDescription.trim()) {
      setError("Both fields are required.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/todos/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });

      if (res.ok) {
        const updatedTodos = todos.map((item) =>
          item._id === editId ? { ...item, title: editTitle, description: editDescription } : item
        );

        setTodos(updatedTodos);
        setMessage("Item updated successfully!");
        setEditId(null);
        setEditTitle("");
        setEditDescription("");

        setTimeout(() => setMessage(""), 3000);
      } else {
        setError("Unable to update todo item.");
      }
    } catch {
      setError("Network error: Unable to reach server.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await fetch(`${apiUrl}/todos/${id}`, { method: "DELETE" });
      setTodos(todos.filter((item) => item._id !== id));
    } catch {
      setError("Failed to delete item.");
    }
  };

  return (
    <div className="container p-3">
      <div className="bg-success text-center text-light p-3 rounded">
        <h1>Todo Project with MERN Stack</h1>
      </div>

      <div className="my-4">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <div className="d-md-flex gap-2 mb-3">
          <input
            className="form-control my-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="form-control my-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="btn btn-dark my-2" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      <div>
        <h3>Tasks</h3>
        <ul className="list-group">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
            >
              <div className="d-flex flex-column w-50">
                {editId !== item._id ? (
                  <>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </>
                ) : (
                  <div className="d-flex gap-2">
                    <input
                      className="form-control"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                    />
                    <input
                      className="form-control"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                )}
              </div>

              <div className="d-flex gap-2">
                {editId !== item._id ? (
                  <>
                    <button className="btn btn-warning" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-success" onClick={handleUpdate}>
                      Update
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
