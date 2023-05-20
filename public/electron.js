const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const electronReload = require("electron-reload");

if (process.env.NODE_ENV === "development") {
  electronReload(__dirname, {
    electron: path.join(__dirname, "..", "node_modules", ".bin", "electron"),
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
