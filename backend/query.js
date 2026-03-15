import "dotenv/config";

import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

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

  const question = "What is React?";

  const docs = await retriever.invoke(question);

  console.log("Retrieved docs:");
  console.log(docs);

}

run();