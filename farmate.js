/**
 * FarmAte - AgrIntel's AI Assistant
 * Powered by Groq (llama-3.1-8b-instant)
 */

const FARMATE_CONFIG = {
  getApiKey: () => process.env.REACT_APP_GROQ_API_KEY || process.env.GROQ_API_KEY || "",
  model: "llama-3.1-8b-instant",
  systemPrompt: `You are FarmAte, an expert AI agricultural assistant for Indian farmers built by AgrIntel. 
You provide concise, practical advice in a warm, friendly tone. 
You specialize in: crop selection, soil health, weather impacts on farming, mandi prices, government schemes like PM Kisan, and sustainable farming.
Keep answers short and actionable (2-4 sentences max unless detail is needed).
Use simple language. Occasionally use relevant Hindi farming terms naturally.
Always be encouraging and supportive of the farmer.`
};

const FARMATE_SUGGESTIONS = [
  "Which crops suit black soil in Maharashtra?",
  "How to improve soil nitrogen level?",
  "When is the best time to sow wheat?",
  "How do I apply for PM Kisan Samman Nidhi?",
  "What are signs of soybean disease?",
  "Tips to save water using drip irrigation?"
];

let farmateHistory = [];

function createFarmateWidget(containerId, compact = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="flex flex-col h-full min-h-[500px] bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden" id="farmate-widget">
      <!-- Header -->
      <div class="flex items-center gap-sm px-md py-sm bg-primary text-white flex-shrink-0">
        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <span class="material-symbols-outlined text-white" style="font-variation-settings:'FILL' 1">smart_toy</span>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-label-lg text-white leading-tight">FarmAte</h3>
          <p class="text-[11px] text-white/80">AgrIntel AI Assistant</p>
        </div>
        <div class="flex items-center gap-xs">
          <span class="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
          <span class="text-[11px] text-white/80">Online</span>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-sm flex flex-col gap-sm" id="farmate-messages" style="scroll-behavior:smooth">
        <!-- Welcome Message -->
        <div class="flex items-end gap-xs max-w-[85%]" id="farmate-welcome">
          <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mb-1">
            <span class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings:'FILL' 1">smart_toy</span>
          </div>
          <div class="bg-surface-container px-sm py-xs rounded-2xl rounded-bl-sm">
            <p class="text-[13px] text-on-surface leading-relaxed">Namaste! 🌾 I'm <strong>FarmAte</strong>, your AI farming companion. Ask me anything about crops, soil, weather, or government schemes!</p>
          </div>
        </div>

        <!-- Suggestion Chips -->
        <div class="flex flex-wrap gap-xs mt-xs" id="farmate-suggestions">
          ${FARMATE_SUGGESTIONS.slice(0, 3).map(s => `
            <button onclick="sendFarmateMessage('${s}')" class="text-[11px] bg-primary-container/40 text-primary border border-primary/30 px-sm py-1 rounded-full hover:bg-primary-container/80 transition-colors active:scale-95 text-left">
              ${s}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Typing Indicator (hidden by default) -->
      <div class="hidden px-sm pb-xs" id="farmate-typing">
        <div class="flex items-end gap-xs max-w-[85%]">
          <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings:'FILL' 1">smart_toy</span>
          </div>
          <div class="bg-surface-container px-sm py-xs rounded-2xl rounded-bl-sm">
            <div class="flex gap-1 items-center h-4">
              <div class="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style="animation-delay:0ms"></div>
              <div class="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style="animation-delay:150ms"></div>
              <div class="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style="animation-delay:300ms"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="flex items-center gap-xs p-sm border-t border-outline-variant bg-surface flex-shrink-0">
        <input 
          id="farmate-input" 
          type="text" 
          placeholder="Ask FarmAte anything..." 
          class="flex-1 bg-surface-container-low border-none rounded-full px-md py-sm text-[13px] text-on-surface outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-outline"
          onkeydown="if(event.key==='Enter') sendFarmateFromInput()"
          autocomplete="off"
        />
        <button 
          onclick="sendFarmateFromInput()" 
          id="farmate-send"
          class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 active:scale-90 transition-all flex-shrink-0">
          <span class="material-symbols-outlined text-[20px]">send</span>
        </button>
      </div>
    </div>
  `;
}

function appendFarmateMessage(role, text) {
  const container = document.getElementById('farmate-messages');
  if (!container) return;

  // Remove suggestions after first user message
  if (role === 'user') {
    const suggestions = document.getElementById('farmate-suggestions');
    if (suggestions) suggestions.remove();
  }

  const el = document.createElement('div');
  el.className = role === 'user' 
    ? 'flex items-end gap-xs max-w-[85%] self-end ml-auto'
    : 'flex items-end gap-xs max-w-[85%]';

  if (role === 'user') {
    el.innerHTML = `
      <div class="bg-primary px-sm py-xs rounded-2xl rounded-br-sm ml-auto">
        <p class="text-[13px] text-white leading-relaxed">${escapeHtml(text)}</p>
      </div>
      <div class="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 mb-1">
        <span class="material-symbols-outlined text-on-surface-variant text-[14px]">person</span>
      </div>
    `;
  } else {
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p class="mt-1">')
      .replace(/\n/g, '<br>');
    el.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mb-1">
        <span class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings:'FILL' 1">smart_toy</span>
      </div>
      <div class="bg-surface-container px-sm py-xs rounded-2xl rounded-bl-sm">
        <p class="text-[13px] text-on-surface leading-relaxed">${formatted}</p>
      </div>
    `;
  }

  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function sendFarmateMessage(text) {
  if (!text || !text.trim()) return;

  const sendBtn = document.getElementById('farmate-send');
  const input = document.getElementById('farmate-input');
  const typing = document.getElementById('farmate-typing');

  if (sendBtn) sendBtn.disabled = true;
  if (input) input.value = '';

  appendFarmateMessage('user', text);
  farmateHistory.push({ role: 'user', content: text });

  // Show typing
  if (typing) typing.classList.remove('hidden');
  const container = document.getElementById('farmate-messages');
  if (container) container.scrollTop = container.scrollHeight;

  try {
    const messages = [
      { role: 'system', content: FARMATE_CONFIG.systemPrompt },
      ...farmateHistory.slice(-10) // keep last 10 turns
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FARMATE_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: FARMATE_CONFIG.model,
        messages: messages,
        temperature: 0.4,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    
    farmateHistory.push({ role: 'assistant', content: reply });
    if (typing) typing.classList.add('hidden');
    appendFarmateMessage('assistant', reply);

  } catch (err) {
    if (typing) typing.classList.add('hidden');
    appendFarmateMessage('assistant', `Sorry, I couldn't connect right now. Please check your internet and try again. (${err.message})`);
    console.error('FarmAte error:', err);
  } finally {
    if (sendBtn) sendBtn.disabled = false;
    if (input) input.focus();
  }
}

function sendFarmateFromInput() {
  const input = document.getElementById('farmate-input');
  if (input && input.value.trim()) {
    sendFarmateMessage(input.value.trim());
  }
}
