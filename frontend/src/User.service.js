// src/services/user.service.js
// ==============================
// UserService — calls protected backend endpoints
// Automatically attaches JWT token in Authorization header
// ==============================

const API_URL = "http://localhost:8080/api/test/";

// Helper to get JWT from localStorage
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: "Bearer " + user.token };
  }
  return {};
};

const getPublicContent = () =>
  fetch(API_URL + "public").then((res) => res.text());

const getUserBoard = () =>
  fetch(API_URL + "user", { headers: authHeader() }).then((res) => {
    if (!res.ok) throw new Error("Access Denied");
    return res.text();
  });

const getModeratorBoard = () =>
  fetch(API_URL + "moderator", { headers: authHeader() }).then((res) => {
    if (!res.ok) throw new Error("Access Denied");
    return res.text();
  });

const getAdminBoard = () =>
  fetch(API_URL + "admin", { headers: authHeader() }).then((res) => {
    if (!res.ok) throw new Error("Access Denied");
    return res.text();
  });

const UserService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};
export default UserService;