# 🚀 Soft Game Studio

Welcome to the **Soft Game Studio** GitHub Repository — a fully-featured, web-based educational platform delivering high-quality **programming courses**, **project content**, **video lectures**, and more.

**Registered Startup**: Udyam Registration Number: `UDYAM-PB-06-0032977`

---

## 🧠 Features

- 🔥 Firebase Realtime Database & Firestore Integration
- ⚛️ React + Tailwind CSS + Vite Frontend
- 🎬 Custom Video Player with Course Access Control
- 📊 Admin Dashboard (User/Course/Payment Management)
- 💳 Razorpay Payment Gateway Integration
- 📧 Email Notifications via EmailJS
- 🚀 Firebase Hosting with SEO Optimization

---

## 🌐 Live Demo

**[https://softgamestudio.web.app](https://softgamestudio.web.app)**

---

## 📂 Project Structure

```bash
SoftGameStudio/
├── public/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── .env                 # Environment variables
├── firebase.json        # Firebase config
├── tailwind.config.js   # Tailwind setup
├── vite.config.js       # Vite configuration
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥18.x
- npm ≥9.x
- Firebase CLI (`npm install -g firebase-tools`)

```bash
git clone https://github.com/SOFTGAMESTUDIO/SoftGameStudio.git
cd SoftGameStudio
npm install
npm run dev
```
**Local URL:** [http://localhost:5173](http://localhost:5173)

---

## 🔐 Environment Setup

1. **Firebase Configuration**  
   - Create a Firebase project and enable:  
     - Authentication (Email/Password)
     - Firestore & Realtime Database
     - Hosting (required for deployment)
   - Populate `.env` with your credentials:

```env
# Firebase
VITE_FIREBASE_API_KEY_SGS="your-key"
VITE_FIREBASE_AUTH_DOMAIN_SGS="your-domain"
VITE_FIREBASE_PROJECT_ID_SGS="your-id"
VITE_FIREBASE_STORAGE_BUCKET_SGS="your-bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID_SGS="your-sender-id"
VITE_FIREBASE_APP_ID_SGS="your-app-id"

# Razorpay (Create account at razorpay.com)
VITE_RAZORPAY_KEY="your-key"
VITE_RAZORPAY_KEY_SECRET="your-secret"

# EmailJS (Setup at emailjs.com)
VITE_EMAILJS_SERVICEID="service-id"
VITE_EMAILJS_TEMPLATEID="template-id"
VITE_EMAILJS_PUBLICKEY="public-key"

# Admin & APIs
VITE_ADMIN_EMAIL="admin@email.com"
VITE_YOUTUBE_API="your-youtube-api-key"
```

> ⚠️ Add `.env` to `.gitignore` to protect credentials.

---

## 🚢 Deployment

```bash
firebase login
firebase init  # Select Hosting, Firestore, Realtime DB
firebase deploy
```

---

## 📊 Admin Dashboard

**Key Functionalities**:
- Manage users/courses/orders
- Upload video content
- View payment analytics

**Firebase Collections**:
- `courses` - Course metadata
- `users` - User profiles & enrollments
- `orders` - Transaction records
- `videos` - Lecture content

---

## 📮 Contact

**Soft Game Studio**  
📧 [team.softgamestudio@gmail.com](mailto:team.softgamestudio@gmail.com)  
📍 **Address**:  
Flat No. 574, St. No. 5  
Nai Abadi, Abohar  
Fazilka, Punjab - 152116  


---

## 📜 License

**MIT License**  
© 2023 Soft Game Studio.  
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ by **Soft Game Studio**  
Empowering developers worldwide 🌍
```

**Key Improvements**:
1. Fixed `.env` variable naming (no double underscores)
2. Updated copyright year to 2023
3. Added prerequisites section
4. Streamlined setup instructions
5. Added badges for visual clarity
6. Improved markdown formatting & structure
7. Added clear service setup links (Razorpay/EmailJS)
8. Removed redundant Gemini API references
9. Organized contact info better
10. Added deployment prerequisites