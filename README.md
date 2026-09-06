# 💍 Apipi Wedding Invitation

A minimalist, high-fashion digital wedding invitation built with a vanilla frontend stack. Designed for a personalized guest experience through URL-driven dynamics, dynamic multi-playlist audio architecture, and an interactive "rare drop" gacha mechanism.

---

## 🚀 Key Features

* **URL-Driven Personalization:** Automatically parses guest names (`?to=`) and custom music vibes (`?vibe=`) dynamically on page load.
* **Multi-Playlist Audio Pool:** Every vibe category contains an array of songs that randomize on every visit, preventing repetitive loops.
* **Universal Rare Drop (Easter Egg):** A 10% chance probability system built into all non-default categories, letting guests randomly unlock "surprise tracks" from entirely different music genres.
* **Top-Notification Pop-Up:** Features a smooth, elegant top-sliding notification banner that alerts guests when they hit a rare music drop.
* **Mass Data Automation:** Fully optimized to generate thousands of unique guest URLs seamlessly using Google Sheets/Excel `ENCODEURL()` functions.

---

## 🛠️ Tech Stack

* **Markup & Style:** HTML5, CSS3 (Minimalist / High-Fashion Typography)
* **Animations:** GSAP (GreenSock Animation Platform)
* **Scripting:** Vanilla JavaScript (ES6+)
* **Audio Storage:** Cloud-hosted external MP3 workflow (GitHub Raw / Media URLs)

---

## 📂 Project Structure

```text
apipi-wedding-invitation/
├── index.html          # Main HTML entry point
├── assets/
│   ├── css/
│   │   └── style.css   # Custom layouts & top-notification transition effects
│   ├── js/
│   │   ├── main.js     # GSAP page transitions & UI interactivity
│   │   └── audio.js    # URL parser, multi-playlist pool, & gacha logic
│   └── img/
│       └── qr-frog.png # Aesthetic frog-themed QR code assets
└── README.md
