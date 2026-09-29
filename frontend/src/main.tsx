import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              "!bg-[#E8EEF0] !text-[#1E2B57] !border !border-[#1E2B57]/20 !rounded-lg",
            description: "!text-[#1E2B57]/70",
            actionButton: "!bg-[#1E2B57] !text-[#F4F6F4]",
            success: "!text-[#2E7D55]",
            error: "!text-[#C2334D] !border-[#C2334D]/40",
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
);
