import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/useAuth";
import api from "../lib/api";

function formatTime(dateString) {
  const d = new Date(dateString);
  return d.toLocaleString("th-TH", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Chat() {
  const { user } = useAuth();
  const [inbox, setInbox] = useState([]);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [sendError, setSendError] = useState("");
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);

  const loadInbox = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/messages/user/${user.id}`);
      const rows = response.data;
      setInbox(rows);

      const grouped = {};
      rows.forEach((item) => {
        const key = `${item.product_id}-${item.sender_id}`;
        if (!grouped[key] || new Date(item.created_at) > new Date(grouped[key].created_at)) {
          grouped[key] = item;
        }
      });

      const threadData = Object.values(grouped).map((item) => ({
        product_id: item.product_id,
        sender_id: item.sender_id,
        sender_name: item.sender_name,
        message: item.message,
        created_at: item.created_at,
        product_title: item.product_title || `Product #${item.product_id}`,
      }));

      setThreads(threadData);
      if (threadData.length > 0 && !selectedThread) {
        setSelectedThread(threadData[0]);
      }
    } catch (error) {
      console.error("Unable to load chat inbox", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    loadInbox();
  }, [user]);

  const loadThread = async (thread) => {
    if (!thread) {
      return;
    }
    setThreadLoading(true);
    try {
      const response = await api.get(`/messages/product/${thread.product_id}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Unable to load thread", error);
      setMessages([]);
    } finally {
      setThreadLoading(false);
    }
  };

  useEffect(() => {
    loadThread(selectedThread);
  }, [selectedThread]);

  const handleThreadSelect = (thread) => {
    setSelectedThread(thread);
    setMessageText("");
    setSendError("");
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!selectedThread || !messageText.trim()) {
      return;
    }

    const receiver_id = selectedThread.sender_id;
    const product_id = selectedThread.product_id;

    try {
      setSendError("");
      await api.post("/messages", {
        receiver_id,
        product_id,
        message: messageText.trim(),
      });
      setMessageText("");
      await loadThread(selectedThread);
      await loadInbox();
    } catch (error) {
      setSendError(error.response?.data?.message || "ไม่สามารถส่งข้อความได้");
    }
  };

  const activeProductTitle = selectedThread?.product_title || "เลือกแชทจากแถวด้านซ้าย";

  return (
    <section className="stack-lg">
      <div className="hero-card">
        <div>
          <p className="eyebrow">แชทของฉัน / My Chat</p>
          <h2>Inbox ข้อความจากผู้ซื้อ</h2>
          <p className="muted">เลือกสนทนาและตอบผู้ซื้อได้ทันที</p>
        </div>
      </div>

      {loading ? <div className="card">กำลังโหลด...</div> : null}

      <div className="chat-layout">
        <aside className="chat-sidebar">
          <div className="chat-sidebar-head">
            <strong>Inbox</strong>
            <span>{threads.length} รายการ</span>
          </div>
          {threads.length === 0 ? (
            <div className="card">ยังไม่มีข้อความเข้า</div>
          ) : (
            <div className="chat-thread-list">
              {threads.map((thread) => {
                const isActive =
                  selectedThread?.product_id === thread.product_id &&
                  selectedThread?.sender_id === thread.sender_id;
                return (
                  <button
                    key={`${thread.product_id}-${thread.sender_id}`}
                    className={isActive ? "chat-thread active" : "chat-thread"}
                    type="button"
                    onClick={() => handleThreadSelect(thread)}
                  >
                    <div>
                      <div className="thread-title">{thread.product_title}</div>
                      <div className="thread-meta">จาก: {thread.sender_name}</div>
                    </div>
                    <div className="thread-preview">{thread.message.slice(0, 42)}...</div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className="chat-main">
          <div className="chat-main-head">
            <div>
              <p className="eyebrow">{activeProductTitle}</p>
              <h3>ตอบกลับได้</h3>
            </div>
            {selectedThread ? (
              <small className="muted">
                ผู้ซื้อ: {selectedThread.sender_name} • สินค้า #{selectedThread.product_id}
              </small>
            ) : null}
          </div>

          {threadLoading ? (
            <div className="card">กำลังโหลดแชท...</div>
          ) : (
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="card">เลือกแชทเพื่อดูข้อความ</div>
              ) : (
                messages.map((msg) => {
                  const sentByMe = Number(msg.sender_id) === Number(user.id);
                  return (
                    <div
                      key={msg.id}
                      className={sentByMe ? "chat-bubble out" : "chat-bubble in"}
                    >
                      <div className="chat-text">{msg.message}</div>
                      <div className="chat-meta">
                        {sentByMe ? "คุณ" : msg.sender_name || "ผู้ซื้อ"} • {formatTime(msg.created_at)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          <form className="chat-form" onSubmit={handleSend}>
            <label className="field">
              <span>เขียนข้อความ</span>
              <textarea
                className="input textarea"
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="พิมพ์ข้อความตอบกลับผู้ซื้อ..."
                required
              />
            </label>
            {sendError ? <div className="error-banner">{sendError}</div> : null}
            <button className="primary-button" type="submit" disabled={!selectedThread || !messageText.trim()}>
              ส่งข้อความ
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}

export default Chat;
