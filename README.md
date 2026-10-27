# 📸 LensCraft for Android

[![Build LensCraft Android APK](https://github.com/MasAim24/lenscraft-android/actions/workflows/build-apk.yml/badge.svg)](https://github.com/MasAim24/lenscraft-android/actions/workflows/build-apk.yml)
[![Latest Release](https://img.shields.io/github/v/release/MasAim24/lenscraft-android?label=Release&color=blue)](https://github.com/MasAim24/lenscraft-android/releases/latest)
[![Platform](https://img.shields.io/badge/Platform-Android%20(Capacitor%207)-3DDC84?logo=android&logoColor=white)](https://capacitorjs.com/)

**LensCraft for Android** is a **Pro Manual & Film Simulation Camera** packaged as a native Android APK powered by **Capacitor 7** and a custom **Native Android Camera2 & MediaStore Bridge (`LensCraftNativeBridge`)**. Designed as the companion camera to [**LightCraft**](https://github.com/MasAim24/lightcraft-android) and [**WordCraft**](https://github.com/MasAim24/wordcraft-android).

---

## 📥 Download APK

| Release | Version | Direct Download |
| :--- | :--- | :--- |
| **LensCraft Android APK** | `v1.0.0-android` | [**⬇️ Download LensCraft-v1.0.0.apk**](https://github.com/MasAim24/lenscraft-android/releases/download/v1.0.0-android/LensCraft-v1.0.0.apk) |

---

## ✨ Key Features

### 1. 🎞️ Real-Time Film Simulation Engine (8 Iconic Film Stocks)
- **CHR — Classic Chrome:** Muted shadows and documentary warm-cyan skies.
- **POR — Kodak Portra 400:** Golden warm skin tones and creamy lifted blacks.
- **800T — CineStill 800T:** Tungsten night cinema look with real **Red-Orange Highlight Halation Glow**.
- **VEL — Fujichrome Velvia 50:** High-saturation landscape vibrancy and deep micro-contrast.
- **ACR — Neopan Acros 100:** High-acutance silver-gelatin monochrome B&W.
- **MCR — Leica Monochrom Red:** Dramatic high-contrast B&W with red filter tonal response.
- **AST — Astia 100F Soft:** Gentle portrait contrast and pastel highlight roll-off.
- **STD — Provia Standard:** True-to-life optical neutral color.
- **Fine Character Sliders:** Adjust **Organic Film Grain (`0–100%`)**, **Highlight Halation (`0–100%`)**, and **Optical Lens Vignette (`0–100%`)** in real time.

### 2. 🎛️ Pro Manual Controls & Multi-Lens Switcher
- **Tactile Dials:** Full manual control over **ISO (`AUTO` / `50`–`6400`)**, **Shutter Speed (`AUTO` / `1/4000s`–`1/4s`)**, **Exposure Compensation (`-2.0` to `+2.0 EV`)**, **White Balance (`2800K`–`7500K`)**, and **Focus (`AF-S`, `AF-C`, `MF` + Tap-to-Focus reticle)**.
- **Focal Lengths:** Quick switcher for **`0.6x` (16mm)**, **`1x` (24mm)**, **`2x` (50mm)**, **`3.5x` (85mm)**, Front/Rear camera flip, and LED Torch (`⚡`).
- **🖼️ Built-in Film Lab Mode:** Import any existing photo from your gallery into the live viewfinder pipeline to apply Film Simulations and Leica EXIF frames.

### 3. 📊 Pro Viewfinder HUD
- **Live RGB + Luminance Waveform Histogram** (`60 FPS` real-time analysis).
- **Overexposure Zebra Stripes** & **Emerald Focus Peaking** edge detection.
- **3D Electronic Spirit Level (Horizon)** powered by device gyroscope/orientation sensors.
- **Aspect Ratios & Grids:** `4:3`, `3:2`, `16:9`, `1:1` Medium Format, and **`65:24` XPan Panoramic**, paired with **Rule of Thirds** and **Golden Ratio ($\Phi$)** guides.

### 4. 🖼️ Leica / Darkroom EXIF Studio Frame & Dominant Palette Swatches
- Automatically extracts the **5 dominant colors** from every captured photo and renders an optional studio border:
  - **Leica White Gallery Frame** (with red dot emblem, real Android device model & aperture from `CameraCharacteristics`, focal length, shutter, ISO, film recipe, date, and 5-color palette bar)
  - **Darkroom Obsidian Frame**
  - **35mm Quartz Date & Recipe Stamp**
  - **Clean (Unframed)**

### 5. 🤖 Native Android Hardware Bridge (`LensCraftNativeBridge`)
- **Physical Volume Key Shutter:** Pressing **Volume Up** or **Volume Down** fires the camera shutter with mechanical haptic click (`VibrationEffect`) and synthesized Leica M shutter sound.
- **Auto-Save to Android Gallery (`DCIM/LensCraft`):** Every captured photo is automatically written to `/sdcard/DCIM/LensCraft/` via `MediaStore.Images.Media` so it immediately appears in Google Photos and the native Android Gallery.
- **One-Tap "Open in LightCraft":** Directly launches **LightCraft for Android** (`com.storytold.lightcraft`) or opens the native Android Share / Save As dialogs.
