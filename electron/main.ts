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
import log from "electron-log/main"; // electron-log 임포트

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
    // 'show: false' was removed here
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
    icon = nativeImage.createFromPath(iconPath);
    if (process.platform === "darwin" && icon) {
      icon = icon.resize({ width: 16, height: 16 });
    }
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
      label: "Show App",
      click: () => {
        mainWindow?.show();
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

  tray.on("click", () => {
    mainWindow?.show();
  });
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

ipcMain.on("show-notification", (_event, title: string, body: string) => {
  if (Notification.isSupported()) {
    const notification = new Notification({ title, body });
    notification.show();
  } else {
    log.info("[Notification] Notifications not supported on this system.");
  }
});

app.on("before-quit", () => {
  isQuitting = true;
});
