import { useState } from "react";


export default function Chat() {

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const URL = 'http://localhost:3001/chat'

const sendMessage = async () => {

  try {

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: message
      })
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    const data = await res.json();

    setResponse(data.answer);

  } catch (err) {

    console.error(err);
    setResponse("Something went wrong");

  }

};

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>
        Send
      </button>

      <p>{response}</p>
    </div>
  );
}

//    const res = await fetch(URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ message })
//     });

//     const data = await res.json();
//     setResponse(data.response);