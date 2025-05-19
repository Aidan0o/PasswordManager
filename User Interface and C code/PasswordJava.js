const appWindow = document.getElementById("app-window");
const header = document.getElementById("app-header");
const modalView = document.getElementById("modalView");
const showBtn =   document.getElementById("add");
const hideBtn = document.getElementById("red");

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


async function GetQuestion(IDNum) {//In it's current state, the function allows a user to pass in an ID and receive all the data associated with the ID
    let Data={
        ID:IDNum//Converts the data into JSON that can communicate with the database, based on the content in passworddb
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