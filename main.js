const { app, BrowserWindow, ipcMain } = require('electron')
const loki = require('lokijs');
const path = require('path');

const db = new loki('notes.db');
const notes = db.addCollection('notes');

let win
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  })


  win.webContents.openDevTools();
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  if (win) {
    win.webContents.send("notes", notes.find({}));
  }

});

ipcMain.handle("note", (_, data) => {
  console.log('data', data);
  notes.insertOne(data);

  win.webContents.send("notes", notes.find({}));

});

