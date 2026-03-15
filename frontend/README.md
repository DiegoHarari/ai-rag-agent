Aquí tienes una **descripción clara y profesional para el README.md**, pensada para GitHub y también útil si alguien de la entrevista mira tu repo.

---

# AI RAG Chat Assistant

A small end-to-end **AI chat assistant built from scratch** to explore how modern LLM applications work under the hood.

The project implements a **Conversational RAG (Retrieval Augmented Generation) pipeline**, combining a React chat UI, a Node.js backend, semantic document search, and a local LLM.

Instead of relying solely on pretrained model knowledge, the assistant retrieves relevant information from documents and uses it as context when generating answers.

---

# Architecture

The system is composed of the following components:

```
React Chat UI
      ↓
Express API
      ↓
Query Rewriting (Conversational RAG)
      ↓
Vector Retrieval
      ↓
Chroma Vector Database
      ↓
Local LLM (Ollama)
```

---

# Features

### Document ingestion

Documents are parsed and processed before being stored in the vector database.

Steps:

* PDF loading
* Text chunking
* Embedding generation
* Vector storage

This enables semantic search across the documents.

---

### Conversational RAG

The system supports follow-up questions by rewriting conversational queries into standalone questions.

Example:

```
User: What are React hooks?
User: Why are they useful?
```

The system rewrites the second question to:

```
Why are React hooks useful?
```

before running retrieval.

---

### Semantic retrieval

Chunks are retrieved using **vector similarity search**.

The retriever returns the **top-k most relevant document chunks**, which are injected into the prompt sent to the LLM.

---

### Local LLM inference

Instead of relying on external APIs, the system runs a local model using:

* Ollama
* Llama 3

This allows experimentation with AI pipelines without cloud dependencies.

---

### Evaluation harness

A simple evaluation script is included to test the RAG system against predefined questions.

This helps measure:

* answer correctness
* retrieval quality
* hallucination behavior

---

# Tech Stack

Frontend

* React
* TypeScript

Backend

* Node.js
* Express

AI / Retrieval

* LangChain
* Chroma vector database
* Ollama
* Llama 3

Embeddings

* all-MiniLM-L6-v2

---

# Example Flow

1. User asks a question in the chat UI
2. The API receives the request
3. The query is rewritten if part of a conversation
4. Relevant document chunks are retrieved
5. The LLM generates an answer using the retrieved context

---

# Future Improvements

Potential improvements to make the system more production-ready:

* retrieval reranking
* hybrid search (vector + keyword)
* streaming responses
* conversation memory persistence
* more advanced evaluation metrics

---

# Purpose

This project was built to better understand:

* RAG pipelines
* embeddings and vector search
* conversational retrieval
* evaluation-driven development for LLM systems


