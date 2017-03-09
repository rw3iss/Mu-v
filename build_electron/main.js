const electron = require('electron')
// Module to control application life.
const app = global.__app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

require('electron-reload')(__dirname + '/../src');
console.log("Autoreload on dir: ", __dirname + '/../src');

//const appController = require('./lib/appcontroller')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  global.__mainWindow = mainWindow;

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  //mainWindow.loadURL('http://localhost:8080');

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  //appController.loadMovies();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


/* talk to electron from React app */
const EventBus = require('eventbusjs');
const dialog = electron.dialog;
EventBus.addEventListener("OPEN_FILE", function() {
  console.log("OPEN FILE EVENT");
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
});


// app.on('minimize', function () {
//   console.log("Minimize");
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   mainWindow.loadUrl(url.format({
//     pathname: path.join(__dirname, 'index.html'),
//     protocol: 'file:',
//     slashes: true
//   }))
// })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
