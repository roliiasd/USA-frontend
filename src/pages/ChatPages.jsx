import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { allUsers, whoami } from "../users";
import { socket } from "../socket";

function getUserColor(userId) {
  const colors = [
    "#FF6B6B", // piros
    "#4ECDC4", // türkiz
    "#45B7D1", // kék
    "#96CEB4", // zöld
    "#FFEAA7", // sárga
    "#DDA0DD", // lila
    "#FF8C42", // narancs
    "#98D8C8", // menta
    "#F7DC6F", // arany
    "#BB8FCE", // violet
    "#85C1E9", // világoskék
    "#F1948A", // rózsaszín
  ];
  return colors[userId % colors.length];
}

export default function ChatPages() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const aljaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await whoami();
        if (me.error) {
          navigate("/login");
          return;
        }
        setCurrentUser(me);
        socket.emit("register", Number(me.user_id));

        const data = await allUsers();
        console.log("allUsers válasz:", data);
        const userList = Array.isArray(data[0]) ? data[0] : data;

        const otherUsers = (Array.isArray(data) ? data : []).filter(
          (u) => Number(u.user_id) !== Number(me.user_id),
        );
        console.log("otherUsers:", otherUsers);
        setUsers(otherUsers);
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    function handleUzenet(message) {
      //   console.log("Üzenet jott:", message);
      setMessages((prev) => [...prev, message]);
    }
    socket.off("uzenet_jott");
    socket.on("uzenet_jott", handleUzenet);
    return () => {
      socket.off("uzenet_jott", handleUzenet);
    };
  }, []);

  useEffect(() => {
    aljaRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSelectUser(user) {
    setSelectedUser(user);
    try {
      const res = await fetch(`/messages/${user.user_id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Hiba:", err);
    }
  }
  function send(e) {
    e.preventDefault();
    if (!newMessages.trim() || !selectedUser) return;
    console.log("selectedUser:", selectedUser);
    console.log("user_id:", selectedUser.user_id);
    socket.emit("new_message", {
      senderId: Number(currentUser.user_id),
      receiverId: Number(selectedUser.user_id),
      szoveg: newMessages,
    });
    setNewMessages("");
  }

  if (loading) return <div>Betöltés...</div>;
  if (!currentUser) return <div>Jelentkezz be!</div>;

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <div className="chat-my-profile">
          <div
            className="chat-user-avatar"
            style={{ background: getUserColor(currentUser.user_id) }}
          >
            {currentUser.username?.charAt(0).toUpperCase()}
          </div>
          <div className="chat-user-info">
            <div className="chat-user-name">{currentUser.username}</div>
          </div>
          <span className="chat-you-badge">Te</span>
        </div>
        <div className="chat-sidebar-header">Üzenetek</div>
        <div className="chat-user-list">
          {users.length === 0 && (
            <p style={{ padding: "16px", color: "#aaa" }}>
              Nincs elérhető felhasználó
            </p>
          )}
          {users.map((user) => (
            <div
              key={user.user_id}
              className={`chat-user-item ${selectedUser?.user_id === user.user_id ? "active" : ""}`}
              onClick={() => handleSelectUser(user)}
            >
              <div
                className="chat-user-avatar"
                style={{ background: getUserColor(user.user_id) }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div className="chat-user-info">
                <div className="chat-username">{user.username}</div>
                <div className="chat-user-last-msg">Kattints a chathez...</div>
              </div>
            </div>
          ))}
        </div>
        <button className="chat-home-btn" onClick={() => navigate("/")}>
          <i className="bi bi-arrow-bar-left" />
          <span>Vissza a főoldalra</span>
        </button>
      </div>

      <div className="chat-main">
        {!selectedUser ? (
          <div className="chat-no-selection">Válassz ki valakit a chathez!</div>
        ) : (
          <>
            <div className="chat-main-header">
              <div
                className="chat-user-avatar"
                style={{ background: getUserColor(selectedUser.user_id) }}
              >
                {selectedUser.username?.charAt(0).toUpperCase()}
              </div>
              <h2>{selectedUser.username}</h2>
            </div>
            <div className="chat-messages">
              {messages.length === 0 && (
                <p className="chat-empty">
                  Még nincsenek üzenetek, Irj valamit
                </p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-bubble ${
                    Number(msg.giver) === Number(currentUser.user_id)
                      ? "chat-bubble-mine"
                      : "chat-bubble-other"
                  }`}
                >
                  <p>{msg.messages}</p>
                  <small className="chat-time">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </small>
                </div>
              ))}
              <div ref={aljaRef} />
            </div>
            <form onSubmit={send} className="chat-form">
              <input
                value={newMessages}
                onChange={(e) => setNewMessages(e.target.value)}
                className="chat-input"
                placeholder="Irj uzenetet"
                autoFocus
              />
              <button type="submit" className="chat-send-btn">
                Küldés <i className="bi bi-send" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
