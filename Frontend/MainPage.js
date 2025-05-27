





let selectedPasswordId = null;

// Load and render stored passwords
document.addEventListener('DOMContentLoaded', async function () {
  const container = document.getElementById("password-entries");

  try {
    const response = await fetch("http://localhost:3000/passwords");
    const passwords = await response.json();
    console.log("Fetched passwords:", passwords)
    passwords.forEach(entry => {
      const row = document.createElement("div");
      row.className = "password-row";
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.padding = "8px";
      row.style.borderBottom = "1px solid #ccc";

      row.innerHTML = `
        <div>${entry.Title || "N/A"}</div>
        <div>${entry.User_ENCR || "N/A"}</div>
        <div>${entry.PSRD_ENCR || "N/A"}</div>
      `;

      const deleteBtn = document.createElement("button");
      deleteBtn.id = "delete";
      deleteBtn.innerHTML = `<img class="icon" src="./Assets/bin-svgrepo-com.svg" alt="Bin Icon" />`;
      deleteBtn.addEventListener("click", () => {
        selectedPasswordId = entry.Data_ID;
        document.getElementById("modalView2").style.display = "flex";
      });

      row.appendChild(deleteBtn);
      container.appendChild(row);
    });

  } catch (error) {
    console.error("Error fetching passwords:", error);
  }
});

// Modal elements
const modalView = document.getElementById("modalView");
const modalView2 = document.getElementById("modalView2");

const showBtn = document.getElementById("add");
const hideBtn = document.getElementById("red");
const hideDel = document.getElementById("red2");

// Show add modal
showBtn.addEventListener("click", () => {
  modalView.style.display = 'flex';
});

// Hide add modal
hideBtn.addEventListener('click', () => {
  modalView.style.display = 'none';
});

// Hide delete modal
hideDel.addEventListener("click", () => {
  modalView2.style.display = 'none';
});

// Handle adding a password
document.getElementById("green").addEventListener("click", async () => {
  const inputs = document.querySelectorAll(".inputs");
  const title = inputs[0].value;
  const username = inputs[1].value;
  const password = inputs[2].value;
  
  

  if (!title || !username || !password) {
    alert("Please fill in all fields.");
    return;
  }
  
 
  const response = await fetch("http://localhost:3000/add-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, username, password })
  });

  if (response.ok) {
    alert("Password added successfully!");
    location.reload(); // Optional: replace this with DOM insertion for smoother UX
  } else {
    alert("Failed to add password.");
  }
});

// Handle deleting a password
document.getElementById("green2").addEventListener("click", async () => {
  if (!selectedPasswordId) {
    alert("No password selected to delete.");
    return;
  }

  const response = await fetch(`http://localhost:3000/delete-password/${selectedPasswordId}`, {
    method: "DELETE"
  });

  if (response.ok) {
    alert("Password deleted successfully.");
    location.reload(); // Optional: remove row directly instead of reloading
  } else {
    alert("Failed to delete password.");
  }

  selectedPasswordId = null;
  modalView2.style.display = "none";
});

// This will redirect the user to the login page of the app when they sign out
// (MAY NEED ADDITIONAL SECURITY?)
document.getElementById("signOutButton").addEventListener("click", () => {
  window.location.href = "Login Page.html";
});
