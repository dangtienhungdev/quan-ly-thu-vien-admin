# Authentication Context & Route Protection

This directory contains a comprehensive authentication system with React Context and route protection components.

## Files

- `auth-context.tsx` - Main authentication context provider
- `private-route.tsx` - Route protection for authenticated users only
- `public-route.tsx` - Route protection for unauthenticated users only
- `README.md` - This documentation

## Features

- ✅ TypeScript support
- ✅ React Router v6 integration
- ✅ Automatic token management
- ✅ Loading states
- ✅ Route protection
- ✅ Persistent authentication
- ✅ Optimized and reusable

## Quick Start

### 1. Wrap your app with AuthProvider

```tsx
import { AuthProvider } from '@/context/auth-context';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Your routes here */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### 2. Use route protection

```tsx
import { PrivateRoute, PublicRoute } from '@/components';

// Protected route - only for authenticated users
<Route
  path="/"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>

// Public route - only for unauthenticated users
<Route
  path="/login"
  element={
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  }
/>
```

### 3. Use auth context in components

```tsx
import { useAuth } from '@/context/auth-context';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ username: 'user', password: 'pass' });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.username}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## API Reference

### AuthProvider

The main context provider that manages authentication state.

#### Props

- `children: React.ReactNode` - The components to wrap

### useAuth Hook

Returns the authentication context with the following properties:

#### State

- `user: User | null` - Current user object (null if not authenticated)
- `isAuthenticated: boolean` - Whether user is authenticated
- `isLoading: boolean` - Whether auth state is being initialized

#### Methods

- `login(credentials: LoginRequest): Promise<void>` - Login with username/password
- `logout(): void` - Logout and clear auth state
- `refreshUser(): Promise<void>` - Refresh user information

### PrivateRoute

Protects routes that require authentication.

#### Props

- `children: React.ReactNode` - The component to render if authenticated
- `redirectTo?: string` - Where to redirect if not authenticated (default: '/login')

#### Features

- Shows loading spinner while checking authentication
- Redirects to login page if not authenticated
- Preserves intended destination in location state

### PublicRoute

Protects routes that should only be accessible to unauthenticated users.

#### Props

- `children: React.ReactNode` - The component to render if not authenticated
- `redirectTo?: string` - Where to redirect if already authenticated (default: '/dashboard')

#### Features

- Shows loading spinner while checking authentication
- Redirects to dashboard if already authenticated
- Preserves intended destination for post-login redirect

## Configuration

### Customizing User Info Fetching

The `fetchUserInfo` function in `auth-context.tsx` is currently a placeholder. You can implement it to fetch user data from your API:

```tsx
const fetchUserInfo = async (): Promise<User | null> => {
  try {
    const response = await instance.get('/api/auth/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return null;
  }
};
```

### Customizing Redirect Paths

You can customize default redirect paths by passing props to the route components:

```tsx
<PrivateRoute redirectTo="/auth/login">
  <Dashboard />
</PrivateRoute>

<PublicRoute redirectTo="/app">
  <LoginPage />
</PublicRoute>
```

## Error Handling

The authentication system includes built-in error handling:

- Invalid tokens are automatically cleared
- Failed login attempts throw errors that can be caught
- Network errors during user info fetching trigger logout

## Persistence

Authentication state is persisted using localStorage:

- `accessToken` - JWT token for API authentication
- Token is automatically included in API requests via axios interceptors

## Security Considerations

- Tokens are stored in localStorage (consider httpOnly cookies for production)
- Invalid tokens are automatically cleared
- 401 responses can trigger automatic logout
- Route protection prevents unauthorized access

## Examples

See `src/examples/auth-integration-example.tsx` for complete integration examples.