console.log("SnapDraft - Content Script Active");

function createAIButton() {
  const button = document.createElement("div");
 

  button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button";
  button.style.marginRight = "8px";
  button.style.backgroundColor = "#0061FE";
  button.innerHTML = "AI Reply";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate AI Reply");
  return button; 
}

function findComposeToolbar() {
  const selectors = [".btC", ".aDh", '[role="toolbar"]', ".gU.Up"];
  for (const selector of selectors) {
   
    const toolbar = document.querySelector(selector);
    if (toolbar) return toolbar;
  }
  return null;
}

function getEmailContent() {
  const selectors = [
    ".h7",
    ".a3s.aiL",
    ".gmail_quote",
    '[role="presentation"]',
  ];
  for (const selector of selectors) {
    
    const content = document.querySelector(selector);
    if (content && content.innerText.trim().length > 0) {
      return content.innerText.trim();
    }
  }
  return "";
}

async function handleButtonClick(button) {
  try {
    const emailContent = getEmailContent();
    if (!emailContent) {
      alert("Couldn't find email content to reply to.");
      return;
    }

    button.innerHTML = "Generating...";
    button.style.opacity = "0.7";

    const response = await fetch("http://localhost:8080/api/email/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailContent, tone: "professional" }),
    });

    if (!response.ok) throw new Error("API Request Failed");

    const generatedReply = await response.text();

   
    const composeBox = document.querySelector(
      '[role="textbox"][contenteditable="true"]',
    );

    if (composeBox) {
      composeBox.focus();
      
      document.execCommand("insertText", false, generatedReply);
    }
  } catch (error) {
    console.error(error);
    alert("Failed to generate reply");
  } finally {
    button.innerHTML = "AI Reply";
    button.style.opacity = "1";
  }
}

function injectButton() {
  if (document.querySelector(".ai-reply-button")) return;

  const toolbar = findComposeToolbar();
  if (!toolbar) return;

  const button = createAIButton();
  button.addEventListener("click", () => handleButtonClick(button));

  
  toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver(() => {
 
  if (document.querySelector(".btC, .aDh")) {
    injectButton();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
