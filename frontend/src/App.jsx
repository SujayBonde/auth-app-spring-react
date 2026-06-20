// ==============================
// App.jsx — Full JWT Auth React App
// Uses React Router v6 + Tailwind CSS
// Components: Login, Register, Dashboard, Navbar, ProtectedRoute
// ==============================
import { useState, useEffect, createContext, useContext } from "react";

// ==============================
// Auth Context — global state for current user
// ==============================
const AuthContext = createContext(null);

const useAuth = () => useContext(AuthContext);

// ==============================
// API Config
// ==============================
const API_BASE = "http://localhost:8080/api";

// ==============================
// Auth Service
// ==============================
const authService = {
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  },

  register: async (username, email, password) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
  },

  logout: () => localStorage.removeItem("user"),
  getCurrentUser: () => JSON.parse(localStorage.getItem("user") || "null"),
};

// ==============================
// Protected API Service
// ==============================
const apiService = {
  authHeader: () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  },
  getUserContent: async () => {
    const res = await fetch(`${API_BASE}/test/user`, {
      headers: apiService.authHeader(),
    });
    if (!res.ok) throw new Error("Access denied");
    return res.text();
  },
  getAdminContent: async () => {
    const res = await fetch(`${API_BASE}/test/admin`, {
      headers: apiService.authHeader(),
    });
    if (!res.ok) throw new Error("Access denied");
    return res.text();
  },
};

// ==============================
// COMPONENT: InputField
// ==============================
const InputField = ({ label, type, value, onChange, placeholder, error }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-300 mb-1.5">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl bg-slate-800 border text-white placeholder-slate-500
        focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all
        ${error ? "border-red-500" : "border-slate-700"}`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

// ==============================
// COMPONENT: AlertBox
// ==============================
const AlertBox = ({ type, message }) => {
  if (!message) return null;
  const styles = {
    error: "bg-red-900/40 border border-red-500 text-red-300",
    success: "bg-green-900/40 border border-green-500 text-green-300",
    info: "bg-blue-900/40 border border-blue-500 text-blue-300",
  };
  return (
    <div className={`rounded-xl px-4 py-3 text-sm mb-4 ${styles[type]}`}>
      {message}
    </div>
  );
};

// ==============================
// COMPONENT: Login Page
// ==============================
const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      onNavigate("dashboard");
    } catch (err) {
      setError(err.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800">
          <AlertBox type="error" message={error} />

          <form onSubmit={handleLogin}>
            <InputField
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800
                text-white font-semibold rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
                shadow-lg shadow-indigo-500/20 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => onNavigate("register")}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// ==============================
// COMPONENT: Register Page
// ==============================
const RegisterPage = ({ onNavigate }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (username.length < 3) e.username = "Username must be at least 3 characters";
    if (!email.includes("@")) e.email = "Enter a valid email";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (password !== confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      const res = await authService.register(username, email, password);
      setSuccess(res.message + " You can now log in.");
      setTimeout(() => onNavigate("login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-slate-400 mt-1">Join us today — it's free</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800">
          <AlertBox type="error" message={error} />
          <AlertBox type="success" message={success} />

          <form onSubmit={handleRegister}>
            <InputField
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              error={errors.username}
            />
            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={errors.email}
            />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              error={errors.password}
            />
            <InputField
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              error={errors.confirm}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800
                text-white font-semibold rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900
                shadow-lg shadow-emerald-500/20 mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <button
              onClick={() => onNavigate("login")}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// ==============================
// COMPONENT: Dashboard Page
// ==============================
const DashboardPage = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [apiResult, setApiResult] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate("login");
  };

  const callApi = async (type) => {
    setLoading(true);
    setApiResult("");
    setApiError("");
    try {
      const res = type === "user"
        ? await apiService.getUserContent()
        : await apiService.getAdminContent();
      setApiResult(res);
    } catch (e) {
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isMod = user?.roles?.includes("ROLE_MODERATOR");

  const roleColor = isAdmin
    ? "text-red-400 bg-red-900/30 border-red-800"
    : isMod
    ? "text-yellow-400 bg-yellow-900/30 border-yellow-800"
    : "text-indigo-400 bg-indigo-900/30 border-indigo-800";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="font-bold text-lg">SecureApp</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm hidden sm:block">
              Hey, <span className="text-white font-semibold">{user?.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300
                hover:text-white text-sm font-medium transition-all border border-slate-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 rounded-2xl p-6 mb-8 border border-indigo-800/50">
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, {user?.username}! 👋
          </h2>
          <p className="text-slate-400 text-sm">You're securely authenticated with a JWT token.</p>
        </div>

        {/* User Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">User ID</p>
            <p className="text-xl font-bold text-white">#{user?.id}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email</p>
            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Role</p>
            <div className="flex flex-wrap gap-2">
              {user?.roles?.map((r) => (
                <span key={r} className={`text-xs font-bold px-2 py-1 rounded-lg border ${roleColor}`}>
                  {r.replace("ROLE_", "")}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* JWT Token Preview */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-8">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Your JWT Token
          </h3>
          <code className="block bg-slate-800 rounded-xl p-4 text-xs text-emerald-400 font-mono break-all leading-relaxed border border-slate-700">
            {user?.token}
          </code>
        </div>

        {/* API Testing Panel */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Test Protected Endpoints
          </h3>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => callApi("user")}
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50
                text-white text-sm font-semibold rounded-xl transition-all"
            >
              GET /api/test/user
            </button>
            {isAdmin && (
              <button
                onClick={() => callApi("admin")}
                disabled={loading}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-600 disabled:opacity-50
                  text-white text-sm font-semibold rounded-xl transition-all"
              >
                GET /api/test/admin
              </button>
            )}
          </div>
          {loading && (
            <p className="text-slate-400 text-sm animate-pulse">Calling API...</p>
          )}
          {apiResult && (
            <div className="bg-emerald-900/20 border border-emerald-800 rounded-xl p-4">
              <p className="text-emerald-400 text-sm font-mono">✓ {apiResult}</p>
            </div>
          )}
          {apiError && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
              <p className="text-red-400 text-sm font-mono">✗ {apiError}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ==============================
// COMPONENT: Main App (Router)
// ==============================
export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(() => authService.getCurrentUser());

  // Navigate and sync
  const navigate = (p) => setPage(p);

  useEffect(() => {
    if (user) setPage("dashboard");
  }, []);

  const login = async (username, password) => {
    const userData = await authService.login(username, password);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {page === "login" && <LoginPage onNavigate={navigate} />}
      {page === "register" && <RegisterPage onNavigate={navigate} />}
      {page === "dashboard" && user && <DashboardPage onNavigate={navigate} />}
      {page === "dashboard" && !user && <LoginPage onNavigate={navigate} />}
    </AuthContext.Provider>
  );
}