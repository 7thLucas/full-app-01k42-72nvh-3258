# Modules Directory

This directory contains all the modules for this application. Each module is a self-contained unit with all related components, utilities, and functions inside its own directory.

## Structure

All modules follow this structure:
```
module-name/
├── page.tsx            # Required - main module page
├── components/         # Optional - module-specific components
├── hooks/              # Optional - module-specific hooks
├── utils/              # Optional - module-specific utilities
├── services/           # Optional - module-specific services
├── types/              # Optional - module-specific types
├── constants/          # Optional - module-specific constants
├── assets/             # Optional - module-specific assets
├── doc/                # Optional - module-specific documentation
└── index.ts            # Optional - module exports
```

## Rules

1. All new functionality MUST be created as a new module in this directory
2. Each module gets its own directory named descriptively
3. ALL implementation files MUST be inside the module directory
4. Only `page.tsx` should be imported directly by the router

For detailed documentation, see:
- [Module Structure Documentation](../../docs/module-structure.md)
- [Module Rules Quick Reference](../../docs/module-rules.md)
