# Voice Processing & Multi-Chat Integration Details

> **ARCHIVE NOTE**: This document represents the design concepts formulated during the early architectural phase. The actual implementation has been fully integrated into the codebase: Task Decomposition resides in `ai-classify.ts`, and Multi-Chat integration is managed via the `@chat-adapter/*` package interfaces. See the actual `apps/backend/src/` code directories for current implementations.

---

This document outlines the detailed specifications of two core aspects of the **Ghost Relay** system: **Task Decomposition from Voice Notes** and **Multi-Chat Integrations (WhatsApp / Telegram / Slack)**.

---

## Part 1: Task Decomposition from Voice Notes (Structured LLM Outputs)

This component forms the cognitive engine of the system. The objective is to convert messy, conversational voice note transcripts into structured data payloads (JSON) that can be processed programmatically.

### A. Core Strategy: Structured Output (JSON Mode)

To enforce consistent JSON structures from Qwen/LLM outputs without raw text wrapping (like markdown code blocks ` ```json ` that could break JSON parsing), we configure the API with **Structured Output**:

1. **Set `response_format` Parameter**: In the LLM API request payload, set `response_format` to `{"type": "json_object"}`.
2. **Include "JSON" in the Prompt**: Ensure that the keyword "JSON" is present in the *system* or *user* prompt message (case-insensitive). Failing to include this word when JSON mode is enabled triggers an API validation error.

> **Note**: Structured Output is natively supported across Qwen models (e.g., `qwen-plus`, `qwen-max`, `qwen-flash`) when reasoning/thinking states are disabled.

### B. Prompt Design for Task Decomposition

We use a **schema-first** prompt design to dictate the exact JSON properties expected from the LLM.

**System Instructions & Prompt Design:**

```
System:
You are an AI assistant tasked with converting meeting voice note transcripts into structured task lists.
Extract the following information from the provided text and return ONLY a valid JSON object matching the schema below.

JSON Schema:
{
  "ringkasan": "string, a 1-2 sentence overall summary of the voice note",
  "tanggal_deadline": "string or null, date formatted as YYYY-MM-DD if explicitly mentioned",
  "daftar_tugas": [
    {
      "divisi": "string, responsible department (backend, frontend, desain, qa, devops, or general)",
      "deskripsi": "string, a clear and concise description of the task",
      "prioritas": "string, one of: tinggi, sedang, rendah"
    }
  ]
}

Rules:
- If a field is not mentioned in the text, assign it a null value.
- Do not add facts or assumptions not directly supported by the text.
- Return ONLY the single JSON object. No extra text or markdown wrapping blocks.
- Preserve original keywords from the transcript where possible.

Voice Note Transcript:
{raw_text_from_transcript}
```

### C. End-to-End Pseudocode Flow

Here is how the backend module runs this pipeline asynchronously:

```
FUNCTION process_voice_note(platform, sender, audio_file, message_id):
    # 1. Transcribe audio to text (ASR)
    raw_text = call_speech_to_text(audio_file)

    # 2. Compile prompt
    prompt = """
    System:
    You are an AI assistant tasked with converting meeting voice note transcripts into structured task lists.
    Extract the following information from the provided text and return ONLY a valid JSON object.

    JSON Schema:
    {
      "ringkasan": "string, overall summary (1-2 sentences)",
      "tanggal_deadline": "string or null (YYYY-MM-DD)",
      "daftar_tugas": [
        {
          "divisi": "string (backend/frontend/desain/qa/devops/general)",
          "deskripsi": "string (clear description)",
          "prioritas": "string (tinggi/sedang/rendah)"
        }
      ]
    }

    Voice Note Transcript:
    """ + raw_text
   
    # 3. Call LLM API in JSON Mode
    response = call_llm_api(
        model="qwen-plus",
        messages=[
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )

    # 4. Parse JSON content safely
    tasks_json = JSON.parse(response.choices[0].message.content)
    
    # 5. Fallback validation
    IF tasks_json is invalid:
        tasks_json = try_fix_json(tasks_json, raw_text)

    # 6. Save to memory and return
    vector_store.save("VoiceNote", { "id": message_id, "raw": raw_text, ...tasks_json })
    
    RETURN {
        "summary": tasks_json.ringkasan,
        "tasks": tasks_json.daftar_tugas,
        "deadline": tasks_json.tanggal_deadline
    }
```

---

## Part 2: Multi-Chat Integration (WhatsApp, Telegram, Slack)

This is the messaging adapter layer of the platform, enabling connection to external chats.

### A. WhatsApp Business API
We interface with the official **WhatsApp Business Cloud API** (via webhooks for incoming events and direct API endpoints for sending messages):
1. **Webhook Setup**: Configure a POST endpoint (e.g., `/webhook/whatsapp`) to receive JSON event payloads from Meta, verified using a set `Verify Token`.
2. **Sending Messages**: POST payload to `https://graph.facebook.com/v23.0/{phone-number-id}/messages` authorized via `Bearer {access-token}`.

### B. Telegram Bot API
Telegram utilizes Bot tokens and handles webhook dispatch:
1. **Webhook Registration**: Call `setWebhook` API pointing to our public endpoint `https://api.telegram.org/bot{TOKEN}/setWebhook?url={YOUR_URL}/webhook/telegram`.
2. **Sending Messages**: POST raw payload to `/sendMessage` endpoint matching user/chat IDs.

### C. Slack API
Slack integrations connect via standard OAuth and Socket Mode:
1. **Socket Mode**: Enables local development by establishing a WebSocket connection (`wss://`) without exposing a public HTTPS endpoint.
2. **Events**: Listens for occurrences like `app_mention` and replies using the Bolt SDK `WebClient.chat.postMessage` functions.

---

### D. The Orchestrator Pattern
To abstract platform differences, the architecture routes all actions through an **Orchestrator Pattern**:

```
CLASS MessageOrchestrator:
    - whatsapp_client
    - telegram_bot
    - slack_app
    
    FUNCTION start():
        register_webhook_routes()
        
    FUNCTION handle_incoming_webhook(platform, request_payload):
        parsed_message = parse_platform_data(platform, request_payload)
        self.route_to_core_router(
            sender=parsed_message.sender,
            content=parsed_message.content,
            platform=platform
        )
        
    FUNCTION send_message_to_platform(platform, recipient, message):
        IF platform == "whatsapp":
            self.whatsapp_client.send_text(recipient, message)
        ELIF platform == "telegram":
            self.telegram_bot.send_message(recipient, message)
        ELIF platform == "slack":
            self.slack_app.send_message(recipient, message)
```

By placing this orchestrator layer in front of our domain services, the main application remains agnostic to the originating chat platform, simplifying code maintenance.
