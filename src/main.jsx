import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./routes/route.jsx";
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/components/theme-provider";

createRoot(document.getElementById("root")).render(
  <ThemeProvider defaultTheme="dark" storageKey="theme">
    <RouterProvider router={router} />
  </ThemeProvider>
);
