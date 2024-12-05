const API_KEY = 'key';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

let currentLanguage = localStorage.getItem('language') || 'en';
let isDarkMode = localStorage.getItem('darkMode') === 'true';

let currentChatId = Date.now();
let chats = JSON.parse(localStorage.getItem('chats') || '{}');

const greetings = {
    am: [
        "ሰላም",
        "እንደምን አደርክ/ሽ",
        "እንኳን ደህና መጣህ/ሽ",
        "ጤና ይስጥልኝ"
    ],
    en: [
        "Hello",
        "Welcome",
        "Greetings",
        "How can I help you today?"
    ]
};

const translations = {
    am: {
        newChat: "አዲስ ውይይት",
        history: "የውይይት ታሪክ",
        settings: "ቅንብሮች",
        darkMode: "ጨለማ ሁነታ",
        deleteAll: "ሁሉንም ሰርዝ",
        confirmDelete: "እርግጠኛ ነዎት ሁሉንም ታሪክ መሰረዝ ይፈልጋሉ?",
        noHistory: "ምንም ታሪክ አልተገኘም",
        inputPlaceholder: "በአማርኛ ወይም በእንግሊዘኛ ጻፍ...",
        error: "ይቅርታ፣ ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።"
    },
    en: {
        newChat: "New Chat",
        history: "Chat History",
        settings: "Settings",
        darkMode: "Dark Mode",
        deleteAll: "Delete All",
        confirmDelete: "Are you sure you want to delete all chat history?",
        noHistory: "No chat history found",
        inputPlaceholder: "Type in English or Amharic...",
        error: "Sorry, I encountered an error. Please try again."
    }
};

function initializeTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon();
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.bx-moon');
    if (themeIcon) {
        themeIcon.classList = isDarkMode ? 'bx bx-sun' : 'bx bx-moon';
    }
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'am' : 'en';
    localStorage.setItem('language', currentLanguage);
    updateUIText();
}

function updateUIText() {
    const texts = translations[currentLanguage];
    userInput.placeholder = texts.inputPlaceholder;
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (texts[key]) {
            element.textContent = texts[key];
        }
    });
}

function saveChat(chatId, message, isUser) {
    if (!chats[chatId]) {
        chats[chatId] = [];
    }
    chats[chatId].push({
        message,
        isUser,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('chats', JSON.stringify(chats));
}

function startNewChat() {
    if (chatMessages.children.length > 0) {
        saveCurrentChat();
    }
    chatMessages.innerHTML = '';
    currentChatId = Date.now();
    userInput.value = '';
    userInput.focus();
    
    const greeting = greetings[currentLanguage][Math.floor(Math.random() * greetings[currentLanguage].length)];
    addMessage(greeting, false);
}

function displayChatHistory() {
    const historyContainer = document.getElementById('history-container');
    historyContainer.innerHTML = '';
    
    const sortedChatIds = Object.keys(chats).sort((a, b) => b - a);
    
    if (sortedChatIds.length === 0) {
        historyContainer.innerHTML = `<div class="no-history">${translations[currentLanguage].noHistory}</div>`;
        return;
    }
    
    const deleteAllBtn = document.createElement('button');
    deleteAllBtn.className = 'delete-all-btn';
    deleteAllBtn.innerHTML = `<i class='bx bx-trash'></i> ${translations[currentLanguage].deleteAll}`;
    deleteAllBtn.onclick = deleteAllHistory;
    historyContainer.appendChild(deleteAllBtn);
    
    sortedChatIds.forEach(chatId => {
        const chatPreview = document.createElement('div');
        chatPreview.className = 'chat-preview';
        
        const firstMessage = chats[chatId][0]?.message || 'Empty chat';
        const date = new Date(parseInt(chatId)).toLocaleString(currentLanguage === 'am' ? 'am-ET' : 'en-US');
        
        chatPreview.innerHTML = `
            <div class="chat-preview-content">
                <div class="chat-preview-header">
                    <span>${date}</span>
                    <button class="delete-chat-btn" onclick="deleteChat('${chatId}', event)">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
                <div class="chat-preview-text">${firstMessage.substring(0, 50)}...</div>
            </div>
        `;
        
        chatPreview.onclick = (e) => {
            if (!e.target.closest('.delete-chat-btn')) {
                loadChat(chatId);
            }
        };
        
        historyContainer.appendChild(chatPreview);
    });
    
    document.getElementById('history-modal').style.display = 'block';
}

function startVoiceInput() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = currentLanguage === 'am' ? 'am-ET' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            userInput.placeholder = currentLanguage === 'am' ? 'እያዳመጥኩ ነው...' : 'Listening...';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            userInput.placeholder = translations[currentLanguage].inputPlaceholder;
        };

        recognition.onend = () => {
            userInput.placeholder = translations[currentLanguage].inputPlaceholder;
        };

        recognition.start();
    } else {
        alert(currentLanguage === 'am' ? 'የድምፅ ግብዓት በዚህ ብራውዘር አይደገፍም' : 'Voice input is not supported in this browser');
    }
}

function attachFile() {
    alert(currentLanguage === 'am' ? 'የፋይል መጫን በቅርብ ጊዜ ይጨመራል' : 'File attachment coming soon');
}

async function generateResponse(prompt) {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate response');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'assistant-message');

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;

    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    saveChat(currentChatId, message, isUser);
}

async function handleUserInput() {
    const userMessage = userInput.value.trim();
    
    if (userMessage) {
        addMessage(userMessage, true);
        userInput.value = '';
        
        const sendBtn = document.querySelector('.send-btn i');
        sendBtn.classList.replace('bx-send', 'bx-loader-alt');
        sendBtn.style.animation = 'spin 1s linear infinite';
        
        try {
            const botMessage = await generateResponse(userMessage);
            addMessage(botMessage, false);
        } catch (error) {
            console.error('Error:', error);
            addMessage(translations[currentLanguage].error, false);
        } finally {
            sendBtn.classList.replace('bx-loader-alt', 'bx-send');
            sendBtn.style.animation = '';
            userInput.focus();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    updateUIText();
    startNewChat();
});

sendButton.addEventListener('click', handleUserInput);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});

userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
});