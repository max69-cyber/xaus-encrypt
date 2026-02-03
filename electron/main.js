const { app, BrowserWindow } = require("electron")
const path = require("path")

async function createWindow(){
    const win = new BrowserWindow({
        width: 1000,
        height: 700
    })

    await win.loadURL("http://localhost:7777")
}

app.whenReady().then(createWindow)
