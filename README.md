# 101 Okey Score Counter 🎲📱

A smart React Native (Expo) application to automate score counting for the popular board game **101 Okey**.

## 🚀 Features

-   **📸 AI-Powered OCR**: Uses **Requesty API (GPT-4.1-mini Vision)** to scan the game board and automatically detect tiles.
-   **🔢 Automatic Scoring**: Calculates the total score based on tile values, handling special cases like "False Jokers".
-   **✏️ Manual Correction**: Intuitive interface to add, edit, or remove tiles if the AI misses something.
-   **📱 Modern UI**: Built with **NativeWind** (Tailwind CSS) for a clean and responsive design.
-   **⚡ Fast & Smooth**: State management powered by **Zustand**.

## 🛠️ Tech Stack

-   **Framework**: [Expo](https://expo.dev/) (React Native)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **AI/OCR**: [Requesty API](https://requesty.ai/) (GPT-4.1-mini)

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/SysMind97/101.git
    cd 101
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the app**
    ```bash
    npx expo start -c
    ```
    -   Scan the QR code with the **Expo Go** app on your phone.
    -   Press `i` for iOS Simulator or `a` for Android Emulator.

## 🔑 Configuration

The app uses **Requesty API** for image recognition.
*Note: The API key is currently configured in `src/services/openaiOCR.ts` for testing purposes.*

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

[MIT](LICENSE)
