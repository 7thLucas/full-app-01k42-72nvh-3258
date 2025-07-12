import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  Heart,
  ExternalLink
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [
      { name: "News", href: "/news" },
      { name: "Information", href: "/information" },
      { name: "MiniApps", href: "#miniapps" },
      { name: "Help Center", href: "/help" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Disclaimer", href: "/disclaimer" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com", icon: Twitter },
    { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
    { name: "GitHub", href: "https://github.com", icon: Github },
  ];

  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-3 group mb-6">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary-600 rounded-sm"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                    QuantumBytes
                  </h3>
                  <p className="text-xs text-secondary-400 -mt-1">
                    Professional Hub
                  </p>
                </div>
              </Link>
              <p className="text-secondary-400 mb-6 leading-relaxed">
                Your comprehensive hub for news, information, and powerful mini-applications. 
                Built with modern technology for professional excellence.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail size={16} className="mr-3 text-primary-400" />
                  <a 
                    href="mailto:contact@quantumbytes.com" 
                    className="hover:text-primary-400 transition-colors"
                  >
                    contact@quantumbytes.com
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <Phone size={16} className="mr-3 text-primary-400" />
                  <a 
                    href="tel:+1-555-123-4567" 
                    className="hover:text-primary-400 transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin size={16} className="mr-3 text-primary-400" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
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
              <span>© {currentYear} QuantumBytes. All rights reserved.</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                Made with <Heart size={14} className="mx-1 text-red-400" /> for professionals
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-400 hover:text-primary-400 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 