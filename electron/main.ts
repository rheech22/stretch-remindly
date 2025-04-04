import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  ipcMain,
  Notification,
  MenuItemConstructorOptions,
  NativeImage,
  Event,
} from "electron";
import path from "path";
import log from "electron-log/main";

log.initialize();

const isDev = process.env.NODE_ENV !== "production";
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    // show: false
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, "../dist/index.html");
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on("close", (event: Event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

const createTray = (): void => {
  const iconName = "iconTemplate.png";
  const iconPath = isDev
    ? path.join(__dirname, "../dist", iconName)
    : path.join(process.resourcesPath, iconName);

  log.info(`[Tray] Attempting to load tray icon from: ${iconPath}`);

  let icon: NativeImage;
  try {
    icon = nativeImage
      .createFromPath(iconPath)
      .resize({ width: 16, height: 16 });
  } catch (error) {
    log.error(`[Tray] Failed to load tray icon from ${iconPath}:`, error);
    icon = nativeImage.createEmpty();
  }

  if (!icon || icon.isEmpty()) {
    log.error(
      `[Tray] icon is empty or could not be loaded from ${iconPath}. Using fallback.`,
    );
    icon = nativeImage.createEmpty();
  }

  tray = new Tray(icon);

  const contextMenuTemplate: MenuItemConstructorOptions[] = [
    {
      label: "Open Stretch Remindly",
      click: () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        } else {
          // Show the window if it's hidden or minimized
          if (mainWindow && (!mainWindow.isVisible() || mainWindow.isMinimized())) {
            mainWindow.restore(); // Restore if minimized
            mainWindow.show(); // Show if hidden
            mainWindow.focus(); // Bring to front
          }
        }
      },
    },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ];
  const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);

  tray.setToolTip("Stretch Remindly");
  tray.setContextMenu(contextMenu);
};

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow?.show();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("show-notification", (_event, { title, body }: { title: string, body: string }) => {
  log.info(`[IPC] Received show-notification: ${title} - ${body}`);
  if (Notification.isSupported()) {
    const notification = new Notification({ title, body });
    notification.show();
    log.info(`[Notification] Showing notification: ${title}`);

    // Also bring the window to front if needed
    if (mainWindow && (!mainWindow.isVisible() || mainWindow.isMinimized())) {
      log.info('[Window] Restoring/Showing window on notification.');
      mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    } else if (mainWindow && !mainWindow.isFocused()) {
      log.info('[Window] Focusing window on notification.');
      mainWindow.focus(); // Bring to front even if visible but not focused
    }
  } else {
    log.warn("[Notification] Notifications not supported on this system.");
  }
});

// Handle request to show the main window
ipcMain.on("show-window", () => {
  log.info('[IPC] Received show-window');
  if (mainWindow) {
    if (!mainWindow.isVisible() || mainWindow.isMinimized()) {
       log.info('[Window] Restoring/Showing window.');
      mainWindow.restore();
      mainWindow.show();
    }
    log.info('[Window] Focusing window.');
    mainWindow.focus(); // Ensure it gets focus
  }
});

app.on("before-quit", () => {
  isQuitting = true;
});
