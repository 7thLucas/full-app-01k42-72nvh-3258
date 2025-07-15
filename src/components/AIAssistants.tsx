// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ChevronLeft, Send, Loader2 } from "lucide-react";
import { ulid } from "ulid";
import ReactMarkdown from "react-markdown";

import { useAssistants, useChatSession } from "@/hooks/useAssistants";
import { AssistantItem } from "@/types";

export default function AIAssistants() {
  const [showAssistants, setShowAssistants] = useState(false);
  const [selectedAssistant, setSelectedAssistant] =
    useState<AssistantItem | null>(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { assistants, loading, error } = useAssistants();
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId || ulid();

  if (!storedUserId) {
    localStorage.setItem("userId", userId);
  }

  const {
    session,
    loading: sessionLoading,
    error: sessionError,
    sendMessage,
    isSending,
  } = useChatSession(selectedAssistant?._id, userId);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

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

  if (!assistants || assistants.length === 0) {
    return <></>;
  }

  return (
    <div ref={popoverRef} className="fixed bottom-6 right-6 z-50">
      {selectedAssistant ? (
        <div
          className="absolute bottom-20 right-0 w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
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
            <div className="space-y-4">
              {sessionLoading && (
                <p className="text-center text-sm text-gray-500">
                  Loading chat session...
                </p>
              )}
              {sessionError && (
                <p className="text-center text-sm text-red-500">
                  Error loading chat session: {sessionError}
                </p>
              )}
              {session?.messages?.length ? (
                session.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-primary-100 text-gray-800 rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-8">
                  Start chatting with {selectedAssistant.name}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <form
              className="flex space-x-2 items-center"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await sendMessage(message);
                  setMessage("");
                } catch (err) {
                  console.error("Error sending message:", err);
                }
              }}
            >
              <input
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isSending}
                placeholder="Type a message..."
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="p-2 bg-primary-600 text-white rounded-full size-10 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={!message.trim() || isSending}
                type="submit"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {/* Assistant Selector */}
      <div className="relative">
        {showAssistants && (
          <div className="absolute bottom-16 right-0 w-64 bg-white rounded-lg shadow-lg overflow-hidden mb-2">
            <div className="p-2 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Select an Assistant</h3>
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
  );
}
