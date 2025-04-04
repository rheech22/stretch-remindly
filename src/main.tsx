import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./router"; // Import the router object
import { RouterProvider } from "react-router-dom"; // Import RouterProvider
import { TimerProvider } from "./contexts/TimerContext"; // Import TimerProvider

createRoot(document.getElementById("root")!).render(
  <TimerProvider> 
    <RouterProvider router={router} />
  </TimerProvider>
);
