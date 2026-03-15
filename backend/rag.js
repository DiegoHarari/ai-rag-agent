import "dotenv/config";

import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { ChatOllama } from "@langchain/ollama";

async function run() {

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

  const retriever = vectorStore.asRetriever({
    k: 3
  });

  const question = "What are React hooks?";

  const docs = await retriever.invoke(question);

  console.log("\nRetrieved docs:\n");

  docs.forEach((d, i) => {
    console.log(`Doc ${i+1}:`, d.metadata.source);
  });

  const context = docs.map(d => d.pageContent).join("\n");

const llm = new ChatOllama({
  model: "llama3.2",
  temperature: 0
});

  const response = await llm.invoke(`
Answer the question using ONLY the context below.

Context:
${context}

Question:
${question}
`);

  console.log("\nAnswer:\n");
  console.log(response.content);

}

run();