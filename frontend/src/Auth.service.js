// src/services/auth.service.js
// ==============================
// AuthService — handles all API calls for login/register
// Stores JWT in localStorage
// ==============================

const API_URL = "http://localhost:8080/api/auth/";

const register = (username, email, password) => {
  return fetch(API_URL + "signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  }).then((res) => {
    if (!res.ok) return res.json().then((err) => Promise.reject(err));
    return res.json();
  });
};

const login = (username, password) => {
  return fetch(API_URL + "signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => {
      if (!res.ok) return res.json().then((err) => Promise.reject(err));
      return res.json();
    })
    .then((data) => {
      if (data.token) {
        // Store full user object + token in localStorage
        localStorage.setItem("user", JSON.stringify(data));
      }
      return data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const AuthService = { register, login, logout, getCurrentUser };
export default AuthService;