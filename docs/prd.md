# Product Requirement Document (PRD) — Ghost Relay: Team Coordination Bridge

**Version:** 1.0  
**Purpose:** Qwen Cloud Hackathon (Hybrid Tracks)  
**Core Concept:** Human → AI → Human (AI as a communication bridge between team members)

---

## 1. Executive Summary

**Ghost Relay** is an AI-powered asynchronous communication system that acts as a **"Translator & Organizer"** in the middle of a team. It integrates various chat platforms (WhatsApp, Telegram, Slack) into a single web interface. Its primary responsibilities are:
1. Converting voice notes into structured text.
2. Decomposing long instructions into tasks per division.
3. Indexing all sent documents and files so they are easily searchable without scrolling.
4. Auto-answering repetitive questions using team memory.

**Value Proposition:** Saves 70% of team coordination time by eliminating the habits of chat-scrolling, listening to long voice notes, and answering repeating questions.

---

## 2. Problem Statement

- **Fragmented Communication:** Teams use 3+ different platforms (WhatsApp, Telegram, Slack) causing information to get scattered.
- **Voice Note Fatigue:** Listening to long voice notes wastes time and disrupts focus, especially when working on a PC.
- **Lost Context:** Documents and files shared in chats are hard to find later, requiring scrolling back through endless history.
- **Repetitive Questions:** The same questions are repeatedly asked by new members or people who forgot, frustrating other members who have to answer them again.
- **Asynchronous Breakdown:** Not all companies understand remote/async workflows, leading to chaotic coordination.

---

## 3. Goals

- **Primary Goal:** Create a single source of truth for all team communications.
- **Target Audience:** Technical teams (engineers, designers, product managers) tired of manual coordination.
- **Success Metrics:**
  - Time spent searching for old documents reduced from 5 minutes to < 10 seconds.
  - 100% of incoming voice notes are automatically transcribed and summarized.
  - Repetitive questions reduced by 90% via vector-memory auto-reply.

---

## 4. User Personas

| Name | Role | Pain Point | Expectations of Ghost Relay |
| :--- | :--- | :--- | :--- |
| **Andi** | Backend Engineer (Technical) | Dislikes opening his phone, listening to voice notes, or scrolling chat. | Ability to send/receive messages via PC UI without touching his phone, with all voice notes transcribed. |
| **Budi** | Project Manager | Often sends long instructions via voice notes and gets annoyed when the team asks again. | Speaks once, AI decomposes the tasks and reminds the team automatically. |
| **Citra** | Frontend Engineer | Misses info because WhatsApp is active but technical discussions are on Slack. | All messages from all platforms consolidated in one clean feed. |

---

## 5. User Stories

1. **As Andi**, I want to speak into the microphone on the PC UI, and have my message automatically sent to the team's WhatsApp group without touching my phone.
2. **As Budi**, I want to send a long voice note, and have Ghost Relay automatically decompose my instructions into "Tasks for Backend" and "Tasks for Frontend" in the chat.
3. **As Citra**, I want to ask *"What is the staging URL?"* and have Ghost Relay answer immediately referencing previous chat history without asking a coworker.
4. **As a team member**, I want all PDF files and images sent in the chat to automatically appear in the Side Panel ("Knowledge Vault") grouped into context folders (e.g., Designs, Technical Documents, Contracts).

---

## 6. Functional Requirements

### 6.1. Universal Inbox (Chat Aggregator)
- Read and send messages to 3 platforms: WhatsApp, Telegram, and Slack.
- Consolidate all incoming messages from these platforms into a single main chat feed in the UI.

### 6.2. Main Chat Interface (Center UI)
- Chronological conversation history from all platforms.
- Messages labeled with platform origins (e.g., `[WA]`, `[TG]`, `[SLACK]`) and sender names.
- Chat search functionality by keyword.

### 6.3. Smart Voice Note Processing (Core Feature)
- When a voice note is detected (from WA or TG), the AI automatically:
  - **Transcribes** the voice note into text.
  - **Summarizes** the long text into 1-2 core sentences.
  - **Decomposes** tasks: If instructions contain commands for > 1 division, the AI splits them into separate task cards.
- *Example Output:* `[Voice Note Summary - Budi]: "Backend: update schema. Frontend: fix padding. Deadline: T+2."`

### 6.4. Side Panel - Knowledge Vault (Right UI)
- Extract all **files** (images, PDFs, Word, Excel, Drive links) shared in chat.
- **Categorize files automatically** based on conversation context (e.g., *"Folder: Client A Contract"*, *"Folder: UI Mockup V3"*).
- Drag & Drop interface to upload files directly from the PC to this panel.
- Preview and download files directly.

### 6.5. Autopilot Memory & Auto-Reply (RAG)
- Long-term memory storage: All chat questions and answers are stored in a Vector Database.
- When a user asks a query (e.g., *"What is the API key?"*), the AI will:
  - Match the question against chat history.
  - Return the answer from history, citing the source (e.g., *"According to @Andi on July 2, the API key is XXXX"*).
  - Automatically mention the original sender of the answer.

### 6.6. Voice Command Input
- A large microphone button at the bottom of the chat.
- When pressed, the user can speak (e.g., *"Send to design team: change color to blue"*). The AI transcribes it and routes it to the target platform.

### 6.7. Daily Report Generation
- User types or says: *"Generate daily report"*.
- AI summarizes all activities, decisions, and files uploaded in the last 24 hours, returning a formatted report.

---

## 7. Non-Functional Requirements

- **Real-time Latency:** Max 3 seconds latency for forwarding messages.
- **Security:** Platform credentials (WA/TG/Slack tokens) must be encrypted (AES-256-GCM). System must prioritize user data privacy.
- **Scalability:** Handles up to 1000 messages daily for teams of 10-50 people.

---

## 8. UI/UX Structure Mockup

```
+------------------------------------------------------------------+
|  [Logo] Ghost Relay                          [Profile] [Settings] |
+------------------------------------------------------------------+
| Left Sidebar         |       MAIN CHAT (Center)      | Right Sidebar |
| (Channels /          |                               | (KNOWLEDGE  |
|  Active Groups)      |  [WA] Andi: Hello everyone... |  VAULT)     |
|                      |  [TG] Budi: (Voice Note)      |             |
| - Project Alpha (WA) |  >>> [Voice Note Summary]     | 📁 Contracts |
| - Dev Team (TG)      |  >>> Backend Tasks: ...       | 📁 Designs   |
| - Client (Slack)     |  >>> Frontend Tasks: ...      | 📁 Docs      |
|                      |  [SLACK] Citra: Okay got it.  |   [Upload+]  |
|                      |                               |             |
|                      |  [ Input Text ] [ 🎤 Mic ]    |             |
+------------------------------------------------------------------+
```

---

## 9. Assumptions & Constraints

- **Assumptions:** Teams have accounts/channels on WA/TG/Slack that can be integrated via Bot APIs or Webhooks.
- **Constraints:** WhatsApp has strict automated bot policies. For the hackathon MVP, we use WhatsApp connection libraries (Baileys) carefully, prioritizing Telegram and Slack.
- **AI Models:** DashScope Qwen Cloud acts as the primary LLM provider for chat, embeddings, task decomposition, and speech recognition.
