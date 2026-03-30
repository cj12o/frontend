import "./App.css";
import { Outlet } from "react-router-dom";
import { Header } from "./components/index.js";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import {
  TopicContextProvider,
  RoomContextProvider,
  ErrorContextProvider,
  AIModeContextProvider,
} from "./providers/index.ts";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <div className="w-full h-full">
        <Header />
        <AIModeContextProvider>
          <TopicContextProvider>
            <RoomContextProvider>
              <ErrorContextProvider>
                <SidebarProvider>
                  <AppSidebar />
                  <main className="flex-1 overflow-auto">
                    <Outlet />
                  </main>
                </SidebarProvider>
              </ErrorContextProvider>
            </RoomContextProvider>
          </TopicContextProvider>
        </AIModeContextProvider>
      </div>
    </TooltipProvider>
  );
}

export default App;
