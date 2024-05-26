import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import './chat.css';
import { MdVideoCall } from 'react-icons/md';
import { BiSolidPhoneCall } from 'react-icons/bi';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { CiMenuKebab } from 'react-icons/ci';
import { IoMdSend } from 'react-icons/io';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import Picker from 'emoji-picker-react';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, contactId, contactName } = location.state;
  const emojiPickerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chat/${userId}/${contactId}/messages`);
        setMessages(response.data);
      } catch (error) {
        toast.error('Failed to fetch messages');
      }
    };

    fetchMessages();

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [userId, contactId]);

  const getColorForLetter = (letter) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#8C33FF', '#33FFF5',
      '#FF3333', '#33FF8C', '#8CFF33', '#A1FF33', '#33A1FF', '#FF33FF', '#5733FF',
      '#FF8CA1', '#A1FF8C', '#8CA1FF', '#FFC333', '#33FFC3', '#C333FF', '#C3FF33',
      '#33C3FF', '#FF33C3', '#33C3FF', '#8C33FF'
    ];
    const index = alphabet.indexOf(letter.toUpperCase());
    return index !== -1 ? colors[index] : '#999999';
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    try {
      const response = await axios.post('http://localhost:5000/api/chat/send', {
        userId,
        contactId,
        text: newMessage,
      });
      setNewMessage('');
      socket.emit('sendMessage', response.data);
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleBack = () => {
    navigate(`/chatlist/${userId}`, { state: { username: userId } });
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleEmojiClick = (emojiObject, _event) => {
    setNewMessage((prevInput) => prevInput + emojiObject.emoji);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleClickOutside = (event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            <IoMdArrowRoundBack />
          </button>
          <div
            className="contact-avatar"
            style={{
              backgroundColor: getColorForLetter(contactName.charAt(0)),
            }}
          >
            {contactName.charAt(0)}
          </div>
          <h2 className="contact-name">{contactName}</h2>
        </div>
        <div className="header-right">
          <button className="call-button">
            <BiSolidPhoneCall />
          </button>
          <button className="video-call-button">
            <MdVideoCall />
          </button>
          <button className="menu-button">
            <CiMenuKebab />
          </button>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === userId ? 'sent' : 'received'}`}>
            {msg.text}
            <span className="timestamp">{moment(msg.createdAt).format('h:mm A')}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <span className="emoji-picker" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          😊
        </span>
        {showEmojiPicker && (
          <div className="emoji-picker-container" ref={emojiPickerRef}>
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          autoFocus
        />
        <button onClick={handleSendMessage}>
          <IoMdSend />
        </button>
      </div>
    </div>
  );
};

export default Chat;