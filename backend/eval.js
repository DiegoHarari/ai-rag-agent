import fs from "fs";

import { ChatOllama } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

const dataset = JSON.parse(
  fs.readFileSync("./eval_dataset.json", "utf8")
);

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

  const retriever = vectorStore.asRetriever({ k: 3 });

  const llm = new ChatOllama({
    model: "llama3.2",
    temperature: 0
  });

  let score = 0;

  for (const test of dataset) {

    const docs = await retriever.invoke(test.question);

    const context = docs.map(d => d.pageContent).join("\n");

    const response = await llm.invoke(`
Answer the question using the context below.

Context:
${context}

Question:
${test.question}
`);

    const answer = response.content;

    const correct =
      answer.toLowerCase().includes(test.expected.toLowerCase());

    if (correct) score++;

    console.log("\nQUESTION:", test.question);
    console.log("ANSWER:", answer);
    console.log("EXPECTED:", test.expected);
    console.log("RESULT:", correct ? "PASS" : "FAIL");

  }

  console.log("\nFINAL SCORE:", score, "/", dataset.length);

}

run();