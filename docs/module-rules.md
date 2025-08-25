# Module Extension Rules (Quick Reference)

## Golden Rules

1. **All new functionality MUST be created as a new module in `src/modules/`**
2. **Each module gets its own directory named after its purpose**
3. **ALL implementation files MUST be inside the module directory**
4. **Only `page.tsx` should be imported directly by the router**

## Directory Structure

```
src/modules/module-name/
├── page.tsx            ← REQUIRED
├── components/         ← OPTIONAL
├── hooks/              ← OPTIONAL
├── utils/              ← OPTIONAL
├── services/           ← OPTIONAL
├── types/              ← OPTIONAL
├── constants/          ← OPTIONAL
├── assets/             ← OPTIONAL
├── doc/                ← OPTIONAL
└── index.ts            ← OPTIONAL
```

## Creation Steps

1. Create directory: `mkdir src/modules/new-module-name`
2. Create required file: `touch src/modules/new-module-name/page.tsx`
3. Add basic component to `page.tsx`
4. Add optional directories as needed

## Import Rules

- Internal: `import X from './components/X'`
- Cross-module: `import X from '@/modules/other/page'`
- Global: `import X from '@/components/X'`

## Naming

- Directories: kebab-case (`user-profile`)
- Components: PascalCase (`UserProfile.tsx`)
- Files: camelCase (`useApi.ts`, `userTypes.ts`)

## Routing

1. Import in `App.tsx`: `import NewModule from "@/modules/new-module/page"`
2. Add route config:
   ```ts
   {
     path: "/new-module",
     element: <NewModule />,
     errorElement: <RouteError />,
   }
   ```