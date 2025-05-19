document.addEventListener('DOMContentLoaded', async function () {
  const appNameContainer = document.getElementById("app-name");
  const usernameContainer = document.getElementById("username");
  const passwordContainer = document.getElementById("password");

  try {
    const response = await fetch("http://localhost:3000/passwords");
    const passwords = await response.json();

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

  } catch (error) {
    console.error("Error fetching passwords:", error);
  }
});
