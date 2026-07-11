# Core Modules Pseudocode Specifications

> **ARCHIVE NOTE**: This document represents the initial pseudocode formulated during the design phase. All concepts have been fully implemented in actual TypeScript/Node.js code. See the source code in `apps/backend/src/` for current implementations.

---

This document outlines the core architecture and logic divided into **5 internal system modules**. The pseudocode is written in an agnostic, universal style to guide implementation.

---

## 🔄 Module 1: Incoming Message Router (Central Orchestrator)

This acts as the main gateway. All incoming messages from WhatsApp, Telegram, and Slack are routed here first.

**Pseudocode:**
```
FUNCTION handle_incoming_message(platform, sender, message_type, content, timestamp):
    # 1. Persist raw message to database
    message_id = save_to_database(platform, sender, message_type, content, timestamp)
    
    # 2. Broadcast to UI chat in real-time (via WebSocket)
    send_to_ui_chat(platform, sender, message_type, content)
    
    # 3. Route by content type to specific processors
    IF message_type == "voice_note":
        processed = Modul_Voice_Processor.process(platform, sender, content, message_id)
        send_to_ui_chat("SYSTEM", "Ghost Relay", "text", processed.summary)
        IF processed.has_multiple_tasks:
            FOR each task in processed.tasks:
                send_to_ui_chat("SYSTEM", "Ghost Relay (Tasks)", "text", task)
                # Dispatch notification to the target platform channel/group
                IF task.assigned_to == "backend":
                    send_to_platform("Telegram", "@backend_team", task.description)
    
    ELIF message_type == "file" (pdf/jpg/docx):
        Modul_KnowledgeVault.index_file(content, message_id, context=previous_chat_history)
        send_to_ui_sidepanel("Knowledge Vault", "Indexed file: " + content.filename)
    
    ELIF message_type == "text":
        # Check if the query has been answered before (RAG Memory)
        reply = Modul_Memory_AutoReply.check_and_reply(platform, sender, content)
        IF reply.found_in_history:
            send_to_ui_chat("SYSTEM", "Ghost Relay (Memory)", "text", reply.answer + " [Source: " + reply.source + "]")
            # Reply automatically to the platform source
            send_to_platform(platform, sender, reply.answer)
    
    RETURN message_id
```

---

## 🎙️ Module 2: Smart Voice Note Processor

This parses long audio messages into structured, small actionable tasks.

**Pseudocode:**
```
FUNCTION process_voice_note(platform, sender, audio_file, message_id):
    # 1. Speech-to-text Transcription (ASR)
    raw_text = call_speech_to_text(audio_file) 
    
    # 2. Summarize (via Qwen/LLM)
    summary_prompt = "Summarize the text in max 2 sentences: " + raw_text
    summary = call_llm(summary_prompt) 
    
    # 3. Task Decomposition (structured JSON output)
    decompose_prompt = """
    Text: """ + raw_text + """
    Extract the tasks. JSON output schema:
    [
        {"divisi": "backend", "tugas": "..."},
        {"divisi": "frontend", "tugas": "..."}
    ]
    Use "general" if no division matches.
    """
    tasks_json = call_llm(decompose_prompt, response_format="JSON")
    
    # 4. Save to vector store for semantic retrieval
    vector_store.save("VoiceNote", {
        "id": message_id,
        "raw": raw_text,
        "summary": summary,
        "tasks": tasks_json,
        "sender": sender,
        "platform": platform
    })
    
    RETURN {
        "summary": summary,
        "has_multiple_tasks": True (if tasks_json.length > 1),
        "tasks": tasks_json
    }
```

---

## 🧠 Module 3: Memory & Auto-Reply Engine

This intercepts repetitive team questions by performing semantic vector lookup.

**Pseudocode:**
```
FUNCTION check_and_reply(platform, sender, incoming_text):
    # 1. Embed query text
    query_vector = call_embedding(incoming_text)
    
    # 2. Query Vector DB (chat history + indexed voice notes)
    similar_docs = vector_store.search(query_vector, top_k=3, threshold=0.75)
    
    IF similar_docs is not empty:
        best_match = similar_docs[0]
        original_answer = best_match.get("answer") or best_match.get("summary")
        original_sender = best_match.get("sender")
        original_date = best_match.get("timestamp")
        
        # 3. Compile response with citation
        reply_text = original_answer + " (Based on discussion with " + original_sender + " on " + original_date + ")"
        
        # 4. Log auto-reply dispatch to prevent loops
        log_auto_reply(sender, incoming_text, reply_text)
        
        RETURN {
            "found_in_history": True,
            "answer": reply_text,
            "source": best_match.id
        }
    ELSE:
        RETURN {
            "found_in_history": False,
            "answer": None
        }
```

---

## 🗂️ Module 4: Knowledge Vault Indexer

This parses attachments sent in chats and organizes them in a side panel folder catalog.

**Pseudocode:**
```
FUNCTION index_file(file_object, message_id, context):
    # 1. Extract content text or vision descriptions
    IF file_object.type == "pdf":
        file_text = extract_text_from_pdf(file_object.path)
    ELIF file_object.type == "image":
        file_text = call_image_captioning(file_object.path) # Vision LLM description
    ELSE:
        file_text = file_object.filename
    
    # 2. Categorize folder using context
    folder_prompt = """
    Based on the following chat context:
    """ + context + """
    And file name: """ + file_object.filename + """
    Determine the best folder catalog (1 word only): [Contracts, Designs, Technical_Docs, Reports, Others]
    """
    folder_name = call_llm(folder_prompt)
    
    # 3. Persist metadata
    save_file_metadata(
        file_id = generate_uuid(),
        original_name = file_object.filename,
        url = file_object.url,
        folder = folder_name,
        related_message_id = message_id
    )
    
    # 4. Broadcast UI sidepanel refresh
    send_to_ui_sidepanel("REFRESH_VAULT", folder_name)
    
    RETURN {"status": "indexed", "folder": folder_name}
```

---

## 🎤 Module 5: Outgoing Voice Command

This processes recordings sent from the web UI to execute outgoing chat dispatches.

**Pseudocode:**
```
FUNCTION handle_user_voice_command(user_id, audio_input):
    # 1. Transcribe audio to text
    command_text = call_speech_to_text(audio_input)
    
    # 2. Parse intent and platforms via LLM
    intent_prompt = """
    Text: """ + command_text + """
    Extract:
    1. Target Platform: [WhatsApp, Telegram, Slack, All]
    2. Target Group/Receiver: [group name]
    3. Message Content: [text]
    Output JSON.
    """
    parsed = call_llm(intent_prompt, response_format="JSON")
    
    # 3. Dispatch to target platform Connection
    IF parsed.platform == "WhatsApp":
        send_whatsapp_message(parsed.receiver, parsed.message)
    ELIF parsed.platform == "Telegram":
        send_telegram_message(parsed.receiver, parsed.message)
    
    # 4. Notify UI Chat
    confirm_text = "[✅ Sent to " + parsed.platform + " - " + parsed.receiver + "] " + parsed.message
    send_to_ui_chat("SYSTEM", "Ghost Relay (Command)", "text", confirm_text)
    
    # 5. Persist outgoing message for context memory
    save_to_memory("OUTGOING", user_id, parsed.message, parsed.platform)
    
    RETURN {"status": "sent", "platform": parsed.platform}
```
