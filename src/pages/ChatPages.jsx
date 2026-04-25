import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteConv, deleteMessages } from "../utils/chat";
import { whoami, chatPartners } from "../utils/users";
import { socket } from "../utils/socket";
//     =
//       =
//     =
function getUserColor(userId) {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#FF8C42",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F1948A",
  ];
  return colors[userId % colors.length];
}
//     =
//       =
//     =
function playNotificationSound() {
  try {
    const audio = new Audio("/kecske.mp3");
    audio.volume = 0.125;
    audio
      .play()
      .catch((err) => console.log("Hang lejatszasa sikertelen:", err));
  } catch (err) {
    console.log("Aduio hiba:", err);
  }
}

//     =
//       =
//     =
export default function ChatPages() {
  //states
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastMessages, setLastMessages] = useState({});
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  //
  const aljaRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetUserId = searchParams.get("user");
  const targetUsername = searchParams.get("name");

  async function refreshLastMessgae(partnerId) {
    try {
      const res = await fetch(`/messages/${partnerId}?limit=1&last=true`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      setLastMessages((prev) => ({
        ...prev,
        [partnerId]: data.length > 0 ? data[data.length - 1].messages : "",
      }));
    } catch (err) {
      console.error("uzolso uzenet frissites hiba:", err);
    }
  }
  //     =
  // kivalasztas      =
  //     =
  async function handleSelectUser(user) {
    setSelectedUser(user);
    setMobileChatOpen(true);
    setSearchParams({
      user: user.user_id,
      name: user.username,
    });
    try {
      const res = await fetch(`/messages/${user.user_id}`, {
        credentials: "include",
      });
      if (!res.ok) console.error(res.error);
      const data = await res.json();
      // console.log("ciganyok futnak", data);
      setMessages(data);

      if (data.length > 0) {
        const lastMsg = data[data.length - 1];
        setLastMessages((prev) => ({
          ...prev,
          [user.user_id]: lastMsg.messages,
        }));
      }
    } catch (err) {
      console.error("Hiba:", err);
    }
  }

  //mobil nezet
  function handleBackToList() {
    setMobileChatOpen(false);
    setSelectedUser(null);
    setSearchParams({});
  }
  //     =
  //  full chat torlese     =
  //     =
  async function deleteConvo(e, partnerId) {
    e.stopPropagation();
    try {
      const data = await deleteConv(partnerId);
      if (data.error) {
        console.error(data.error);
        return;
      }
      socket.emit("delete_conversation", {
        partnerId: Number(partnerId),
      });

      if (selectedUser?.user_id === partnerId) {
        setMessages([]);
        setMobileChatOpen(false);
        setSelectedUser(null);
      }
      setLastMessages((prev) => {
        const updated = { ...prev };
        delete updated[partnerId];
        return updated;
      });
      setUsers((prev) =>
        prev.filter((u) => Number(u.user_id) !== Number(partnerId)),
      );
    } catch (err) {
      console.error("hiba a beszelgetes torlesene", err);
    }
  }
  //     =
  //  userek betoltse     =
  //     =
  useEffect(() => {
    async function loadUserAndPartners() {
      try {
        const me = await whoami();
        if (me.error) {
          navigate("/login");
          return;
        }
        setCurrentUser(me);
        // ====
        socket.emit("register", Number(me.user_id));

        let partners = await chatPartners();
        // console.log("Partners from backend:", partners);
        if (!Array.isArray(partners)) partners = [];

        if (targetUserId && targetUsername) {
          const exists = partners.some(
            (p) => Number(p.user_id) === Number(targetUserId),
          );
          if (!exists) {
            partners = [
              { user_id: Number(targetUserId), username: targetUsername },
              ...partners,
            ];
          }
        }
        setUsers(partners);
        await loadLastMessages(partners);
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    loadUserAndPartners();
  }, [navigate]);

  async function loadLastMessages(partners) {
    const lastMsgs = {};
    for (const partner of partners) {
      try {
        const res = await fetch(
          `/messages/${partner.user_id}?limit=1&last=true`,
          {
            credentials: "include",
          },
        );
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            lastMsgs[partner.user_id] = data[data.length - 1].messages;
          }
        }
      } catch (err) {
        console.log("utolso uzenet hiba:", err);
      }
    }
    setLastMessages(lastMsgs);
  }

  //     =
  //   urlbrol erkezeo adatok    =
  //     =
  useEffect(() => {
    if (!targetUserId || users.length === 0 || selectedUser) return;
    if (selectedUser && selectedUser.user_id === Number(targetUserId)) return;
    const targetUser = users.find(
      (u) => Number(u.user_id) === Number(targetUserId),
    );
    // console.log("találat:", targetUser);
    if (targetUser) handleSelectUser(targetUser);
  }, [loading, users, targetUserId]);
  //     =
  // socket uzenet fogadas     =
  //     =

  useEffect(() => {
    function handleUzenet(message) {
      setMessages((prev) => [...prev, message]);

      const partnerId =
        Number(message.giver) === Number(currentUser?.user_id)
          ? message.receiver
          : message.giver;

      setLastMessages((prev) => ({
        ...prev,
        [partnerId]: message.messages,
      }));
      if (Number(message.giver) !== Number(currentUser?.user_id)) {
        playNotificationSound();
      }
    }
    function handleMessageDeleted({ messageId, partnerId }) {
      // console.log("3. messgae_deleted veent:", { messageId, partnerId });

      setMessages((prev) =>
        prev.filter((msg) => Number(msg.message_id) !== Number(messageId)),
      );
      refreshLastMessgae(partnerId);
    }
    function handleConversationDeleted({ partnerId }) {
      setMessages((prev) => {
        return [];
      });
      setUsers((prev) =>
        prev.filter((u) => Number(u.user_id) !== Number(partnerId)),
      );
      setLastMessages((prev) => {
        const updated = { ...prev };
        delete updated[partnerId];
        return updated;
      });
    }

    socket.on("uzenet_jott", handleUzenet);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("conversation_deleted", handleConversationDeleted);
    return () => {
      socket.off("uzenet_jott", handleUzenet);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("conversation_deleted", handleConversationDeleted);
    };
  }, [currentUser]);
  //     =
  // uezent torlese    =
  //     =

  async function deleteMessage(messageId) {
    // console.log("messageid:", messageId);
    try {
      const data = await deleteMessages(messageId);
      if (data.error) {
        console.error(data.error);
        return;
      }
      setMessages((prev) => prev.filter((msg) => msg.message_id !== messageId));
      if (selectedUser) {
        // console.log("2. socket emit delete_message:", {
        //   messageId,
        //   partnerId: selectedUser.user_id,
        // });

        socket.emit("delete_message", {
          messageId,
          partnerId: Number(selectedUser.user_id),
        });
      }
      await refreshLastMessgae(selectedUser.user_id);
    } catch (err) {
      console.error("valami nem jó", err);
    }
  }

  //     =
  // autoscroll      =
  //     =
  useEffect(() => {
    aljaRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  //     =
  // uzenet kuldes      =
  //     =
  function send(e) {
    e.preventDefault();
    if (!newMessages.trim() || !selectedUser) return;
    // console.log("selectedUser:", selectedUser);
    // console.log("user_id:", selectedUser.user_id);
    socket.emit("new_message", {
      senderId: Number(currentUser.user_id),
      receiverId: Number(selectedUser.user_id),
      szoveg: newMessages,
    });

    setLastMessages((prev) => ({
      ...prev,
      [selectedUser.user_id]: newMessages,
    }));

    setNewMessages("");
  }
  function shortenMessage(msg, maxLength = 25) {
    if (!msg) return "Kezdj el beszélgetni....";
    return msg.length > maxLength ? msg.substring(0, maxLength) + "..." : msg;
  }
  //     =
  //        =
  //     =
  if (loading) return <div>Betöltés...</div>;
  if (!currentUser) return <div>Jelentkezz be!</div>;
  //     =
  //       =
  //     =
  return (
    <div className={`chat-page ${mobileChatOpen ? "mobile-chat-open" : ""}`}>
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
          {users.map((user, index) => (
            <div
              key={index}
              className={`chat-user-item ${
                selectedUser?.user_id === user.user_id ? "active" : ""
              }`}
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
                <div className="chat-user-last-msg">
                  {shortenMessage(lastMessages[user.user_id])}
                </div>
              </div>
              <button
                className="chat-conversation-delete-btn"
                onClick={(e) => deleteConvo(e, user.user_id)}
                title="Beszélgetés törlése"
              >
                <i className="bi bi-x-lg" />
              </button>
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
          <div className="chat-no-selection">
            <i className="bi bi-chat-dots" />
            Válassz ki valakit a chathez!
          </div>
        ) : (
          <>
            <div className="chat-main-header">
              <button className="chat-back-btn" onClick={handleBackToList}>
                <i className="bi bi-arrow-left" />
              </button>
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
              {messages.map((msg, i) => {
                // console.log("uzenet:", msg);
                return (
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
                    {Number(msg.giver) === Number(currentUser.user_id) && (
                      <button
                        className="chat-delete-btn"
                        onClick={() => deleteMessage(msg.message_id)}
                        title="Törlés"
                      >
                        <i className="bi bi-trash" />
                      </button>
                    )}
                  </div>
                );
              })}
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
