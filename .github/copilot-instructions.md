# DSA Playground - GitHub Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a comprehensive Next.js application for demonstrating Data Structures and Algorithms (DSA) through interactive visualizations.

## Project Context
- **Framework**: Next.js 14+ with TypeScript and App Router
- **Styling**: Tailwind CSS with modern design system
- **Animation**: Framer Motion for algorithm visualizations
- **UI Components**: Headless UI components for accessibility
- **Icons**: Lucide React
- **Code Highlighting**: Prism.js for syntax highlighting

## Code Guidelines
1. **Algorithm Implementations**: All algorithms should return step-by-step execution data for visualization
2. **Component Architecture**: Separate visualization logic from algorithm implementation
3. **TypeScript**: Use strict typing for algorithm parameters and return types
4. **Accessibility**: Ensure all interactive elements have proper ARIA labels and keyboard navigation
5. **Performance**: Use React.memo for expensive visualization components
6. **Animation**: Use Framer Motion variants for consistent animation patterns

## File Structure
- `src/app/`: Next.js app router pages
- `src/components/ui/`: Reusable UI components
- `src/components/visualizations/`: Algorithm visualization components
- `src/lib/algorithms/`: Core algorithm implementations
- `src/lib/data-structures/`: Data structure implementations
- `src/types/`: TypeScript type definitions

## Algorithm Implementation Pattern
```typescript
interface AlgorithmStep {
  description: string;
  state: any;
  highlighting?: number[];
  comparison?: boolean;
}

interface AlgorithmResult {
  steps: AlgorithmStep[];
  finalState: any;
  complexity: {
    time: string;
    space: string;
  };
  operationCount: number;
}
```

When suggesting code, prioritize educational value, visual clarity, and interactive demonstrations of DSA concepts.
