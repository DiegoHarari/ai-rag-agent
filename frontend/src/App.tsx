import { useState } from "react";
import axios from "axios";
import Chat from "./Message";

function App() {

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const sendMessage = async () => {

    if (!question) return;

    const userMessage = {
      role: "user",
      content: question
    };

    setMessages(prev => [...prev, userMessage]);

    setQuestion("");

    const res = await axios.post("http://localhost:3001/chat", {
      question
    });

    const aiMessage = {
      role: "assistant",
      content: res.data.answer,
      sources: res.data.sources
    };

    setMessages(prev => [...prev, aiMessage]);

  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>

      <h2>AI Docs Assistant</h2>

      <div style={{ minHeight: 400 }}>

        {messages.map((m, i) => (

          <div key={i} style={{ marginBottom: 20 }}>

            <b>{m.role === "user" ? "You" : "AI"}:</b>

            <div>{m.content}</div>

            {m.sources && (
              <div style={{ fontSize: 12, marginTop: 5 }}>
                Sources: {m.sources.join(", ")}
              </div>
            )}

          </div>

        ))}

      </div>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about the docs..."
        style={{ width: "70%", padding: 10 }}
      />

      <button
        onClick={sendMessage}
        style={{ padding: 10, marginLeft: 10 }}
      >
        Send
      </button>
      <Chat />

    </div>
  );

}

export default App;