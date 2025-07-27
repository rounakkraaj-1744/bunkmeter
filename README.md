# 📊 Bunk Meter - Attendance Tracker for College Students

**Bunk Meter** is a modern, sleek attendance tracking app built using **Expo** and **React Native** to help college students manage and monitor their class attendance efficiently.

---

## 🚀 Features

* ✅ Add/Edit/Delete subjects
* 🗕️ Weekly schedule selector
* 📈 Visual representation of attendance with circular progress
* ⚙️ Settings for profile, privacy, and support
* 🎨 Theme customization support (light/dark mode)
* 🔔 Notification context ready
* 📊 View subject-wise statistics
* 🧾 Splash screen and smooth onboarding

---

## 📁 Project Structure

```
app/
│
├── (tabs)/                 # Tab-based navigation (Home, Stats, Settings, etc.)
├── edit-subject/           # Screen to edit subject
├── subject/                # Subject details, privacy, help, etc.
│
├── components/             # Reusable UI components
│   ├── AttendanceBottomSheet.tsx
│   ├── CircularProgress.tsx
│   ├── ColorSelector.tsx
│   ├── SplashScreen.tsx
│   ├── SubjectCard.tsx
│   └── WeeklyScheduleSelector.tsx
│
├── contexts/               # Contexts for global state
│   ├── AttendanceContext.tsx
│   ├── NotificationContext.tsx
│   └── ThemeContext.tsx
│
├── assets/images/          # App icons and assets
├── hooks/                  # Custom hooks
├── types/                  # Global type declarations
├── node_modules/           # Dependencies
├── app.json                # Expo config
├── tsconfig.json           # TypeScript config
└── README.md               # You’re here
```

---

## 🧪 Tech Stack

* [Expo](https://expo.dev/)
* [React Native](https://reactnative.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [React Navigation](https://reactnavigation.org/)
* [Context API](https://reactjs.org/docs/context.html)
* [SVG & Custom Progress View](https://github.com/react-native-svg/react-native-svg)

---

## 🛠️ Installation & Setup

### 📦 Prerequisites

* Node.js
* Expo CLI: `npm install -g expo-cli`

### ▶️ Run the App

```bash
git clone https://github.com/rounakkraaj-1744/bunkmeter.git
cd bunkmeter
npm install
npx expo start
```

Use an emulator or Expo Go on your mobile device to preview.

---

## 🧠 Future Improvements

* Firebase/Auth integration
* Push notifications
* Sync data with cloud
* Customizable alerts/reminders

---

## 🧑‍💻 Contributing

Contributions are welcome! If you have ideas for improvements or new features, feel free to open a pull request or issue.

---

## 🙌 Acknowledgements

* Inspired by the need to track and optimize class attendance in a visual, user-friendly way.