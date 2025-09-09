import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Your backend URL

function ChatModal({ buyerId, sellerId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const roomId = `${buyerId}_${sellerId}`;

  useEffect(() => {
    socket.emit("joinRoom", { roomId });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
  const fetchChatHistory = async () => {
    const res = await fetch(`http://localhost:5000/api/chat/${buyerId}/${sellerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
      },
    });
    const data = await res.json();
    if (data?.messages) {
      setMessages(data.messages);
    }
  };

  fetchChatHistory();

  socket.emit("joinRoom", { roomId });

  socket.on("receiveMessage", (message) => {
    setMessages((prev) => [...prev, message]);
  });

  return () => {
    socket.off("receiveMessage");
  };
}, [buyerId, sellerId]);


  const sendMessage = () => {
    if (!text) return;
    socket.emit("sendMessage", { roomId, senderId: buyerId, text, buyerId, sellerId });
    setText("");
  };

  return (
    <div className="fixed bottom-0 right-0 w-96 bg-white shadow-lg rounded-t-lg flex flex-col">
      <div className="p-4 border-b font-bold flex justify-between">
        Chat with Seller
        <button onClick={onClose}>X</button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === buyerId ? "text-right" : "text-left"}>
            <p className="inline-block p-2 rounded bg-gray-200 m-1">{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="p-4 flex">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded p-2 mr-2"
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatModal;
