const { app, BrowserWindow } = require("electron");
const path = require("path");

require("ts-node/register");
require("../backend/src/index.ts");

async function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
  });

  if (!app.isPackaged) {
    await win.loadURL("http://localhost:7777");
  } else {
    await win.loadFile(path.join(__dirname, "../frontend/dist/index.html"));
  }
}

app.whenReady().then(createWindow);
