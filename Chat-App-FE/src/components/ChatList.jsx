import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./chatlist.css";

const getColorForLetter = (letter) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const colors = [
      "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FF8C33", "#8C33FF", "#33FFF5",
      "#FF3333", "#33FF8C", "#8CFF33", "#A1FF33", "#33A1FF", "#FF33FF", "#5733FF",
      "#FF8CA1", "#A1FF8C", "#8CA1FF", "#FFC333", "#33FFC3", "#C333FF", "#C3FF33",
      "#33C3FF", "#FF33C3", "#33C3FF", "#8C33FF"
  ]; 

  const index = alphabet.indexOf(letter.toUpperCase());
  if (index !== -1) {
      return colors[index];
  } else {
      // Default color for non-letters or symbols
      return "#999999"; 
  }
};


const ChatList = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `mern-chat-application-axct-mnvos3891-nik6348s-projects.vercel.app/api/users/${username}/contacts`
        );
        setContacts(response.data);
      } catch (error) {
        console.error("Failed to fetch contacts", error);
      }
    };

    fetchContacts();
  }, [username]);

  const handleAddContact = async () => {
    const contactUsername = prompt("Enter the username of the contact:");
    if (contactUsername) {
      try {
        await axios.post("mern-chat-application-axct-mnvos3891-nik6348s-projects.vercel.app/api/users/add-contact", {
          username,
          contactUsername,
        });
        alert("Contact added successfully");
        const response = await axios.get(
          `http://localhost:5000/api/users/${username}/contacts`
        );
        setContacts(response.data);
      } catch (error) {
        alert("Failed to add contact");
      }
    }
  };

  const handleChat = (contact) => {
    navigate(`/chat/${username}/${contact._id}`, {
      state: { userId: username, contactId: contact._id, contactName: contact.fullName },
    });
  };

  return (
    <div className="chatlist-container">
      <h2 className="title">Chat List</h2>
      <button onClick={handleAddContact} className="add-contact-button">
        Add Contact
      </button>
      <ul className="contact-list">
        {contacts.map((contact) => (
          <li
            key={contact._id}
            onClick={() => handleChat(contact)}
            className="contact-item"
          >
            <div
              className="contact-avatar"
              style={{ backgroundColor: getColorForLetter(contact.fullName.charAt(0)) }}
            >
              {contact.fullName.charAt(0)}
            </div>
            <div className="contact-info">
              <div className="contact-name">{contact.fullName}</div>
              <div className="last-message">({contact.username})</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
