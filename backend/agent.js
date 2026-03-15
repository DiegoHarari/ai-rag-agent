import "dotenv/config";

import { ChatOllama } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

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

  const searchDocs = tool(
    async ({ query }) => {

      const docs = await retriever.invoke(query);

      return docs.map(d => d.pageContent).join("\n");
    },
    {
      name: "search_docs",
      description: "Search the documentation for relevant information",
      schema: {
        type: "object",
        properties: {
          query: { type: "string" }
        },
        required: ["query"]
      }
    }
  );

  const llm = new ChatOllama({
    model: "llama3.2",
    temperature: 0
  });

  const agent = createReactAgent({
    llm,
    tools: [searchDocs]
  });

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "Explain React hooks"
      }
    ]
  });

  console.log(result.messages.at(-1).content);

}

run();