import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { whoami } from "../users";
import { socket } from "../socket";

export default function ChatPages() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");
  const [otherUserId, setOtherUserId] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
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

  async function chatInditas() {
    if (!otherUserId) return;
    try {
      const res = await fetch(`/messages/${otherUserId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setMessages(data);
      setChatOpen(true);
    } catch (err) {
      console.error("Hiba:", err);
    }
  }
  //   console.log("2️⃣ Socket connected?", socket.connected);
  function kuldes(e) {
    e.preventDefault();
    if (!newMessages.trim()) return;

    socket.emit("new_message", {
      senderId: Number(currentUser.user_id),
      receiverId: Number(otherUserId),
      szoveg: newMessages,
    });
    // console.log("3️⃣ EMIT MEGTÖRTÉNT");
    setNewMessages("");
  }
  //   useEffect(() => {
  //     console.log("4️⃣ LISTENER FELRAKVA");

  //     socket.on("uzenet_jott", (uzenet) => {
  //       console.log("5️⃣ ÜZENET MEGÉRKEZETT:", uzenet);
  //       setMessages((prev) => [...prev, uzenet]);
  //     });

  //     return () => {
  //       socket.off("uzenet_jott");
  //     };
  //   }, []);

  if (loading) return <div>Betöltés...</div>;
  if (!currentUser) return <div>Jelentkezz be!</div>;

  if (!chatOpen) {
    return (
      <div className="chat-start-container">
        <h2>💬 Chat</h2>
        <p>
          Szia <strong>{currentUser.username}</strong>! Kivel szeretnél
          chatelni?
        </p>
        <div className="chat-start-form">
          <input
            type="number"
            value={otherUserId}
            onChange={(e) => setOtherUserId(e.target.value)}
            placeholder="User ID (pl. 3)"
            className="chat-input"
            onKeyDown={(e) => e.key === "Enter" && chatInditas()}
          />
          <button onClick={chatInditas} className="chat-send-btn">
            Chat indítása
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button
          onClick={() => {
            setChatOpen(false);
            setMessages([]);
          }}
          className="chat-back-btn"
        >
          ← Vissza
        </button>
        <h2>💬 Chat - User #{otherUserId}</h2>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-empty">Még nincsenek üzenetek. Írj valamit! 👇</p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${
              msg.giver === currentUser.user_id
                ? "chat-bubble-mine"
                : "chat-bubble-other"
            }`}
          >
            <strong>
              {Number(msg.giver) === Number(currentUser.user_id)
                ? "Te"
                : `User #${msg.giver}`}
            </strong>
            <p>{msg.messages}</p>
            <small className="chat-time">
              {new Date(msg.created_at).toLocaleTimeString()}
            </small>
          </div>
        ))}
        <div ref={aljaRef} />
      </div>

      <form onSubmit={kuldes} className="chat-form">
        <input
          value={newMessages}
          onChange={(e) => setNewMessages(e.target.value)}
          placeholder="Írj üzenetet..."
          className="chat-input"
          autoFocus
        />
        <button type="submit" className="chat-send-btn">
          Küldés
        </button>
      </form>
    </div>
  );
}
