🍲 ZaikaZaroor - Full-Stack Food Delivery App

Yeh "ZaikaZaroor" project hai. Yeh React (Frontend) aur Node.js/Express (Backend) mein banai gayi aik complete food delivery web application hai. Is project mein 3 mukhtalif user roles (User, Owner, Delivery Boy) hain, har aik ka apna dashboard aur permissions hain.

🚀 Features (Khasoosiyat)

Full-Stack Application: MERN Stack (MongoDB, Express, React, Node) par mabni.

Role-Based Authentication: 3 roles:

User (Customer): Khana order kar sakta hai (Future scope).

Owner (Restaurant Malik): Apni shop aur food items ko manage kar sakta hai.

Delivery Boy (Rider): Orders deliver kar sakta hai (Future scope).

Secure Auth Flow:

JWT (JSON Web Tokens) ka istemal HttpOnly cookies ke zariye.

Email/Password se signup aur OTP verification.

Google Sign-In (OAuth).

Forgot Password / Reset Password email flow.

Role-Based Protected Routes:

Protected Routes: Sirf login users hi dashboard access kar sakte hain (ProtectedRoute).

Public Only Routes: Login users /login ya /signup page nahi dekh sakte (PublicOnlyRoute).

Har role (user, owner, dboy) ka apna alag protected dashboard layout hai.

Owner Dashboard:

Shop Management (CRUD): Har owner apni sirf 1 shop (Create/Read/Update/Delete) kar sakta hai.

Food Item Management (CRUD): Owner apni shop ke liye food items (menu) add, edit, view, aur delete kar sakta hai.

Image Uploads:

Files multer se handle hoti hain aur Cloudinary (cloud storage) par upload hoti hain.

Modern UI:

Responsive design (Mobile & Desktop).

Ant Design (AntD) components (Tables, Modals, Forms, etc.).

Tailwind CSS se custom styling.

Lucide React icons.

Location Feature: Public homepage par useCurrentLocation hook ke zariye user ki city detect karna (OpenStreetMap API).

🛠️ Technology Stack (Istemaal Shuda Tech)

Frontend (Client-side)

React.js (Vite)

React Router v6 (Protected routes aur routing ke liye)

React Context API (ApiContext state management ke liye)

Axios (API calls ke liye)

Ant Design (UI components)

Tailwind CSS (Styling ke liye)

Lucide React (Icons)

js-cookie (Token management ke liye)

Backend (Server-side)

Node.js

Express.js

MongoDB (Mongoose) (Database)

JSON Web Token (JWT) (Authentication)

cookie-parser (HttpOnly cookies read karne ke liye)

bcrypt.js (Password hashing)

mmulter (File uploads receive karne ke liye)

cloudinary (Image cloud storage)

nodemailer (OTP/Reset Password email ke liye - Farz kiya gaya hai)

⚙️ How to Run (Local Setup)

Is project ko apne local machine par chalane ke liye yeh steps follow karein.

1. Backend Setup

Backend folder mein jayein:

cd Backend



Dependencies install karein:

npm install



.env file banayein:
Root Backend folder mein .env file banayein aur yeh variables add karein:

PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
COOKIE_EXPIRE=7

# Cloudinary Credentials
CLOUDINARY_CLOUDNAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECERT=your_api_secret

# (Email ke liye - agar setup kiya hai)
# EMAIL_USER=...
# EMAIL_PASS=...



Server chalayein:

npm run dev



(Farz hai ke aapki package.json mein dev script hai)

2. Frontend Setup

Frontend folder mein jayein (naye terminal mein):

cd Frontend



Dependencies install karein:

npm install



.env file banayein:
Root Frontend folder mein .env file banayein aur Firebase config (Google Auth ke liye) add karein:

VITE_APIKEY=AIza...
VITE_AUTHDOMAIN=...
VITE_PROJECTID=...
VITE_STORAGEBUCKET=...
VITE_MESSAGESENDERID=...
VITE_APIID=...



Frontend server chalayein:

npm run dev



Aapki app http://localhost:5173 par open ho jayegi.