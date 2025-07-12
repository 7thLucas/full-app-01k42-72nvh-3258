import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    resources: [
      { name: "News", href: "/news" },
      { name: "Information", href: "/information" },
      { name: "Features", href: "/#features" },
    ],
  };

  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link className="flex items-center space-x-3 group mb-6" to="/">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary-600 rounded-sm" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                    QuantumByte
                  </h3>
                  <p className="text-xs text-secondary-400 -mt-1">
                    Professional Hub
                  </p>
                </div>
              </Link>
              <p className="text-secondary-400 mb-6 leading-relaxed">
                Your comprehensive hub for news, information, and powerful
                features.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="mr-3 text-primary-400" size={16} />
                  <a
                    className="hover:text-primary-400 transition-colors"
                    href="mailto:contact@quantumbyte.ai"
                  >
                    contact@quantumbyte.ai
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-3 text-primary-400" size={16} />
                  <a
                    className="hover:text-primary-400 transition-colors"
                    href="tel:+6281234567890"
                  >
                    +62 812 3456 7890
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-3 text-primary-400" size={16} />
                  <span>Indonesia</span>
                </div>
              </div>
            </div>

            {/* Resources Links */}
            <div className="lg:col-start-4">
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
                      to={link.href}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-secondary-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center text-sm text-secondary-400">
              <span>© {currentYear} QuantumByte. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
