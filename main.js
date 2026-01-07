const { app, BrowserWindow, ipcMain } = require('electron')
const loki = require('lokijs')
const path = require('path')

const adapter = new loki.LokiFsAdapter()
const dbPath = path.join(app.getPath('userData'), 'notes.json')

let db
let notes
let win

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  db = new loki(dbPath, {
    adapter,
    autoload: true,
    autosave: true,
    autosaveInterval: 1000,
    autoloadCallback: () => {
      notes = db.getCollection('notes') || db.addCollection('notes')

      createWindow()

      win.webContents.once('did-finish-load', () => {
        win.webContents.send('notes', notes.find())
      })
    }
  })
})

ipcMain.handle('note', (_, data) => {
  notes.insert(data)
  db.saveDatabase()
  win.webContents.send('notes', notes.find())
})
