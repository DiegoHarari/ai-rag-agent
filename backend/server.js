import express from "express";
import cors from "cors";

import { ChatOllama } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

const app = express();

app.use(cors());
app.use(express.json());

let retriever;
let llm;
let chatHistory = [];

async function init() {

  const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2"
  });

  const vectorStore = await Chroma.fromExistingCollection(
    embeddings,
    {
      collectionName: "rag-docs",
      url: "http://localhost:8000"
    }
  );

  retriever = vectorStore.asRetriever({ k: 6 });

  llm = new ChatOllama({
    model: "llama3.2",
    temperature: 0
  });

}

app.post("/chat", async (req, res) => {

  const { question } = req.body;

  // guardar pregunta en historial
  chatHistory.push({
    role: "user",
    content: question
  });

  // ---- QUERY REWRITING ----

  const rewritePrompt = `
Given the conversation history and the latest user question,
rewrite the question so it is standalone.

Conversation history:
${chatHistory.map(m => `${m.role}: ${m.content}`).join("\n")}

User question:
${question}

Standalone question:
`;

  const rewriteResponse = await llm.invoke(rewritePrompt);

  const standaloneQuestion = rewriteResponse.content;

  console.log("\nRewritten question:", standaloneQuestion);

  // ---- RETRIEVAL ----

  const docs = await retriever.invoke(standaloneQuestion);

  const context = docs.map(d => d.pageContent).join("\n");

  // ---- FINAL ANSWER ----

const answerPrompt = `
You are a helpful AI assistant.

Use the provided context to answer the question when relevant.
If the context does not contain enough information, you may answer using your general knowledge.

Context:
${context}

Question:
${standaloneQuestion}

Answer:
`;

  const response = await llm.invoke(answerPrompt);

  const answer = response.content;

  // guardar respuesta en memoria
  chatHistory.push({
    role: "assistant",
    content: answer
  });

  res.json({
    answer,
    sources: docs.map(d => d.metadata.source)
  });

});

init().then(() => {

  app.listen(3001, () => {
    console.log("AI server running on port 3001");
  });

});