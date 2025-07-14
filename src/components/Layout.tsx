// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import { ReactNode, useState, useRef, useEffect } from "react";
import { MessageCircle, X, ChevronLeft } from "lucide-react";

import Header from "./Header";
import Footer from "./Footer";

import { useAssistants } from "@/hooks/useAssistants";
import { AssistantItem } from "@/types";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  hideFooter?: boolean;
}

export default function Layout({
  children,
  className = "",
  hideFooter = false,
}: LayoutProps) {
  const [showAssistants, setShowAssistants] = useState(false);
  const [selectedAssistant, setSelectedAssistant] =
    useState<AssistantItem | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { assistants, loading, error } = useAssistants();

  const handleAssistantClick = (assistant: AssistantItem) => {
    setSelectedAssistant(assistant);
    setShowAssistants(false);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowAssistants(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-secondary-50">
        <Header />
        <main className={`flex-1 ${className}`}>{children}</main>
      </div>

      {/* Assistant Chat Popover */}
      <div ref={popoverRef} className="fixed bottom-6 right-6 z-50">
        {selectedAssistant ? (
          <div
            className="absolute bottom-20 right-0 w-90 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
            style={{ height: "70vh", maxHeight: "600px" }}
          >
            <div className="p-4 bg-primary-600 text-white flex items-center">
              <button
                aria-label="Back to assistants"
                className="mr-2 p-1 hover:bg-primary-700 rounded-full"
                onClick={() => {
                  setSelectedAssistant(null);
                  setShowAssistants(true);
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-medium flex-1">{selectedAssistant.name}</h3>
              <button
                aria-label="Close chat"
                className="p-1 hover:bg-primary-700 rounded-full"
                onClick={() => {
                  setSelectedAssistant(null);
                  setShowAssistants(false);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="text-sm text-gray-600 mb-4">
                {selectedAssistant.description}
              </div>
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-500 py-8">
                  Start chatting with {selectedAssistant.name}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Type a message..."
                  type="text"
                />
                <button className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Assistant Selector */}
        <div className="relative">
          {showAssistants && (
            <div className="absolute bottom-16 right-0 w-64 bg-white rounded-lg shadow-lg overflow-hidden mb-2">
              <div className="p-2 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">
                  Select an Assistant
                </h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {loading && (
                  <p className="p-3 text-sm text-gray-500">
                    Loading assistants...
                  </p>
                )}
                {error && (
                  <p className="p-3 text-sm text-red-500">
                    Error loading assistants: {error}
                  </p>
                )}
                {assistants &&
                  assistants.map((assistant: any) => (
                    <div
                      key={assistant._id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleAssistantClick(assistant)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAssistantClick(assistant);
                        }
                      }}
                    >
                      <div className="font-medium text-gray-900">
                        {assistant.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {assistant.description}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          <button
            aria-label="Chat with AI Assistant"
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-primary-600 hover:bg-primary-700 transition-colors"
            onClick={() => setShowAssistants(!showAssistants)}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {!hideFooter && <Footer />}
    </>
  );
}
