// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import { ReactNode } from "react";

import Header from "./Header";
import Footer from "./Footer";
import AIAssistants from "./AIAssistants";

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
  return (
    <>
      <div className="min-h-screen flex flex-col bg-secondary-50">
        <Header />
        <main className={`flex-1 ${className}`}>{children}</main>
      </div>

      <AIAssistants />

      {!hideFooter && <Footer />}
    </>
  );
}
