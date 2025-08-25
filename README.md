# QuantumBytes Template - Homepage

A modern React template with TypeScript, Vite, and Tailwind CSS.

## Project Structure

```
src/
├── components/        # Shared components
├── modules/           # Module-specific code (see below)
│   ├── homepage/      # Homepage module
│   ├── notfound/      # 404 page module
│   └── .template/     # Template for new modules
App.tsx               # Main app and routing
main.tsx              # Entry point
```

## Module Structure

This project follows a strict module-based architecture where each feature is contained within its own module directory under `src/modules/`.

### Creating New Modules

All new functionality must be created as a new module following the established structure:

```
src/modules/module-name/
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

For new modules, you can use the template in `src/modules/.template/` as a starting point by copying it to create your new module.

### Detailed Documentation

For complete documentation on module structure and extension rules, see:
- [Module Structure Documentation](docs/module-structure.md)
- [Module Rules Quick Reference](docs/module-rules.md)

## Development

This project uses [Bun](https://bun.sh) for package management and scripting. Make sure you have Bun installed before proceeding.

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Lint code
bun run lint
```

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- ESLint & Prettier
- Bun (package manager)