
# Stretch Reminder - Electron App

This document provides instructions on how to run and build the Stretch Reminder desktop application with Electron.

## Development

To run the app in development mode, you need to:

1. Start the Vite development server:
```
npm run dev
```

2. In a separate terminal, start Electron pointing to the development server:
```
npx electron electron/main.js
```

## Building for Production

To build the app for production:

1. Build the React app:
```
npm run build
```

2. Package the Electron app:
```
npx electron-builder
```

## Adding to package.json

Since the package.json file is read-only in this project, you'll need to manually add these scripts to your package.json file:

```json
"scripts": {
  "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:8080 && electron electron/main.js\"",
  "electron:build": "npm run build && electron-builder"
},
"main": "electron/main.js",
"build": {
  "appId": "com.stretchreminder.app",
  "productName": "Stretch Reminder",
  "files": [
    "dist/**/*",
    "electron/**/*"
  ],
  "directories": {
    "buildResources": "public",
    "output": "release"
  },
  "mac": {
    "category": "public.app-category.healthcare-fitness"
  },
  "win": {
    "target": "nsis"
  },
  "linux": {
    "target": "AppImage"
  },
  "extraMetadata": {
    "main": "electron/main.js"
  }
}
```

You'll also need to install these additional dependencies:
```
npm install electron-store concurrently wait-on electron-builder --save-dev
```

And ensure electron-is-dev is installed as a production dependency:
```
npm install electron-is-dev
```

## Icons

Replace the placeholder icon files in the public directory:
- `public/app-icon.png` - Main application icon
- `public/tray-icon.png` - System tray icon (should be smaller, ideally 16x16 or 32x32)

## Usage

The desktop app includes features not available in the web version:
- System tray integration with quick access to timer controls
- Native desktop notifications
- Automatic startup option
- Minimize to tray functionality
- Persistent settings storage

Enjoy using Stretch Reminder as a desktop application!
