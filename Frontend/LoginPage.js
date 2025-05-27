const appWindow = document.getElementById("app-window");
const header = document.getElementById("app-header");

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

//async function checkLogin(user, pass) 

document.getElementById("submission").onclick = async function(event) {
    const uID = document.getElementById("testID").value;
    const password = document.getElementById("testPass").value;

    const response = await fetch("http://localhost:3000/getTestData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uID, password })
    });

    const data = await response.json();
    console.log("Login response:", data); // for debugging

    if (data.ToF === true) {
        window.location.href = "MainPage.html";
    } else {
        alert("Invalid login, please try again");
    }
};

