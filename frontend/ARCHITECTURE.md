# Frontend Architecture

This document describes the modular, decoupled architecture of the CaseStudy AI frontend, following DRY, SOLID, and KISS principles.

## Architecture Overview

```
src/
├── types/           # TypeScript type definitions
├── constants/       # Application constants
├── utils/           # Pure utility functions
├── services/        # API service layer (data access)
├── hooks/           # Custom React hooks (business logic)
├── components/      # React components (UI layer)
│   ├── ui/         # Reusable UI components
│   └── ...         # Feature components
└── App.tsx         # Root component with Error Boundary
```

## Principles Applied

### DRY (Don't Repeat Yourself)
- ✅ Reusable hooks (`useQuery`, `useClipboard`, `useHealthCheck`)
- ✅ Shared UI components (`Button`, `Input`, `LoadingSpinner`, etc.)
- ✅ Centralized utilities (formatters, validators, error handlers)
- ✅ Single source of truth for constants and types

### SOLID Principles

#### Single Responsibility Principle (SRP)
- **Services**: Only handle API communication
- **Hooks**: Only manage state and side effects
- **Components**: Only handle UI rendering
- **Utils**: Only contain pure functions

#### Open/Closed Principle (OCP)
- Components accept props for customization
- Hooks are composable and extensible
- Services can be extended without modification

#### Liskov Substitution Principle (LSP)
- UI components follow consistent interfaces
- Hooks return predictable structures
- Services implement consistent error handling

#### Interface Segregation Principle (ISP)
- Small, focused interfaces (`QueryState`, `UseQueryReturn`)
- Components only receive necessary props
- Hooks expose only needed functionality

#### Dependency Inversion Principle (DIP)
- Components depend on hooks (abstractions)
- Hooks depend on services (abstractions)
- Services depend on fetch API (abstraction)

### KISS (Keep It Simple, Stupid)
- Simple, focused components
- Clear naming conventions
- Minimal abstraction layers
- Straightforward data flow

## Layer Separation

### 1. Types Layer (`types/`)
**Purpose**: Centralized type definitions
- `Citation`, `QueryResponse`, `QueryRequest`
- `QueryState`, `UseQueryReturn`
- Single source of truth for types

### 2. Constants Layer (`constants/`)
**Purpose**: Application-wide constants
- API endpoints
- Configuration values
- Example queries

### 3. Utils Layer (`utils/`)
**Purpose**: Pure utility functions
- **Validation**: `isValidQuestion`, `validateQuestion`
- **Formatting**: `formatMarkdownToHtml`, `formatCitation`
- **Errors**: `getErrorMessage`, `isNetworkError`, `ApiError`

### 4. Services Layer (`services/`)
**Purpose**: Data access abstraction
- **api.service.ts**: HTTP communication
- Handles timeouts, error parsing, response validation
- Isolated from React components

### 5. Hooks Layer (`hooks/`)
**Purpose**: Business logic and state management
- **useQuery**: Query state management
- **useClipboard**: Clipboard operations
- **useHealthCheck**: Health monitoring
- No prop drilling - hooks encapsulate state

### 6. Components Layer (`components/`)
**Purpose**: UI rendering
- **UI Components** (`ui/`): Reusable, presentational
- **Feature Components**: Business-specific UI
- **ErrorBoundary**: Error handling

## Component Hierarchy

```
App
└── ErrorBoundary (catches React errors)
    └── Chat (orchestrates query flow)
        ├── QueryForm (user input)
        ├── LoadingSpinner (loading state)
        ├── ErrorAlert (error state)
        ├── Answer (results display)
        └── EmptyState (initial state)
```

## Data Flow

```
User Input
  ↓
QueryForm (validates input)
  ↓
Chat (calls useQuery hook)
  ↓
useQuery (calls api.service)
  ↓
api.service (makes HTTP request)
  ↓
useQuery (updates state)
  ↓
Chat (renders Answer component)
```

## Edge Cases Handled

### 1. Network Errors
- Timeout handling (30s default)
- Network failure detection
- Retry logic (can be added)

### 2. Validation
- Empty question validation
- Question length validation (max 1000 chars)
- Real-time error feedback

### 3. Error States
- API errors with user-friendly messages
- Network errors with fallback
- React errors with ErrorBoundary

### 4. Loading States
- Loading indicators
- Disabled inputs during loading
- Prevent duplicate submissions

### 5. Empty States
- Initial empty state with examples
- No results state
- Error recovery state

### 6. Browser Compatibility
- Clipboard API fallback for older browsers
- Feature detection before use
- Graceful degradation

## Custom Hooks

### `useQuery`
Manages query state and execution
```typescript
const { data, loading, error, execute, reset } = useQuery();
```

### `useClipboard`
Handles clipboard operations
```typescript
const { copy, isSupported } = useClipboard();
```

### `useClipboardWithFeedback`
Clipboard with visual feedback
```typescript
const { copyWithFeedback, buttonRef } = useClipboardWithFeedback();
```

### `useHealthCheck`
API health monitoring
```typescript
const { health, isHealthy, loading, error, refetch } = useHealthCheck();
```

## Benefits

1. **No Prop Drilling**: State managed in hooks
2. **Separation of Concerns**: Clear layer boundaries
3. **Testability**: Each layer can be tested independently
4. **Maintainability**: Changes isolated to specific layers
5. **Reusability**: Hooks and components are reusable
6. **Type Safety**: Comprehensive TypeScript coverage
7. **Error Handling**: Comprehensive error boundaries and handling

## Testing Strategy

- **Unit Tests**: Utils, services, hooks
- **Component Tests**: UI components with React Testing Library
- **Integration Tests**: Component + hook interactions
- **E2E Tests**: Full user flows

## Future Enhancements

- Context API for global state (if needed)
- React Query for advanced caching
- Toast notifications for user feedback
- Retry logic with exponential backoff
- Request cancellation
- Optimistic updates

