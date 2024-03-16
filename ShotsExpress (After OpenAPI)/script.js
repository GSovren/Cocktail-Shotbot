let menu = document.querySelector('.menu');
let navbar = document.querySelector('.nav');

menu.onclick = () => {
    navbar.classList.toggle('open');
}

const chatbotToggler = document.querySelector(".chatbot-toggler")
const chatbotCloseBtn = document.querySelector(".chatbot-close")
const sendChatbtn = document.querySelector(".chat-input i")
const chatInput = document.querySelector(".chat-input textarea")
const chatbox = document.querySelector(".chatbox")

let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

// Create a chat <li> element with passed message and className 
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "user-message" ? `<p>${message}</p>` : `<img src="images/ShotBot.png" alt=""><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateResponse = (botMessageLI) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = botMessageLI.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage}],
        })
    }

    // Send POST request to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()). then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error")
        messageElement.textContent = "Oops! Somthing went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

// Function to construct messages entered by the user
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    //clear chat input
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // append the user's message to the "chats" area 
    chatbox.appendChild(createChatLi(userMessage, "user-message"));
    // autoscroll in chatbox area 
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(()=> {
        // Display "Thinking..." message while waiting for the response
        const botMessageLI = createChatLi("Thinking...", "bot-message")
        chatbox.appendChild(botMessageLI);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(botMessageLI);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // auto resize input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keyup", (event) => {
    //If Enter Key is pressed, then handle chat
    if (event.keyCode === 13) {
        handleChat();
    }
});

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
sendChatbtn.addEventListener("click", handleChat);