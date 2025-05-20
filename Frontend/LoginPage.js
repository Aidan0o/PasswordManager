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
