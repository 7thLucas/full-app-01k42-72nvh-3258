import type { InformationItem, MiniApp } from "@/types";

export const mockInformation: InformationItem[] = [
  {
    id: "1",
    title: "Getting Started Guide",
    summary:
      "Complete guide to help you get started with our platform and make the most of its features.",
    content: `Welcome to our platform! This comprehensive guide will help you get started and make the most of all available features.

## Account Setup
1. Complete your profile information
2. Configure your preferences
3. Set up your dashboard
4. Invite team members (if applicable)

## Basic Features
- Dashboard overview
- Data import/export
- Report generation
- User management

## Advanced Features
- Custom integrations
- API access
- Advanced analytics
- Automation rules

## Support Resources
- Documentation portal
- Video tutorials
- Community forum
- Direct support contact

For additional help, please don't hesitate to reach out to our support team.`,
    category: "Getting Started",
    lastUpdated: "2024-01-15",
    priority: "high",
    tags: ["guide", "setup", "basics"],
  },
  {
    id: "2",
    title: "API Documentation",
    summary:
      "Comprehensive API documentation for developers looking to integrate with our platform.",
    content: `Our API provides programmatic access to all platform features, allowing you to build custom integrations and applications.

## Authentication
All API requests require authentication using API keys. You can generate API keys from your account settings.

## Base URL
\`\`\`
https://api.example.com/v1
\`\`\`

## Common Endpoints
- \`GET /users\` - List all users
- \`POST /users\` - Create a new user
- \`GET /data\` - Retrieve data
- \`POST /data\` - Submit new data

## Rate Limits
- 1000 requests per hour for free accounts
- 10000 requests per hour for premium accounts

## SDKs
We provide SDKs for popular programming languages:
- JavaScript/Node.js
- Python
- PHP
- Ruby

For complete API documentation, visit our developer portal.`,
    category: "Developer",
    lastUpdated: "2024-01-12",
    priority: "medium",
    tags: ["api", "developer", "integration"],
  },
  {
    id: "3",
    title: "Privacy Policy",
    summary:
      "Our commitment to protecting your privacy and how we handle your personal information.",
    content: `This Privacy Policy describes how we collect, use, and protect your personal information when you use our services.

## Information We Collect
- Account information (name, email, etc.)
- Usage data and analytics
- Device and browser information
- Cookies and tracking technologies

## How We Use Your Information
- To provide and improve our services
- To communicate with you
- To ensure security and prevent fraud
- To comply with legal obligations

## Information Sharing
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

## Data Security
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## Your Rights
You have the right to:
- Access your personal information
- Correct inaccurate information
- Delete your information
- Restrict processing
- Data portability

For questions about this policy, please contact our privacy team.`,
    category: "Legal",
    lastUpdated: "2024-01-10",
    priority: "high",
    tags: ["privacy", "legal", "policy"],
  },
  {
    id: "4",
    title: "Troubleshooting Common Issues",
    summary:
      "Solutions to frequently encountered problems and how to resolve them quickly.",
    content: `This guide covers solutions to the most common issues users encounter and how to resolve them.

## Login Issues
**Problem:** Cannot log in to account
**Solution:**
1. Check your email and password
2. Clear browser cache and cookies
3. Try using an incognito/private window
4. Reset your password if needed

## Performance Issues
**Problem:** Slow loading times
**Solution:**
1. Check your internet connection
2. Clear browser cache
3. Disable browser extensions
4. Try a different browser

## Data Sync Issues
**Problem:** Data not syncing properly
**Solution:**
1. Refresh the page
2. Check your internet connection
3. Log out and log back in
4. Contact support if issue persists

## Mobile App Issues
**Problem:** App crashes or won't load
**Solution:**
1. Force close and restart the app
2. Update to the latest version
3. Restart your device
4. Reinstall the app if necessary

If you continue to experience issues, please contact our support team with details about the problem.`,
    category: "Support",
    lastUpdated: "2024-01-08",
    priority: "medium",
    tags: ["troubleshooting", "support", "help"],
  },
  {
    id: "5",
    title: "Terms of Service",
    summary:
      "Terms and conditions governing the use of our platform and services.",
    content: `These Terms of Service govern your use of our platform and services. By using our services, you agree to these terms.

## Acceptance of Terms
By accessing or using our services, you agree to be bound by these terms and our Privacy Policy.

## Use of Services
You may use our services for lawful purposes only. You agree not to:
- Violate any laws or regulations
- Infringe on others' rights
- Transmit harmful or malicious content
- Attempt to gain unauthorized access

## Account Responsibilities
You are responsible for:
- Maintaining the security of your account
- All activities that occur under your account
- Keeping your information accurate and up-to-date

## Service Availability
While we strive to provide reliable service, we cannot guarantee 100% uptime. We may need to perform maintenance or updates that temporarily affect service availability.

## Limitation of Liability
Our liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages.

## Changes to Terms
We may update these terms from time to time. We will notify you of significant changes.

For questions about these terms, please contact our legal team.`,
    category: "Legal",
    lastUpdated: "2024-01-05",
    priority: "high",
    tags: ["terms", "legal", "conditions"],
  },
];

