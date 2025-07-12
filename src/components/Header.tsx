import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Newspaper, Info, Grid3X3 } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "News", href: "/news", icon: Newspaper },
    { name: "Information", href: "/information", icon: Info },
    { name: "Features", href: "/#features", icon: Grid3X3 },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";

    return location.pathname.startsWith(href);
  };

  const scrollToMiniApps = () => {
    const element = document.getElementById("features-section");

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-soft h-16">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link className="flex items-center space-x-3 group" to="/">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-200">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-primary-600 rounded-sm" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                QuantumBytes
              </h1>
              <p className="text-xs text-secondary-500 -mt-1">
                Professional Hub
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary-50 text-primary-700 shadow-soft"
                      : "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50"
                  }`}
                  to={item.href}
                  onClick={
                    item.href === "/#features" ? scrollToMiniApps : undefined
                  }
                >
                  <Icon className="mr-2" size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4 animate-slide-up">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-primary-50 text-primary-700 shadow-soft"
                        : "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50"
                    }`}
                    to={item.href}
                    onClick={() => {
                      if (item.href === "/#features") {
                        scrollToMiniApps();
                      } else {
                        setIsMenuOpen(false);
                      }
                    }}
                  >
                    <Icon className="mr-3" size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
