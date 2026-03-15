import "dotenv/config";

import fs from "fs";
import path from "path";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

async function run() {

  const docsDir = "../docs";
  const files = fs.readdirSync(docsDir);

  let documents = [];

  for (const file of files) {

    const fullPath = path.join(docsDir, file);

    if (file.endsWith(".pdf")) {

      console.log("Loading PDF:", file);

      const loader = new PDFLoader(fullPath);
      const docs = await loader.load();

      documents.push(...docs);

    }

    if (file.endsWith(".txt")) {

      console.log("Loading TXT:", file);

      const content = fs.readFileSync(fullPath, "utf8");

      documents.push({
        pageContent: content,
        metadata: { source: file }
      });

    }

  }

  console.log("Loaded docs:", documents.length);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1200,
    chunkOverlap: 200
  });

  let splitDocs = await splitter.splitDocuments(documents);

  // limpiar metadata
  splitDocs = splitDocs.map(doc => ({
    pageContent: doc.pageContent,
    metadata: {
      source: doc.metadata?.source || "unknown"
    }
  }));

  console.log("Chunks:", splitDocs.length);

  const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2"
  });

  await Chroma.fromDocuments(
    splitDocs,
    embeddings,
    {
      collectionName: "rag-docs",
      url: "http://localhost:8000"
    }
  );

  console.log("Vector store created");

}

run();