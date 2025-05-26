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

document.getElementById("submission").onclick = async function(event) {//fetch and await only work in asynchronous functions    

    //console.log("Success")
    let Data={
        uID:document.getElementById("testID"), password:document.getElementById("testPass")//allows the data that is returned to be sourced directly from the HTML
        //puts the data into a form where it can be combined with Json data to alter what is called
    }
    const response=await fetch("/getTestData", {
        method:"POST",
        body:JSON.stringify(Data),
        headers:{
            "Content-Type":"application/json"
        }
    });
    const data = await response.json();//this is where true or false is returned
    //console.log(data);
    if(data==true){
        window.location.href = "MainPage.html"; // This will redirect the user to the main page of the app
    }
    else{
        alert("Invalid login, please try again");
    }
};
