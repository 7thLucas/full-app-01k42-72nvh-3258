# Module Structure and Extension Rules

This document defines the strict module structure and extension rules for this project. All new functionality must follow these guidelines to maintain consistency, especially since this repository will primarily be maintained by LLMs.

## Core Principles

1. **Strict Isolation**: Each module is a self-contained unit with all related components, utilities, and functions inside its own directory
2. **Predictable Organization**: Consistent file structure across all modules
3. **Explicit Dependencies**: Modules should only import from other modules when absolutely necessary
4. **Clear Boundaries**: Each module should have a single, well-defined responsibility

## Module Structure

All modules must be created within the `src/modules/` directory:

```
src/
└── modules/
    └── module-name/
        ├── components/          (optional)
        ├── hooks/               (optional)
        ├── utils/               (optional)
        ├── services/            (optional)
        ├── types/               (optional)
        ├── constants/           (optional)
        ├── assets/              (optional)
        ├── doc/                 (optional - module-specific documentation)
        ├── page.tsx            (required - main module page)
        └── index.ts            (optional - module exports)
```

### Required Files

1. **`page.tsx`** - The main entry point for the module
   - Default export of the main component
   - Should be the only file directly imported by the router

### Optional Directories/Files

2. **`components/`** - Module-specific components
   - Reusable UI components that are specific to this module
   - Each component in its own file with the same name (e.g., `Button.tsx`)

3. **`hooks/`** - Module-specific custom hooks
   - Hooks that are specific to this module's functionality
   - Each hook in its own file with the same name (e.g., `useData.ts`)

4. **`utils/`** - Module-specific utility functions
   - Helper functions specific to this module
   - Each utility category in its own file (e.g., `format.ts`, `validation.ts`)

5. **`services/`** - Module-specific API/service calls
   - All API interactions for this module
   - Each service category in its own file (e.g., `api.ts`, `queries.ts`)

6. **`types/`** - Module-specific TypeScript types
   - Type definitions specific to this module
   - Each type category in its own file (e.g., `user.ts`, `data.ts`)

7. **`constants/`** - Module-specific constants
   - Constants used throughout this module
   - Group related constants in files (e.g., `routes.ts`, `config.ts`)

8. **`assets/`** - Module-specific static assets
   - Images, icons, or other static files specific to this module

9. **`doc/`** - Module-specific documentation
   - Documentation files that explain module-specific implementation details

10. **`index.ts`** - Module exports
    - Centralized export file for the module
    - Exports components, hooks, utils that may be used by other modules

## Creating a New Module

To create a new module, follow these steps:

1. Create a new directory in `src/modules/` with a descriptive name:
   ```bash
   mkdir src/modules/new-module-name
   ```

2. Create the required `page.tsx` file:
   ```bash
   touch src/modules/new-module-name/page.tsx
   ```

3. Add the basic module structure:
   ```tsx
   export default function NewModulePage() {
     return (
       <div>
         <h1>New Module</h1>
       </div>
     );
   }
   ```

4. Add any optional directories/files as needed for the module's functionality.

## Import Rules

1. **Module Internal Imports**:
   - Use relative paths for imports within the same module
   - Example: `import MyComponent from './components/MyComponent'`

2. **Cross-Module Imports**:
   - Import from other modules using the alias path
   - Example: `import OtherModulePage from '@/modules/other-module/page'`
   - Only import what is explicitly exported (prefer `index.ts` exports)

3. **Global Imports**:
   - Import shared components from `@/components/`
   - Import global utilities from `@/utils/` (if they exist)

## Naming Conventions

1. **Directory Names**: Use kebab-case (e.g., `user-profile`, `data-table`)
2. **Component Files**: Use PascalCase (e.g., `UserProfile.tsx`, `DataTable.tsx`)
3. **Utility/Hook Files**: Use camelCase (e.g., `formatData.ts`, `useApi.ts`)
4. **Type Files**: Use camelCase with `.ts` extension (e.g., `userTypes.ts`)
5. **Constant Files**: Use camelCase (e.g., `apiEndpoints.ts`)

## Routing Integration

To add a new module to the routing system:

1. Import the module page in `App.tsx`:
   ```ts
   import NewModulePage from "@/modules/new-module/page";
   ```

2. Add the route configuration:
   ```ts
   {
     path: "/new-module",
     element: <NewModulePage />,
     errorElement: <RouteError />,
   }
   ```

## Example Module Structure

Here's a complete example of a properly structured module:

```
src/modules/user-profile/
├── components/
│   ├── Avatar.tsx
│   └── ProfileCard.tsx
├── hooks/
│   └── useUserData.ts
├── utils/
│   └── format.ts
├── services/
│   └── api.ts
├── types/
│   └── user.ts
├── constants/
│   └── routes.ts
├── doc/
│   └── api.md
├── page.tsx
└── index.ts
```

This structure ensures that all functionality related to the user profile is contained within its own module directory, making it easy to understand, maintain, and extend.