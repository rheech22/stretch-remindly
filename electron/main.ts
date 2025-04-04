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
import path from "node:path";
import { fileURLToPath } from "node:url";
import log from "electron-log"; // Revert back to just 'electron-log'
import Store from "electron-store"; // Revert back to import

// Define the shape of the settings object
interface Settings {
  workDuration: number;
  stretchDuration: number;
  startMinimized: boolean;
  runAtStartup: boolean;
}

// Initialize electron-store with defaults
const store: Store<Settings> = new Store<Settings>({
  defaults: {
    workDuration: 25 * 60, // Default 25 minutes
    stretchDuration: 5 * 60, // Default 5 minutes
    startMinimized: false,
    runAtStartup: false,
  },
});

log.initialize();

const isDev = process.env.NODE_ENV !== "production";
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

// Get the directory name using import.meta.url
const currentDir = path.dirname(fileURLToPath(import.meta.url));

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(currentDir, "preload.js"), // Use currentDir
      nodeIntegration: false,
      contextIsolation: true,
    },
    // show: false
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // Use currentDir to build the path to index.html
    const indexPath = path.join(currentDir, "../dist/index.html");
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
    ? path.join(currentDir, "../dist", iconName)
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

// Handle get-settings event from renderer process
ipcMain.handle("get-settings", async (): Promise<Partial<Settings>> => {
  try {
    // Retrieve all settings and log them immediately
    const workDuration = store.get("workDuration");
    const stretchDuration = store.get("stretchDuration");
    const startMinimized = store.get("startMinimized");
    const runAtStartup = store.get("runAtStartup");

    log.info(`[IPC] Retrieved from store - workDuration: ${workDuration} (type: ${typeof workDuration})`);
    log.info(`[IPC] Retrieved from store - stretchDuration: ${stretchDuration} (type: ${typeof stretchDuration})`);
    log.info(`[IPC] Retrieved from store - startMinimized: ${startMinimized}`);
    log.info(`[IPC] Retrieved from store - runAtStartup: ${runAtStartup}`);

    const settings: Partial<Settings> = {
      workDuration: workDuration,
      stretchDuration: stretchDuration,
      startMinimized: startMinimized,
      runAtStartup: runAtStartup,
    };
    // log.info("[IPC] Returning settings:", settings); // Keep this log if needed
    return settings;
  } catch (error) {
    log.error("[IPC] Error getting settings:", error);
    return {};
  }
});

// Handle save-settings event from renderer process
ipcMain.handle("save-settings", async (event, settings: Partial<Settings>) => {
  try {
    // Use store.set() to save partial settings (it handles merging)
    store.set(settings);
    // console.log('Settings saved via store.set()', store.get()); // Optional: Log all saved settings
    return true; // Indicate success
  } catch (error) {
    console.error("Failed to save settings:", error);
    return false; // Indicate failure
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
