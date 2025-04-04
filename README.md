# Stretch Remindly

This document provides instructions on how to run and build the Stretch Reminder desktop application with Electron.

## Development

To run the app in development mode, you need to:

```
pnpm dev
```

## Building for Production

To build the app for production:

1. Build the React app:

```
pnpm build
```

2. Package the Electron app:

```
pnpm electron:build
```

## Usage

The desktop app includes features not available in the web version:

- System tray integration with quick access to timer controls
- Native desktop notifications
- Automatic startup option
- Minimize to tray functionality
- Persistent settings storage
