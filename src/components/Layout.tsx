// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import { ReactNode, useState } from "react";
import { MessageCircle } from "lucide-react";

import Header from "./Header";
import Footer from "./Footer";

import { useAssistants } from "@/hooks/useAssistants";

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
  const { assistants, loading, error } = useAssistants();

  return (
    <>
      <div className="min-h-screen flex flex-col bg-secondary-50">
        <Header />
        <main className={`flex-1 ${className}`}>{children}</main>
      </div>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50" id="open-assistants">
        {showAssistants && (
          <div className="absolute bottom-16 right-0 w-64 bg-white rounded-lg shadow-lg overflow-hidden mb-2">
            <div className="p-2 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Select an Assistant</h3>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {loading && <p>Loading assistants...</p>}
              {error && <p>Error loading assistants: {error}</p>}
              {assistants &&
                assistants.map((assistant) => (
                  <div
                    key={assistant._id}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    // onClick={() => handleAssistantSelect(assistant.id)}
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
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-primary-600"
          onClick={() => setShowAssistants(!showAssistants)}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </div>
      {!hideFooter && <Footer />}
    </>
  );
}
