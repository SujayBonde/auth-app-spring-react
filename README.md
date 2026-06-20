```markdown
# 🔐 JWT Auth App — Spring Boot + React + MySQL + JWT

A **full‑stack authentication system** built with **Spring Boot (backend)**, **React + Vite (frontend)**, and **MySQL** database.  
Implements **JWT authentication**, **role‑based access control**, and a clean **React UI with Tailwind CSS**.

---

## ✨ Features

- 🔑 User Registration & Login with JWT  
- 🛡️ Role‑based Authorization (`USER`, `MODERATOR`, `ADMIN`)  
- 🔒 Secure Password Hashing with BCrypt  
- 🌐 Protected API Endpoints  
- 🎨 React Frontend with Tailwind CSS  
- 🗄️ MySQL Database Integration  
- ⚙️ Spring Security + JWT Filter  

---

## 📁 Project Structure

```
jwt-auth-app/
│
├── backend/                          ← Spring Boot Maven Project
│   ├── pom.xml                       ← backend-pom.xml
│   └── src/main/java/com/sujay/jwtauthapp/
│       ├── JwtAuthAppApplication.java
│       ├── model/ (User, Role, ERole)
│       ├── repository/ (UserRepository, RoleRepository)
│       ├── security/ (WebSecurityConfig, JWT utils, filters, services)
│       ├── controller/ (AuthController, TestController)
│       └── payload/ (LoginRequest, SignupRequest, JwtResponse, etc.)
│   └── src/main/resources/application.properties
│
└── frontend/                         ← React Vite Project
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        └── services/ (auth.service.js, user.service.js)
```

---

## ⚙️ Backend Setup

1. **Create Spring Boot Project**  
   Use [Spring Initializr](https://start.spring.io) with:
   - Maven, Java 17, Spring Boot 3.2.0  
   - Dependencies: Spring Web, Spring Security, Spring Data JPA, Validation, MySQL Driver, Lombok  

2. **Configure `application.properties`**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/jwt_auth_db?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD_HERE

   app.jwt.secret=MyVerySecretKeyThatShouldBeAtLeast256BitsLongForHS256Algorithm!
   app.jwt.expiration-ms=86400000
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Insert roles into MySQL**
   ```sql
   USE jwt_auth_db;
   INSERT INTO roles (name) VALUES ('ROLE_USER');
   INSERT INTO roles (name) VALUES ('ROLE_MODERATOR');
   INSERT INTO roles (name) VALUES ('ROLE_ADMIN');
   ```

---

## ⚛️ Frontend Setup

1. **Create Vite + React project**
   ```bash
   npm create vite@latest frontend -- --template react
   cd frontend
   npm install
   ```

2. **Install Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Configure Tailwind**
   ```js
   // tailwind.config.js
   export default {
     content: ["./index.html", "./src/**/*.{js,jsx}"],
     theme: { extend: {} },
     plugins: [],
   }
   ```

4. **Run React**
   ```bash
   npm run dev
   # Runs on http://localhost:3000
   ```

---

## 🔌 API Endpoints

| Method | URL                | Auth      | Description        |
|--------|--------------------|-----------|--------------------|
| POST   | /api/auth/signup   | None      | Register new user  |
| POST   | /api/auth/signin   | None      | Login, returns JWT |
| GET    | /api/test/public   | None      | Open endpoint      |
| GET    | /api/test/user     | JWT       | Any logged-in user |
| GET    | /api/test/moderator| JWT + MOD | Moderator only     |
| GET    | /api/test/admin    | JWT + ADMIN | Admin only       |

---

## 🗄️ Database Schema

```
users           roles           user_roles
-----------     -----------     ----------------
id (PK)         id (PK)         user_id (FK)
username        name            role_id (FK)
email
password
```

---

## 🔐 JWT Flow

```
1. User registers → password hashed → saved in MySQL
2. User logs in → Spring validates → JwtUtils generates token
3. Frontend stores token in localStorage
4. Requests include "Authorization: Bearer <token>"
5. AuthTokenFilter validates → sets SecurityContext
6. Controller executes if role matches
```

---

## ⚠️ Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Role not found` | Insert roles into DB |
| `CORS error` | Ensure React runs on port 3000 |
| `401 Unauthorized` | Check JWT header is sent |
| `Table doesn't exist` | Add `spring.jpa.hibernate.ddl-auto=update` |
| `Communications link failure` | MySQL not running / wrong password |
| `Username already taken` | Use unique username |

---

## 🚀 Getting Started

Clone the repo and run both backend and frontend:

```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend
cd frontend
npm run dev
```

---

## 📜 License

This project is licensed under the MIT License.

---
## 💡 Author

Developed by **Sujay** ✨  
Focused on **Java, Spring Boot, React, and full‑stack development**.
