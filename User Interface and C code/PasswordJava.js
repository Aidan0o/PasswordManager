const appWindow = document.getElementById("app-window");
const header = document.getElementById("app-header");
const modalView = document.getElementById("modalView");
const showBtn =   document.getElementById("add");
const hideBtn = document.getElementById("red");

// Allows you to resize and move the UI window
showBtn.addEventListener("click",() => {
    modalView.style.display = 'flex';
})

hideBtn.addEventListener('click', () => {
    modalView.style.display = 'none';
})

let offsetX = 0, offsetY = 0, isDragging = false;

header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - appWindow.offsetLeft;
    offsetY = e.clientY - appWindow.offsetTop;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      appWindow.style.left = `${e.clientX - offsetX}px`;
      appWindow.style.top = `${e.clientY - offsetY}px`;
    }
});


async function GetQuestion(IDNum) { // In it's current state, the function allows a user to pass in an ID and receive all the data associated with the ID
    let Data={
        ID:IDNum //Converts the data into JSON that can communicate with the database, based on the content in password.db
    }
    const response=await fetch("/get-data", {
        method:"POST",
        body:JSON.stringify(Data),
        headers:{
            "Content-Type":"application/json"
        }
    });
    const data = await response.json();
}

// Loads stored credentials for a specific user on successful login
document.addEventListener('DOMContentLoaded', async function () {
  const appNameContainer = document.getElementById("app-name");
  const usernameContainer = document.getElementById("username");
  const passwordContainer = document.getElementById("password");

  try {
    const response = await fetch("http://localhost:3000/passwords");
    const passwords = await response.json();

    // Backend for the list of stored credentials
    passwords.forEach(entry => {
      const appName = document.createElement("p");
      appName.textContent = entry.Title || "N/A";
      appNameContainer.appendChild(appName);

      const username = document.createElement("p");
      username.textContent = entry.User_ENCR || "N/A";
      usernameContainer.appendChild(username);

      const password = document.createElement("p");
      password.textContent = entry.PSRD_ENCR || "N/A";
      passwordContainer.appendChild(password);
    });

    // Prevents program crashing if an error occurs
  } catch (error) {
    console.error("Error fetching passwords:", error);
  }
});
