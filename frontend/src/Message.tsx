import { useChat } from "./useChat";

export default function Chat() {
  const { message, setMessage, response, loading, sendMessage } = useChat();

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>

      <p>{response}</p>
    </div>
  );
}
