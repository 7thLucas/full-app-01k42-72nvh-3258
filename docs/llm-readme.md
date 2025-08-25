# LLM README - Implementation Guide

This document provides specific instructions for LLMs creating modules for this project. All general architecture rules are in `module-structure.md` and `module-rules.md`.

## IMPLEMENTATION RULES

### 1. Module Structure Compliance
- Create all files within `src/modules/[kebab-case-module-name]/`
- Follow the exact directory structure documented in `module-structure.md`
- Only `page.tsx` should be imported by the router in `App.tsx`
- All module functionality must be self-contained within the module directory

### 2. Color Handling
When the page_spec includes a `colors` section:
```json
{
  "colors": {
    "primary": "#[HEX_COLOR]",
    "secondary": "#[HEX_COLOR]"
  }
}
```

You MUST:
1. Generate complete 10-shade palettes (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) for each color
2. Replace the existing `primary` and `secondary` color objects in `tailwind.config.js`
3. Use the new color classes in your components (e.g., `text-primary-600`, `bg-secondary-100`)

DO NOT:
- Hardcode hex values directly in components
- Use colors that don't exist in `tailwind.config.js`

### 3. Technical Requirements
- Use TypeScript for all components and types
- Follow Tailwind CSS for styling
- Use React Hooks for state management
- Implement proper form handling with validation
- Create responsive and accessible UI components
- Make mobile-friendly designs

### 4. Code Quality
- Follow existing code patterns in the project
- Use proper error handling
- Implement data validation
- Write clean, readable code with comments where necessary

## DELIVERABLE FORMAT

Structure your response in this exact format:

### 1. Approach Explanation
- Briefly explain how you'll implement the module based on the page_spec
- Mention any special considerations or technical approaches

### 2. File Structure
Show the complete file structure you'll create:
```
src/modules/module-name/
├── page.tsx
├── components/
│   └── [component files]
├── [other directories as needed]
```

### 3. Implementation
Provide complete code for each file you create, with proper TypeScript typing and Tailwind CSS classes.

### 4. Integration Instructions
Include specific instructions for:
- Any `tailwind.config.js` updates (if colors were specified)
- Router integration in `App.tsx`
- Any additional setup steps

## SPECIAL CONSIDERATIONS

### Form Fields Implementation
- Implement all form fields specified in the page_spec
- Add proper validation for required fields
- Include appropriate placeholders and descriptions
- Handle character limits (e.g., 80 characters for descriptions)

### UI/UX Requirements
- Use the copy tone specified in the page_spec
- Implement all UI elements and states described
- Make the interface encouraging and supportive as specified
- Ensure mobile responsiveness

### Icon Usage
- Use icons from `lucide-react` as specified
- Import and use icons properly with correct sizing
- Ensure icons are accessible with proper aria labels when needed