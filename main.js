const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let backendProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    frame: false, // Remove default title bar
    icon: path.join(__dirname, 'assets', 'icon.png'),
    backgroundColor: '#0f172a', // Prevent white flash on load
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false,
      backgroundThrottling: false, // Keep animations smooth
      offscreen: false,
    },
  });

  // Enable hardware acceleration features
  win.webContents.setFrameRate(60);

  // Window control handlers
  const { ipcMain } = require('electron');
  ipcMain.on('window-minimize', () => win.minimize());
  ipcMain.on('window-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on('window-close', () => win.close());

  if (app.isPackaged) {
    // Production: Load static build
    win.loadFile(path.join(__dirname, 'apps/frontend/dist/index.html'));
  } else {
    // Development: Load localhost (Vite)
    win.loadURL('http://localhost:5173');
  }
}

function startBackend() {
  if (app.isPackaged) {
    const backendEntry = path.join(__dirname, 'apps/backend/dist/apps/backend/src/index.js');
    console.log('Starting backend from:', backendEntry);

    // Fork the backend process
    backendProcess = fork(backendEntry, [], {
      env: { ...process.env, NODE_ENV: 'production', PORT: 3001 },
      stdio: 'pipe'
    });

    backendProcess.on('error', (err) => {
      console.error('Backend process failed:', err);
    });
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