export const mockMiniApps: MiniApp[] = [
  {
    id: "1",
    name: "Task Manager",
    description: "Organize and track your tasks efficiently",
    icon: "CheckSquare",
    url: "https://tasks.example.com",
    category: "Productivity",
    featured: true,
    isActive: true,
  },
  {
    id: "2",
    name: "Calendar",
    description: "Schedule and manage your events",
    icon: "Calendar",
    url: "https://calendar.example.com",
    category: "Productivity",
    featured: true,
    isActive: true,
  },
  {
    id: "3",
    name: "Notes",
    description: "Take and organize your notes",
    icon: "FileText",
    url: "https://notes.example.com",
    category: "Productivity",
    featured: true,
    isActive: true,
  },
  {
    id: "4",
    name: "Calculator",
    description: "Advanced calculator with scientific functions",
    icon: "Calculator",
    url: "https://calc.example.com",
    category: "Utilities",
    featured: true,
    isActive: true,
  },
  {
    id: "5",
    name: "Weather",
    description: "Get current weather and forecasts",
    icon: "Cloud",
    url: "https://weather.example.com",
    category: "Information",
    featured: true,
    isActive: true,
  },
  {
    id: "6",
    name: "Timer",
    description: "Pomodoro timer and stopwatch",
    icon: "Clock",
    url: "https://timer.example.com",
    category: "Productivity",
    featured: true,
    isActive: true,
  },
  {
    id: "7",
    name: "Unit Converter",
    description: "Convert between different units",
    icon: "RefreshCw",
    url: "https://converter.example.com",
    category: "Utilities",
    featured: true,
    isActive: true,
  },
  {
    id: "8",
    name: "QR Generator",
    description: "Generate QR codes for text and URLs",
    icon: "QrCode",
    url: "https://qr.example.com",
    category: "Utilities",
    featured: true,
    isActive: true,
  },
  {
    id: "9",
    name: "Password Generator",
    description: "Generate secure passwords",
    icon: "Key",
    url: "https://password.example.com",
    category: "Security",
    featured: false,
    isActive: true,
  },
  {
    id: "10",
    name: "Color Picker",
    description: "Pick and generate color palettes",
    icon: "Palette",
    url: "https://colors.example.com",
    category: "Design",
    featured: false,
    isActive: true,
  },
  {
    id: "11",
    name: "Text Editor",
    description: "Simple text editor with formatting",
    icon: "Edit",
    url: "https://editor.example.com",
    category: "Productivity",
    featured: false,
    isActive: true,
  },
  {
    id: "12",
    name: "URL Shortener",
    description: "Shorten long URLs",
    icon: "Link",
    url: "https://short.example.com",
    category: "Utilities",
    featured: false,
    isActive: true,
  },
];
