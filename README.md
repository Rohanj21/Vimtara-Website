# Vimtara Mobile - Corporate Compliance Hub

A premium React Native mobile application designed for seamless corporate compliance management, cap table auditing, and ESOP tracking. The platform integrates an advanced AI-driven Action Desk and connects users seamlessly to Chartered Accountants, who serve as essential, supportive partners dedicated to ensuring flawless corporate governance.

## 🌟 Key Features

*   **Role-Based Access Control (RBAC):** Secure, conditional routing for `ADMIN`, `ASSISTANT`, and `USER` roles using React Navigation Drawer and Stack navigators.
*   **AI Action Desk:** A premium, inverted-list chat interface featuring AST-parsed Markdown rendering for structured AI responses (bullet points, bold text, native links).
*   **Secure Authentication:** OS-level encrypted JWT token storage using `expo-secure-store` and automated Axios interceptors.
*   **Corporate Brand Alignment:** Strict adherence to Vimtara's corporate visual identity using designated brown and dark shade hex codes (e.g., `#3E2723`, `#5D4037`).
*   **Live Database Connectivity:** Direct integration with a local Node.js/Express backend and PostgreSQL database.

## 🛠 Tech Stack

*   **Framework:** React Native (Expo)
*   **Navigation:** React Navigation (Drawer & Stack)
*   **State Management / Context:** React Context API
*   **Network Client:** Axios (with request interceptors)
*   **Security:** Expo SecureStore
*   **Markdown Parsing:** `react-native-markdown-display` (with `punycode`)
*   **Gestures & Animations:** `react-native-reanimated`, `react-native-gesture-handler`

## 📁 Project Structure

```text
vimtara-mobile/
├── assets/                  # Brand icons and splash screens
├── src/
│   ├── components/          # Reusable UI (AIMessageBubble, CustomDrawer)
│   ├── config/              # Centralized configs (apiClient.js)
│   ├── context/             # Global state (AuthContext.js)
│   └── screens/             # Route views (Login, User/Admin/Assistant Dashboards)
├── App.js                   # Root navigator and Context Provider
├── app.json                 # Expo config (package names, splash styling)
├── babel.config.js          # Compiler config (Reanimated plugin)
└── eas.json                 # Cloud build configuration (APK output)

🚀 Installation & Setup
1. Prerequisites
Node.js (v18+)

Expo CLI (npm install -g expo-cli)

EAS CLI (npm install -g eas-cli)

A running Node.js backend connected to PostgreSQL.

2. Clone and Install Dependencies
Bash
# Navigate to the project directory
cd vimtara-mobile

# Install all required packages
npm install
3. Configure Local API Connection
Mobile devices cannot resolve localhost to your computer. You must point the app to your machine's local IP address.

Find your IPv4 address (run ipconfig on Windows or ifconfig on Mac).

Open src/config/apiClient.js.

Update the API_URL variable:

JavaScript
export const API_URL = 'http://YOUR.IPV4.ADDRESS:5000/api'; 
4. Clear Cache and Start the Development Server
To ensure Babel plugins (like Reanimated) and new dependencies (like punycode) are registered, start the Metro bundler with a cleared cache:

Bash
npx expo start -c
You can press a to open in an Android Emulator, i for iOS simulator, or scan the QR code with the Expo Go app on a physical device.

📦 Building the Android APK
The project is configured via eas.json to output a standalone Android .apk for internal distribution and testing.

Ensure you are logged into EAS:

Bash
eas login
Trigger the cloud build:

Bash
eas build -p android --profile preview
Once the build finishes on the Expo servers, scan the terminal QR code or click the dashboard link to download the APK directly to your Android device.

🧪 Developer Sandbox (RBAC Testing)
The LoginScreen includes a built-in Developer Sandbox at the bottom of the UI. This allows you to instantly inject mock JWT tokens and test the Drawer Navigation conditional rendering without needing to create mock users in the PostgreSQL database.

Admin Button: Injects ADMIN role -> Routes to System Governance & RBAC controls.

Assistant Button: Injects ASSISTANT role -> Routes to Document Review Queue.

User Button: Injects USER role -> Routes to the Action Desk & AI Chat.