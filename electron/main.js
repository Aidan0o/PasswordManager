const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

let win;

const createWindow = () => {
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    win = new BrowserWindow({
        width: Math.floor(screenWidth * 0.8),   // 80% of screen width
        height: Math.floor(screenHeight * 0.8), // 80% of screen height
        frame: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../Frontend/Assets/Password-logo.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    win.loadFile('../Frontend/Login Page.html');
}

app.whenReady().then(() => {
    createWindow();
});
