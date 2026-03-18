import { useCallback, useState } from "react";

const API_KEY = import.meta.env.VITE_OPEN_ROUTER;

export function useChat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "react-chat-demo",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      });

      const data = await res.json();
      const answer = data.choices[0].message.content;

      setResponse(answer);
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [message]);

  return {
    message,
    setMessage,
    response,
    loading,
    sendMessage,
  };
}
