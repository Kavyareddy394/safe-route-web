import { useEffect, useState } from "react";
import api from "../services/api";
import "./Contacts.css";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await api.get("/contacts");
      setContacts(res.data);
    } catch (err) {
      alert("Failed to load contacts");
    }
  };

  const addContact = async () => {
    if (!name || !email) {
      alert("Name and email required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/contacts", { name, email });
      setName("");
      setEmail("");
      fetchContacts();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding contact");
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    const confirm = window.confirm("Remove this contact?");
    if (!confirm) return;

    try {
      await api.delete(`/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      alert("Failed to delete contact");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="contacts-container">
      <h2>Emergency Contacts</h2>

      <div className="add-contact">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={addContact} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <ul className="contact-list">
        {contacts.map((c) => (
          <li key={c._id}>
            <span>{c.name}</span>
            <span>{c.email}</span>
            <button onClick={() => deleteContact(c._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
