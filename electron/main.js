
const { app, BrowserWindow, Tray, Menu, ipcMain, Notification } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Handle electron-is-dev more gracefully
let isDev = false;
try {
  isDev = require('electron-is-dev');
} catch (e) {
  // In production, electron-is-dev might not be available
  isDev = false;
}

// Initialize settings store
const store = new Store({
  defaults: {
    workDuration: 45,
    stretchDuration: 5,
    startMinimized: false,
    runAtStartup: true
  }
});

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/app-icon.png')
  });

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:8080' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);
  
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close to tray instead of quitting
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  // Create system tray
  createTray();
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../public/tray-icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Open Stretch Reminder', 
      click: () => mainWindow.show() 
    },
    { 
      label: 'Start Timer', 
      click: () => mainWindow.webContents.send('start-timer') 
    },
    { 
      label: 'Pause Timer', 
      click: () => mainWindow.webContents.send('pause-timer') 
    },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: () => {
        app.isQuitting = true;
        app.quit();
      } 
    }
  ]);
  
  tray.setToolTip('Stretch Reminder');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

// Show native notification
function showNotification(title, body) {
  new Notification({
    title: title,
    body: body,
    icon: path.join(__dirname, '../public/app-icon.png')
  }).show();
}

// IPC event listeners
ipcMain.handle('get-settings', () => {
  return {
    workDuration: store.get('workDuration'),
    stretchDuration: store.get('stretchDuration'),
    startMinimized: store.get('startMinimized'),
    runAtStartup: store.get('runAtStartup')
  };
});

ipcMain.handle('save-settings', (event, settings) => {
  store.set(settings);
  return true;
});

ipcMain.handle('show-notification', (event, { title, body }) => {
  showNotification(title, body);
  return true;
});

// App events
app.whenReady().then(() => {
  createWindow();
  
  // Hide dock icon on macOS
  if (process.platform === 'darwin') {
    app.dock.hide();
  }
  
  // Check if app should start minimized
  if (store.get('startMinimized')) {
    mainWindow.hide();
  }
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// For macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Make sure we don't quit when closing the window
app.on('before-quit', () => {
  app.isQuitting = true;
});
