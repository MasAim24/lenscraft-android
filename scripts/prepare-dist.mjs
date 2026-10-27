import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');
fs.mkdirSync(distDir, { recursive: true });

// ---------------------------------------------------------------------------
// 1. styles.css — Zero-Blur GPU Composited UI
// ---------------------------------------------------------------------------
const stylesCss = `/* LensCraft Pro Camera v1.3 — Dual-Engine (60FPS Preview + Ultra-HD Still Capture) */
:root {
  color-scheme: dark;

  --obsidian-950: #07080a;
  --obsidian-900: #0c0e12;
  --obsidian-850: #12151b;
  --obsidian-800: #181c24;
  --obsidian-700: #232936;
  --obsidian-600: #323a4b;

  --silver-100: #f4f6f8;
  --silver-200: #dfe4ec;
  --silver-400: #9aa4b5;
  --silver-500: #6c7689;

  --amber-400: #fbbf24;
  --amber-500: #f59e0b;
  --crimson-500: #ef4444;
  --emerald-400: #34d399;

  --bg-surface: var(--obsidian-950);
  --bg-elevated: var(--obsidian-900);
  --bg-pill: rgba(14, 17, 22, 0.92);
  --text-primary: var(--silver-100);
  --text-secondary: var(--silver-400);
  --border-subtle: rgba(255, 255, 255, 0.09);
  --border-active: rgba(251, 191, 36, 0.55);
  --brand-primary: var(--amber-400);
  --status-shutter: var(--crimson-500);
  --status-focus: var(--emerald-400);

  --top-safe: 0px;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', ui-monospace, monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg-surface);
  color: var(--text-primary);
  font-family: var(--font-sans);
  touch-action: manipulation;
}

.camera-shell {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding-top: var(--top-safe);
  background: var(--bg-surface);
  position: relative;
}

/* ---------------- TOP TELEMETRY & QUICK HUD BAR ---------------- */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
  z-index: 20;
  min-height: 52px;
  gap: 8px;
}

.brand-cluster {
  display: flex;
  align-items: center;
  gap: 8px;
}

.leica-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--status-shutter);
  flex-shrink: 0;
}

.brand-title {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: var(--text-primary);
}

.film-badge-top {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(52, 211, 153, 0.16);
  color: var(--emerald-400);
  border: 1px solid rgba(52, 211, 153, 0.45);
  letter-spacing: 0.06em;
}

.hud-toggles {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
}
.hud-toggles::-webkit-scrollbar {
  display: none;
}

.hud-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 30px;
  padding: 0 9px;
  border-radius: 6px;
  background: var(--obsidian-800);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.hud-btn.active {
  background: rgba(251, 191, 36, 0.16);
  color: var(--brand-primary);
  border-color: var(--border-active);
}

/* ---------------- VIEWFINDER STAGE ---------------- */
.viewfinder-stage {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #040507;
  overflow: hidden;
  contain: strict;
}

.viewfinder-frame {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

#live-video {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

#viewfinder-canvas {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  will-change: contents;
}

/* Aspect-Ratio Crop Masks */
.crop-guide {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.crop-box {
  position: relative;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 0 9999px rgba(4, 5, 7, 0.80);
  border: 1px solid rgba(255, 255, 255, 0.24);
}

/* Grid Overlays inside Crop Box */
.grid-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.grid-thirds::before,
.grid-thirds::after {
  content: '';
  position: absolute;
  inset: 0;
}
.grid-thirds::before {
  background: linear-gradient(
    to right,
    transparent calc(33.333% - 0.5px),
    rgba(255, 255, 255, 0.28) calc(33.333% - 0.5px),
    rgba(255, 255, 255, 0.28) calc(33.333% + 0.5px),
    transparent calc(33.333% + 0.5px),
    transparent calc(66.666% - 0.5px),
    rgba(255, 255, 255, 0.28) calc(66.666% - 0.5px),
    rgba(255, 255, 255, 0.28) calc(66.666% + 0.5px),
    transparent calc(66.666% + 0.5px)
  );
}
.grid-thirds::after {
  background: linear-gradient(
    to bottom,
    transparent calc(33.333% - 0.5px),
    rgba(255, 255, 255, 0.28) calc(33.333% - 0.5px),
    rgba(255, 255, 255, 0.28) calc(33.333% + 0.5px),
    transparent calc(33.333% + 0.5px),
    transparent calc(66.666% - 0.5px),
    rgba(255, 255, 255, 0.28) calc(66.666% - 0.5px),
    rgba(255, 255, 255, 0.28) calc(66.666% + 0.5px),
    transparent calc(66.666% + 0.5px)
  );
}

.grid-golden::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    transparent 38.19%,
    rgba(251, 191, 36, 0.32) 38.2%,
    transparent 38.4%,
    transparent 61.79%,
    rgba(251, 191, 36, 0.32) 61.8%,
    transparent 62%
  );
}
.grid-golden::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 38.19%,
    rgba(251, 191, 36, 0.32) 38.2%,
    transparent 38.4%,
    transparent 61.79%,
    rgba(251, 191, 36, 0.32) 61.8%,
    transparent 62%
  );
}

/* Electronic Spirit Level (Horizon) */
.horizon-level {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 140px;
  height: 2px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: 0.85;
  will-change: transform;
}
.horizon-level.hidden {
  display: none;
}
.horizon-wing {
  width: 42px;
  height: 2px;
  background: rgba(255, 255, 255, 0.65);
}
.horizon-center-ring {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.65);
}
.horizon-level.level-locked .horizon-wing {
  background: var(--status-focus);
}
.horizon-level.level-locked .horizon-center-ring {
  border-color: var(--status-focus);
}

/* Live RGB Histogram & Telemetry Overlay */
.telemetry-overlay-top {
  position: absolute;
  top: 10px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;
  z-index: 12;
}

.exif-live-pill {
  background: var(--bg-pill);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 6px 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.45;
  color: var(--text-primary);
}

.exif-live-pill .sub {
  color: var(--emerald-400);
  font-size: 10px;
  font-weight: 700;
}

.histogram-box {
  background: var(--bg-pill);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 5px 6px 3px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.histogram-box.hidden {
  display: none;
}

#histogram-canvas {
  width: 104px;
  height: 40px;
  display: block;
}

.histogram-label {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-secondary);
  letter-spacing: 0.08em;
  margin-top: 2px;
}

/* Tap-to-Focus Reticle */
.focus-reticle {
  position: absolute;
  width: 66px;
  height: 66px;
  border: 1.5px solid var(--brand-primary);
  border-radius: 4px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 15;
  opacity: 0;
  transition: opacity 0.2s ease, border-color 0.15s ease;
}
.focus-reticle.active {
  opacity: 1;
}
.focus-reticle.locked {
  border-color: var(--status-focus);
}
.focus-reticle-label {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  color: var(--brand-primary);
  background: rgba(7, 8, 10, 0.9);
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
}

/* Shutter Curtain Flash Effect */
.shutter-curtain {
  position: absolute;
  inset: 0;
  background: #000;
  opacity: 0;
  pointer-events: none;
  z-index: 25;
  transition: opacity 0.06s ease;
}
.shutter-curtain.fired {
  opacity: 0.9;
}

/* Multi-Lens Floating Pill */
.lens-bar-wrap {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-pill);
  padding: 5px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  z-index: 16;
}

.lens-btn {
  min-width: 40px;
  height: 30px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.lens-btn.active {
  background: var(--brand-primary);
  color: var(--obsidian-950);
}

/* ---------------- PRO MANUAL DIALS & FILM STOCK DECK ---------------- */
.control-deck {
  background: var(--bg-elevated);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  z-index: 20;
  padding-bottom: env(safe-area-inset-bottom, 8px);
}

.drawer-panel {
  padding: 9px 12px;
  background: var(--obsidian-850);
  border-bottom: 1px solid var(--border-subtle);
  display: none;
  flex-direction: column;
  gap: 8px;
}
.drawer-panel.open {
  display: flex;
}

.film-strip-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}
.film-strip-scroll::-webkit-scrollbar {
  display: none;
}

.film-card {
  flex: 0 0 auto;
  width: 92px;
  padding: 7px 8px;
  border-radius: 8px;
  background: var(--obsidian-800);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.film-card.active {
  border-color: var(--brand-primary);
  background: rgba(251, 191, 36, 0.12);
}
.film-card-code {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 800;
  color: var(--brand-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.film-card-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.film-card-desc {
  font-size: 9px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.character-sliders {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.mini-slider-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
  background: var(--obsidian-800);
  padding: 5px 6px;
  border-radius: 6px;
  border: 1px solid var(--border-subtle);
}
.mini-slider-header {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-secondary);
}
.mini-slider-header span:last-child {
  color: var(--brand-primary);
  font-weight: 700;
}
input[type="range"].pro-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: var(--obsidian-600);
  border-radius: 2px;
  outline: none;
}
input[type="range"].pro-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--brand-primary);
  cursor: pointer;
  border: 2px solid var(--obsidian-950);
}

.manual-strip {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.dial-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 4px;
  border-radius: 7px;
  background: var(--obsidian-800);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
}
.dial-pill.active {
  border-color: var(--brand-primary);
  background: rgba(251, 191, 36, 0.14);
}
.dial-label {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.08em;
}
.dial-value {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 800;
  color: var(--text-primary);
  margin-top: 2px;
}
.dial-pill.active .dial-value {
  color: var(--brand-primary);
}

.value-wheel-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding: 8px 14px;
  background: var(--obsidian-850);
  border-bottom: 1px solid var(--border-subtle);
  scrollbar-width: none;
}
.value-wheel-bar.hidden {
  display: none;
}
.value-wheel-bar::-webkit-scrollbar {
  display: none;
}
.wheel-chip {
  flex: 0 0 auto;
  padding: 5px 11px;
  border-radius: 6px;
  background: var(--obsidian-800);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}
.wheel-chip.selected {
  background: var(--brand-primary);
  color: var(--obsidian-950);
  border-color: var(--brand-primary);
}

/* ---------------- SHUTTER & GALLERY DOCK ---------------- */
.shutter-dock {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 10px 22px 12px;
  gap: 16px;
}

.dock-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dock-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.thumb-well {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: var(--obsidian-800);
  border: 1.5px solid var(--border-subtle);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb-well img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb-count {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(7, 8, 10, 0.88);
  color: var(--brand-primary);
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 800;
  padding: 1px 4px;
  border-radius: 4px;
}

.round-action-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--obsidian-800);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.round-action-btn.active {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  background: rgba(251, 191, 36, 0.14);
}

.shutter-outer {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  padding: 5px;
  background: transparent;
  border: 3px solid var(--silver-200);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.shutter-outer:active {
  transform: scale(0.94);
  border-color: var(--brand-primary);
}
.shutter-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffffff 0%, #dfe4ec 65%, #b8c2d1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.shutter-inner::after {
  content: '';
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--status-shutter);
}

/* ---------------- FILM ROLL & LIGHTBOX MODAL ---------------- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: #07080a;
  z-index: 60;
  display: none;
  flex-direction: column;
  padding-top: var(--top-safe);
}
.modal-backdrop.open {
  display: flex;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
}
.modal-title {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.modal-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px;
  overflow: auto;
  gap: 12px;
}

#preview-rendered-img {
  max-width: 100%;
  max-height: 62vh;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid var(--border-subtle);
}

.frame-style-bar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.modal-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 460px;
  padding: 12px 16px 20px;
  background: var(--bg-elevated);
  border-top: 1px solid var(--border-subtle);
  margin: 0 auto;
}

.action-cta {
  padding: 11px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-subtle);
  background: var(--obsidian-800);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.action-cta.primary {
  background: var(--brand-primary);
  color: var(--obsidian-950);
  border-color: var(--brand-primary);
}
.action-cta.accent-lightcraft {
  background: rgba(52, 211, 153, 0.16);
  color: var(--emerald-400);
  border-color: rgba(52, 211, 153, 0.45);
}

.toast-banner {
  position: fixed;
  top: calc(var(--top-safe) + 60px);
  left: 50%;
  transform: translateX(-50%);
  background: #0c0e12;
  border: 1px solid var(--border-active);
  color: var(--text-primary);
  padding: 8px 14px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  z-index: 90;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  white-space: nowrap;
}
.toast-banner.visible {
  opacity: 1;
}
`;

// ---------------------------------------------------------------------------
// 2. index.html — Dual-Engine Layout (60FPS Preview + UHD Capture)
// ---------------------------------------------------------------------------
const indexHtml = `<!DOCTYPE html>
<html lang="id" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>LensCraft Pro Camera</title>
  <link rel="stylesheet" href="./styles.css" />
</head>
<body>
  <div class="camera-shell">
    <!-- TOP TELEMETRY & HUD CONTROLS -->
    <header class="top-bar">
      <div class="brand-cluster">
        <span class="leica-dot" title="LensCraft Dual-Engine Optical Pipeline"></span>
        <span class="brand-title">LENSCRAFT</span>
        <span id="active-film-badge" class="film-badge-top">60FPS + UHD</span>
      </div>

      <div class="hud-toggles">
        <button id="btn-aspect" class="hud-btn" title="Aspect Ratio">4:3</button>
        <button id="btn-grid" class="hud-btn active" title="Framing Grid">GRID</button>
        <button id="btn-hist" class="hud-btn" title="Live RGB Histogram">HIST</button>
        <button id="btn-zebra" class="hud-btn" title="Overexposure Zebra Stripes">ZEBRA</button>
        <button id="btn-peaking" class="hud-btn" title="Focus Peaking">PEAK</button>
        <button id="btn-level" class="hud-btn active" title="Electronic Horizon Level">LEVEL</button>
        <button id="btn-frame-toggle" class="hud-btn active" title="Leica EXIF Watermark Frame">EXIF FRAME</button>
        <button id="btn-torch" class="hud-btn" title="LED Torch / Flash">⚡ OFF</button>
        <button id="btn-safe-top" class="hud-btn" title="Top Safe Margin for Camera Cutout">SAFE 0</button>
      </div>
    </header>

    <!-- VIEWFINDER STAGE -->
    <main id="viewfinder-stage" class="viewfinder-stage">
      <video id="live-video" autoplay playsinline muted></video>
      <input id="file-import-input" type="file" accept="image/*" style="display:none" />

      <div id="viewfinder-frame" class="viewfinder-frame">
        <canvas id="viewfinder-canvas"></canvas>

        <!-- Crop & Framing Guide -->
        <div class="crop-guide">
          <div id="crop-box" class="crop-box">
            <div id="grid-overlay" class="grid-overlay grid-thirds"></div>
          </div>
        </div>

        <!-- 3D Spirit Level -->
        <div id="horizon-level" class="horizon-level level-locked">
          <div class="horizon-wing"></div>
          <div class="horizon-center-ring"></div>
          <div class="horizon-wing"></div>
        </div>

        <!-- Tap-to-Focus Reticle -->
        <div id="focus-reticle" class="focus-reticle">
          <span id="focus-reticle-label" class="focus-reticle-label">AF-S • LOCK</span>
        </div>

        <!-- Shutter Curtain Flash -->
        <div id="shutter-curtain" class="shutter-curtain"></div>
      </div>

      <!-- Live Telemetry & RGB Waveform Histogram -->
      <div class="telemetry-overlay-top">
        <div class="exif-live-pill">
          <div id="hud-lens-line">24mm • f/1.8 • AUTO</div>
          <div id="hud-device-line" class="sub">60FPS PREVIEW • UHD STILL ISP</div>
        </div>

        <div id="histogram-box" class="histogram-box hidden">
          <canvas id="histogram-canvas" width="104" height="40"></canvas>
          <span id="histogram-label" class="histogram-label">RGB • LUMA</span>
        </div>
      </div>

      <!-- Multi-Lens & Source Switcher -->
      <div class="lens-bar-wrap">
        <button class="lens-btn" data-zoom="0.6" data-mm="16">0.6x</button>
        <button class="lens-btn active" data-zoom="1.0" data-mm="24">1x</button>
        <button class="lens-btn" data-zoom="2.0" data-mm="50">2x</button>
        <button class="lens-btn" data-zoom="3.5" data-mm="85">3.5x</button>
        <button id="btn-import-lab" class="lens-btn" title="Load Photo from Gallery into Film Lab">🖼️ LAB</button>
      </div>
    </main>

    <!-- MANUAL DIALS & FILM SIMULATION DECK -->
    <section class="control-deck">
      <!-- Film Simulation & Character Drawer -->
      <div id="film-drawer" class="drawer-panel open">
        <div id="film-strip-scroll" class="film-strip-scroll"></div>
        <div class="character-sliders">
          <div class="mini-slider-group">
            <div class="mini-slider-header"><span>SHARP</span><span id="val-sharpness">60%</span></div>
            <input id="slider-sharpness" type="range" class="pro-range" min="0" max="100" value="60" />
          </div>
          <div class="mini-slider-group">
            <div class="mini-slider-header"><span>GRAIN</span><span id="val-grain">14%</span></div>
            <input id="slider-grain" type="range" class="pro-range" min="0" max="100" value="14" />
          </div>
          <div class="mini-slider-group">
            <div class="mini-slider-header"><span>HALO</span><span id="val-halation">18%</span></div>
            <input id="slider-halation" type="range" class="pro-range" min="0" max="100" value="18" />
          </div>
          <div class="mini-slider-group">
            <div class="mini-slider-header"><span>VIGN</span><span id="val-vignette">18%</span></div>
            <input id="slider-vignette" type="range" class="pro-range" min="0" max="100" value="18" />
          </div>
        </div>
      </div>

      <!-- Discrete Value Wheel for Manual Dials -->
      <div id="value-wheel-bar" class="value-wheel-bar hidden"></div>

      <!-- 6 Tactile Dials -->
      <div class="manual-strip">
        <div class="dial-pill active" data-dial="FILM">
          <span class="dial-label">FILM</span>
          <span id="dial-val-film" class="dial-value">CHR</span>
        </div>
        <div class="dial-pill" data-dial="ISO">
          <span class="dial-label">ISO</span>
          <span id="dial-val-iso" class="dial-value">AUTO</span>
        </div>
        <div class="dial-pill" data-dial="SHUTTER">
          <span class="dial-label">SHUTTER</span>
          <span id="dial-val-shutter" class="dial-value">AUTO</span>
        </div>
        <div class="dial-pill" data-dial="EV">
          <span class="dial-label">EXP (EV)</span>
          <span id="dial-val-ev" class="dial-value">0.0</span>
        </div>
        <div class="dial-pill" data-dial="WB">
          <span class="dial-label">WB (K)</span>
          <span id="dial-val-wb" class="dial-value">5400K</span>
        </div>
        <div class="dial-pill" data-dial="FOCUS">
          <span class="dial-label">FOCUS</span>
          <span id="dial-val-focus" class="dial-value">AF-S</span>
        </div>
      </div>

      <!-- SHUTTER & GALLERY DOCK -->
      <div class="shutter-dock">
        <div class="dock-left">
          <div id="thumb-well" class="thumb-well" title="Open Captured Film Roll">
            <img id="thumb-preview" alt="" style="display:none" />
            <span id="thumb-empty-icon" style="font-size:18px;opacity:0.5;">🎞️</span>
            <span id="thumb-count" class="thumb-count">0</span>
          </div>
          <button id="btn-sound-toggle" class="round-action-btn active" title="Mechanical Shutter Sound">🔊</button>
        </div>

        <button id="btn-shutter" class="shutter-outer" aria-label="Shutter">
          <div class="shutter-inner"></div>
        </button>

        <div class="dock-right">
          <button id="btn-reset-all" class="round-action-btn" title="Reset All Exposure & Film Dials to Auto">AE</button>
          <button id="btn-flip-cam" class="round-action-btn" title="Switch Front / Rear Camera">🔄</button>
        </div>
      </div>
    </section>

    <!-- FILM ROLL & EXIF STUDIO LIGHTBOX MODAL -->
    <div id="gallery-modal" class="modal-backdrop">
      <div class="modal-header">
        <span class="modal-title">🎞️ DARKROOM & EXIF FRAME STUDIO</span>
        <div style="display:flex;gap:8px;">
          <button id="btn-prev-shot" class="hud-btn">◀</button>
          <span id="shot-counter-label" class="hud-btn" style="pointer-events:none">1 / 1</span>
          <button id="btn-next-shot" class="hud-btn">▶</button>
          <button id="btn-close-modal" class="hud-btn" style="color:#ef4444;border-color:rgba(239,68,68,0.4);">✕ TUTUP</button>
        </div>
      </div>

      <div class="modal-body">
        <img id="preview-rendered-img" alt="Captured Frame" />
        <div class="frame-style-bar">
          <button class="hud-btn frame-opt active" data-frame="leica-white">LEICA WHITE</button>
          <button class="hud-btn frame-opt" data-frame="darkroom-black">DARKROOM BLACK</button>
          <button class="hud-btn frame-opt" data-frame="cinema-stamp">35MM DATE STAMP</button>
          <button class="hud-btn frame-opt" data-frame="none">CLEAN (NO FRAME)</button>
        </div>
      </div>

      <div class="modal-actions">
        <button id="btn-save-dcim" class="action-cta primary">💾 Simpan ke Galeri (DCIM)</button>
        <button id="btn-save-as" class="action-cta">📁 Pilih Folder (Save As)</button>
        <button id="btn-share-photo" class="action-cta">📤 Bagikan Foto</button>
        <button id="btn-open-lightcraft" class="action-cta accent-lightcraft">🎞️ Kirim ke LightCraft</button>
      </div>
    </div>

    <!-- Floating Toast Notification -->
    <div id="toast-banner" class="toast-banner"></div>
  </div>

  <script src="./app.js"></script>
</body>
</html>
`;

// ---------------------------------------------------------------------------
// 3. app.js — Dual-Engine Pipeline:
//    - Engine A (Viewfinder): Lightweight 1280x960 stream + Fast 1-Tap Shader @ 60FPS
//    - Engine B (Shutter Capture): Full-Megapixel ISP ImageCapture + 9-Tap Optical Unsharp Mask
// ---------------------------------------------------------------------------
const appJs = `(() => {
  'use strict';

  const FILM_RECIPES = [
    {
      id: 'CHR',
      name: 'Classic Chrome',
      desc: 'Crisp micro-contrast • Documentary skies',
      contrast: 1.15,
      saturation: 0.84,
      warmth: 0.022,
      tint: -0.010,
      shadowLift: 0.025,
      highlightRoll: 0.88,
      bw: 0,
      redFilter: 0,
      defaultSharpness: 60,
      defaultGrain: 14,
      defaultHalation: 18,
      defaultVignette: 18
    },
    {
      id: 'POR',
      name: 'Kodak Portra 400',
      desc: 'Golden skin tones • Creamy highlights',
      contrast: 1.07,
      saturation: 1.08,
      warmth: 0.050,
      tint: 0.014,
      shadowLift: 0.042,
      highlightRoll: 0.90,
      bw: 0,
      redFilter: 0,
      defaultSharpness: 48,
      defaultGrain: 12,
      defaultHalation: 14,
      defaultVignette: 15
    },
    {
      id: '800T',
      name: 'CineStill 800T',
      desc: 'Tungsten cinema • Red halation bloom',
      contrast: 1.18,
      saturation: 1.06,
      warmth: -0.045,
      tint: 0.018,
      shadowLift: 0.020,
      highlightRoll: 0.86,
      bw: 0,
      redFilter: 0,
      defaultSharpness: 52,
      defaultGrain: 22,
      defaultHalation: 62,
      defaultVignette: 24
    },
    {
      id: 'VEL',
      name: 'Fujichrome Velvia 50',
      desc: 'Razor-sharp landscape • Rich chroma',
      contrast: 1.24,
      saturation: 1.35,
      warmth: 0.018,
      tint: 0.008,
      shadowLift: -0.012,
      highlightRoll: 0.94,
      bw: 0,
      redFilter: 0,
      defaultSharpness: 70,
      defaultGrain: 6,
      defaultHalation: 8,
      defaultVignette: 20
    },
    {
      id: 'ACR',
      name: 'Neopan Acros 100',
      desc: 'High-acutance silver B&W • Deep blacks',
      contrast: 1.26,
      saturation: 0.0,
      warmth: 0.0,
      tint: 0.0,
      shadowLift: 0.012,
      highlightRoll: 0.90,
      bw: 1,
      redFilter: 0,
      defaultSharpness: 68,
      defaultGrain: 20,
      defaultHalation: 10,
      defaultVignette: 22
    },
    {
      id: 'MCR',
      name: 'Leica Monochrom Red',
      desc: 'Summilux B&W acutance • Dramatic skies',
      contrast: 1.38,
      saturation: 0.0,
      warmth: 0.0,
      tint: 0.0,
      shadowLift: -0.018,
      highlightRoll: 0.88,
      bw: 1,
      redFilter: 1,
      defaultSharpness: 75,
      defaultGrain: 22,
      defaultHalation: 10,
      defaultVignette: 28
    },
    {
      id: 'AST',
      name: 'Astia 100F Soft',
      desc: 'Gentle portrait • Silky skin fidelity',
      contrast: 0.99,
      saturation: 1.04,
      warmth: 0.028,
      tint: 0.010,
      shadowLift: 0.048,
      highlightRoll: 0.88,
      bw: 0,
      redFilter: 0,
      defaultSharpness: 42,
      defaultGrain: 8,
      defaultHalation: 14,
      defaultVignette: 12
    },
    {
      id: 'STD',
      name: 'Provia Optical Master',
      desc: 'Pure optical clarity • True neutral',
      contrast: 1.05,
      saturation: 1.02,
      warmth: 0.0,
      tint: 0.0,
      shadowLift: 0.0,
      highlightRoll: 0.95,
      bw: 0,
      redFilter: 0,
      defaultSharpness: 58,
      defaultGrain: 0,
      defaultHalation: 0,
      defaultVignette: 8
    }
  ];

  const DIAL_OPTIONS = {
    ISO: ['AUTO', '50', '100', '200', '400', '800', '1600', '3200', '6400'],
    SHUTTER: ['AUTO', '1/4000', '1/2000', '1/1000', '1/500', '1/250', '1/125', '1/60', '1/30', '1/15', '1/4'],
    EV: ['-2.0', '-1.5', '-1.0', '-0.7', '-0.3', '0.0', '+0.3', '+0.7', '+1.0', '+1.5', '+2.0'],
    WB: ['AUTO', '2800K', '3200K', '4000K', '5000K', '5400K', '6000K', '6500K', '7500K'],
    FOCUS: ['AF-S', 'AF-C', 'MF 0.2m', 'MF 0.5m', 'MF 1.0m', 'MF 3.0m', 'MF ∞']
  };

  const ASPECT_RATIOS = [
    { label: '4:3', ratio: 4 / 3 },
    { label: '3:2', ratio: 3 / 2 },
    { label: '16:9', ratio: 16 / 9 },
    { label: '1:1', ratio: 1 / 1 },
    { label: 'XPAN', ratio: 65 / 24 }
  ];

  const state = {
    film: FILM_RECIPES[0],
    sharpness: 60,
    grain: 14,
    halation: 18,
    vignette: 18,
    iso: 'AUTO',
    shutter: 'AUTO',
    ev: '0.0',
    wb: '5400K',
    focus: 'AF-S',
    activeDial: 'FILM',
    zoom: 1.0,
    focalMm: 24,
    aperture: 'f/1.8',
    facingMode: 'environment',
    torch: false,
    aspectIndex: 0,
    gridMode: 1,
    showHistogram: false, // Default off so zero CPU readback during live preview unless requested
    showZebra: false,
    showPeaking: false,
    showLevel: true,
    exifFrameEnabled: true,
    selectedFrameStyle: 'leica-white',
    shutterSoundEnabled: true,
    topSafeIndex: 0,
    deviceModel: 'LENSCRAFT OPTICAL',
    stream: null,
    videoTrack: null,
    imageCapture: null,
    maxPhotoWidth: 0,
    maxPhotoHeight: 0,
    labImage: null,
    capturedShots: [],
    currentShotIndex: 0
  };

  const videoEl = document.getElementById('live-video');
  const vfCanvas = document.getElementById('viewfinder-canvas');
  const histCanvas = document.getElementById('histogram-canvas');
  const histCtx = histCanvas.getContext('2d');
  const cropBox = document.getElementById('crop-box');
  const gridOverlay = document.getElementById('grid-overlay');
  const horizonLevel = document.getElementById('horizon-level');
  const focusReticle = document.getElementById('focus-reticle');
  const focusReticleLabel = document.getElementById('focus-reticle-label');
  const shutterCurtain = document.getElementById('shutter-curtain');
  const filmStripScroll = document.getElementById('film-strip-scroll');
  const filmDrawer = document.getElementById('film-drawer');
  const valueWheelBar = document.getElementById('value-wheel-bar');
  const toastBanner = document.getElementById('toast-banner');

  const tinyCanvas = document.createElement('canvas');
  tinyCanvas.width = 32;
  tinyCanvas.height = 24;
  const tinyCtx = tinyCanvas.getContext('2d', { willReadFrequently: true });

  // Fast WebGL Context (antialias: false for zero multi-sample resolve overhead on mobile GPUs)
  const gl = vfCanvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
  });

  let glProgram = null;
  let glTexture = null;
  let maxGpuTexSize = 4096;
  let uLocs = {};

  function initWebGL() {
    if (!gl) return false;
    maxGpuTexSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;

    const vsSource = \`
      attribute vec2 a_pos;
      attribute vec2 a_uv;
      uniform float u_zoom;
      uniform float u_mirror;
      varying vec2 v_uv;
      void main() {
        gl_Position = vec4(a_pos, 0.0, 1.0);
        vec2 centered = (a_uv - 0.5) / max(1.0, u_zoom) + 0.5;
        if (u_mirror > 0.5) {
          centered.x = 1.0 - centered.x;
        }
        v_uv = centered;
      }
    \`;

    // Dual-Mode Shader:
    // - u_hqPass == 0.0 (Live 60FPS Viewfinder): Ultra-fast single-pass GPU grading
    // - u_hqPass == 1.0 (Still Photo Capture): Full 5-Tap Optical Unsharp Mask Acutance + Multi-Sample Halation
    const fsSource = \`
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif
      varying vec2 v_uv;
      uniform sampler2D u_tex;
      uniform float u_hqPass;
      uniform float u_gain;
      uniform float u_contrast;
      uniform float u_sat;
      uniform vec3 u_wbOffset;
      uniform float u_shadowLift;
      uniform float u_highlightRoll;
      uniform float u_bw;
      uniform float u_redFilter;
      uniform float u_sharpness;
      uniform float u_grain;
      uniform float u_halation;
      uniform float u_vignette;
      uniform float u_zebra;
      uniform float u_peaking;
      uniform float u_time;
      uniform vec2 u_texel;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233)) + u_time) * 43758.5453);
      }

      vec3 filmicCurve(vec3 x) {
        vec3 a = clamp(x, 0.0, 1.0);
        return mix(a, a * a * (3.0 - 2.0 * a), 0.30);
      }

      void main() {
        vec3 center = texture2D(u_tex, v_uv).rgb;
        vec3 col = center;

        // Full 5-Tap Optical Unsharp Mask ONLY on Still Capture (or if Peaking is active)
        if (u_hqPass > 0.5 && u_sharpness > 0.01) {
          vec3 nUp    = texture2D(u_tex, v_uv - vec2(0.0, u_texel.y)).rgb;
          vec3 nDown  = texture2D(u_tex, v_uv + vec2(0.0, u_texel.y)).rgb;
          vec3 nLeft  = texture2D(u_tex, v_uv - vec2(u_texel.x, 0.0)).rgb;
          vec3 nRight = texture2D(u_tex, v_uv + vec2(u_texel.x, 0.0)).rgb;
          vec3 detail = center - (nUp + nDown + nLeft + nRight) * 0.25;
          col = center + detail * u_sharpness;
        }

        col *= u_gain;
        col += u_wbOffset;

        // Contrast, Shadow Lift, Highlight Roll-off & Filmic S-Curve
        col = (col - 0.5) * u_contrast + 0.5 + u_shadowLift;
        vec3 over = max(vec3(0.0), col - 0.80);
        col = min(col, vec3(0.80)) + over * u_highlightRoll;
        col = filmicCurve(col);

        float luma = dot(col, vec3(0.299, 0.587, 0.114));
        if (u_bw > 0.5) {
          float m = u_redFilter > 0.5 ? dot(col, vec3(0.58, 0.34, 0.08)) : luma;
          col = vec3(m);
        } else {
          col = mix(vec3(luma), col, u_sat);
        }

        // Halation (Fast 1-sample on Live Viewfinder, 4-sample wide bloom on Still Capture)
        if (u_halation > 0.01) {
          float maxL = luma;
          if (u_hqPass > 0.5) {
            vec3 h1 = texture2D(u_tex, v_uv + vec2(u_texel.x * 3.5, 0.0)).rgb * u_gain;
            vec3 h2 = texture2D(u_tex, v_uv - vec2(u_texel.x * 3.5, 0.0)).rgb * u_gain;
            vec3 h3 = texture2D(u_tex, v_uv + vec2(0.0, u_texel.y * 3.5)).rgb * u_gain;
            maxL = max(luma, dot((h1 + h2 + h3) * 0.333, vec3(0.299, 0.587, 0.114)));
          }
          float halo = max(0.0, maxL - 0.76) * u_halation * 2.2;
          col += vec3(halo * 1.35, halo * 0.35, 0.0);
        }

        // Optical Vignette
        if (u_vignette > 0.01) {
          vec2 d = v_uv - 0.5;
          float distSq = dot(d, d) * 2.2;
          col *= max(0.18, 1.0 - distSq * u_vignette);
        }

        // Film Grain
        if (u_grain > 0.004) {
          float n = (hash(v_uv * 500.0) - 0.5) * u_grain;
          col += vec3(n);
        }

        col = clamp(col, 0.0, 1.0);
        float finalLuma = dot(col, vec3(0.299, 0.587, 0.114));

        if (u_zebra > 0.5 && finalLuma > 0.94) {
          float stripe = mod(gl_FragCoord.x + gl_FragCoord.y + u_time * 30.0, 10.0);
          if (stripe < 4.0) {
            col = vec3(1.0, 0.15, 0.15);
          }
        }

        if (u_peaking > 0.5) {
          vec3 rightCol = texture2D(u_tex, v_uv + vec2(u_texel.x * 1.5, 0.0)).rgb;
          if (length(center - rightCol) > 0.14) {
            col = vec3(0.06, 0.96, 0.58);
          }
        }

        gl_FragColor = vec4(col, 1.0);
      }
    \`;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    glProgram = gl.createProgram();
    gl.attachShader(glProgram, vs);
    gl.attachShader(glProgram, fs);
    gl.linkProgram(glProgram);
    gl.useProgram(glProgram);

    const verts = new Float32Array([
      -1, -1,  0, 1,
       1, -1,  1, 1,
      -1,  1,  0, 0,
       1,  1,  1, 0
    ]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(glProgram, 'a_pos');
    const aUv = gl.getAttribLocation(glProgram, 'a_uv');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 16, 8);

    glTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, glTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const names = [
      'u_hqPass', 'u_zoom', 'u_mirror', 'u_gain', 'u_contrast', 'u_sat', 'u_wbOffset',
      'u_shadowLift', 'u_highlightRoll', 'u_bw', 'u_redFilter', 'u_sharpness',
      'u_grain', 'u_halation', 'u_vignette', 'u_zebra', 'u_peaking',
      'u_time', 'u_texel'
    ];
    names.forEach((n) => {
      uLocs[n] = gl.getUniformLocation(glProgram, n);
    });
    return true;
  }

  const hasWebGL = initWebGL();

  // -------------------------------------------------------------------------
  // 4. HAPTICS, AUDIO & TOAST UTILITIES
  // -------------------------------------------------------------------------
  function triggerHaptic(type = 'tick') {
    try {
      if (window.LensCraftAndroid && typeof window.LensCraftAndroid.triggerHaptic === 'function') {
        window.LensCraftAndroid.triggerHaptic(type);
        return;
      }
      if (navigator.vibrate) {
        navigator.vibrate(type === 'shutter' ? 16 : 6);
      }
    } catch (_) {}
  }

  let audioCtx = null;
  function playMechanicalShutterSound() {
    if (!state.shutterSoundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.035);
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.007));
      }
      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.032);
      whiteNoise.connect(gain);
      gain.connect(audioCtx.destination);
      whiteNoise.start(now);
    } catch (_) {}
  }

  let toastTimer = null;
  function showToast(msg) {
    toastBanner.textContent = msg;
    toastBanner.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastBanner.classList.remove('visible');
    }, 2000);
  }

  // -------------------------------------------------------------------------
  // 5. DUAL-ENGINE CAMERA STREAM:
  //    - Preview Stream: Lightweight 1280x960 for zero-lag 60 FPS viewfinder
  //    - Still Capture: Queries max hardware photo resolution via ImageCapture
  // -------------------------------------------------------------------------
  function initHardwareInfo() {
    try {
      if (window.LensCraftAndroid && typeof window.LensCraftAndroid.getDeviceCameraSpecs === 'function') {
        const raw = window.LensCraftAndroid.getDeviceCameraSpecs();
        if (raw) {
          const info = JSON.parse(raw);
          if (info.model) state.deviceModel = info.model.toUpperCase();
          if (info.aperture) state.aperture = 'f/' + info.aperture;
        }
      }
    } catch (_) {}
    updateTelemetryLabels();
  }

  function updateTelemetryLabels() {
    const isoStr = state.iso === 'AUTO' ? 'ISO AUTO' : 'ISO ' + state.iso;
    const shutStr = state.shutter === 'AUTO' ? '1/250s' : state.shutter + 's';
    const evStr = state.ev === '0.0' ? '' : ' • ' + state.ev + ' EV';
    document.getElementById('hud-lens-line').textContent =
      state.focalMm + 'mm • ' + state.aperture + ' • ' + shutStr + ' • ' + isoStr + evStr;

    const stillRes = state.maxPhotoWidth > 0
      ? (state.maxPhotoWidth + '×' + state.maxPhotoHeight + ' ISP')
      : 'UHD ISP STILL';
    document.getElementById('hud-device-line').textContent =
      state.deviceModel + ' • ' + stillRes + ' • ' + state.film.id;
    document.getElementById('active-film-badge').textContent =
      state.film.id + ' • 60FPS';
  }

  async function startCamera() {
    try {
      if (state.stream) {
        state.stream.getTracks().forEach((t) => t.stop());
      }
      // Keep live video stream at lightweight 1280x960 (just like v1.1!) so 60fps preview never lags
      const constraints = {
        audio: false,
        video: {
          facingMode: { ideal: state.facingMode },
          width: { ideal: 1280 },
          height: { ideal: 960 },
          frameRate: { ideal: 30, max: 60 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      state.stream = stream;
      state.videoTrack = stream.getVideoTracks()[0] || null;
      state.labImage = null;

      // Setup W3C ImageCapture and query max sensor still resolution
      state.imageCapture = null;
      state.maxPhotoWidth = 0;
      state.maxPhotoHeight = 0;
      if (state.videoTrack && typeof window.ImageCapture === 'function') {
        try {
          state.imageCapture = new window.ImageCapture(state.videoTrack);
          if (typeof state.imageCapture.getPhotoCapabilities === 'function') {
            const photoCaps = await state.imageCapture.getPhotoCapabilities().catch(() => null);
            if (photoCaps && photoCaps.imageWidth && photoCaps.imageWidth.max) {
              state.maxPhotoWidth = photoCaps.imageWidth.max;
              state.maxPhotoHeight = photoCaps.imageHeight ? photoCaps.imageHeight.max : 0;
            }
          }
        } catch (_) {}
      }

      videoEl.srcObject = stream;
      await videoEl.play().catch(() => {});
      applyHardwareTrackConstraints();
      updateTelemetryLabels();
    } catch (err) {
      createProceduralTestScene();
    }
  }

  function createProceduralTestScene() {
    const c = document.createElement('canvas');
    c.width = 1280;
    c.height = 960;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 960);
    grad.addColorStop(0, '#1a2a44');
    grad.addColorStop(0.52, '#d97742');
    grad.addColorStop(0.55, '#182026');
    grad.addColorStop(1, '#090b0e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 960);

    ctx.fillStyle = '#fff5d6';
    ctx.beginPath();
    ctx.arc(840, 340, 75, 0, Math.PI * 2);
    ctx.fill();

    const swatches = ['#b8332a', '#d9822b', '#e6c229', '#2b8a3e', '#1971c2', '#6741d9'];
    swatches.forEach((hex, idx) => {
      ctx.fillStyle = hex;
      ctx.fillRect(240 + idx * 130, 690, 110, 110);
    });

    const img = new Image();
    img.onload = () => {
      state.labImage = img;
    };
    img.src = c.toDataURL('image/png');
  }

  async function applyHardwareTrackConstraints() {
    if (!state.videoTrack || typeof state.videoTrack.getCapabilities !== 'function') return;
    try {
      const caps = state.videoTrack.getCapabilities() || {};
      const adv = {};
      if (caps.zoom) {
        const minZ = caps.zoom.min || 1;
        const maxZ = caps.zoom.max || 1;
        adv.zoom = Math.min(maxZ, Math.max(minZ, state.zoom));
      }
      if (caps.torch !== undefined) {
        adv.torch = !!state.torch;
      }
      if (caps.exposureCompensation && state.ev !== '0.0') {
        const evVal = parseFloat(state.ev);
        const minE = caps.exposureCompensation.min ?? -2;
        const maxE = caps.exposureCompensation.max ?? 2;
        adv.exposureCompensation = Math.min(maxE, Math.max(minE, evVal));
      }
      if (Object.keys(adv).length > 0) {
        await state.videoTrack.applyConstraints({ advanced: [adv] });
      }
    } catch (_) {}
  }

  // -------------------------------------------------------------------------
  // 6. DUAL-MODE WEBGL RENDERER
  // -------------------------------------------------------------------------
  function computeExposureGain() {
    let evStops = parseFloat(state.ev) || 0;
    if (state.iso !== 'AUTO') {
      const isoNum = parseInt(state.iso, 10) || 200;
      evStops += Math.log2(isoNum / 200) * 0.42;
    }
    if (state.shutter !== 'AUTO') {
      const parts = state.shutter.split('/');
      const sec = parts.length === 2 ? parseFloat(parts[0]) / parseFloat(parts[1]) : parseFloat(state.shutter);
      evStops += Math.log2(sec / (1 / 250)) * 0.42;
    }
    return Math.pow(2, Math.max(-2.8, Math.min(2.8, evStops)));
  }

  function computeWbOffset() {
    const rRecipe = state.film.warmth;
    const gRecipe = state.film.tint;
    const bRecipe = -state.film.warmth * 0.8;
    if (state.wb === 'AUTO') return [rRecipe, gRecipe, bRecipe];
    const kelvin = parseInt(state.wb, 10) || 5400;
    const delta = (kelvin - 5400) / 10000;
    return [rRecipe + delta, gRecipe, bRecipe - delta];
  }

  function renderWebGLFrame(source, width, height, isHqStillCapture, zoomFactor, mirrorX) {
    if (!hasWebGL) return;
    const safeW = Math.min(maxGpuTexSize, width);
    const safeH = Math.min(maxGpuTexSize, height);
    if (vfCanvas.width !== safeW || vfCanvas.height !== safeH) {
      vfCanvas.width = safeW;
      vfCanvas.height = safeH;
    }
    gl.viewport(0, 0, safeW, safeH);
    gl.useProgram(glProgram);

    gl.bindTexture(gl.TEXTURE_2D, glTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

    const r = state.film;
    const wb = computeWbOffset();

    gl.uniform1f(uLocs.u_hqPass, isHqStillCapture ? 1.0 : 0.0);
    gl.uniform1f(uLocs.u_zoom, zoomFactor);
    gl.uniform1f(uLocs.u_mirror, mirrorX ? 1.0 : 0.0);
    gl.uniform1f(uLocs.u_gain, computeExposureGain());
    gl.uniform1f(uLocs.u_contrast, r.contrast);
    gl.uniform1f(uLocs.u_sat, r.saturation);
    gl.uniform3f(uLocs.u_wbOffset, wb[0], wb[1], wb[2]);
    gl.uniform1f(uLocs.u_shadowLift, r.shadowLift);
    gl.uniform1f(uLocs.u_highlightRoll, r.highlightRoll);
    gl.uniform1f(uLocs.u_bw, r.bw);
    gl.uniform1f(uLocs.u_redFilter, r.redFilter);
    gl.uniform1f(uLocs.u_sharpness, (state.sharpness / 100) * 1.65);
    gl.uniform1f(uLocs.u_grain, (state.grain / 100) * 0.11);
    gl.uniform1f(uLocs.u_halation, state.halation / 100);
    gl.uniform1f(uLocs.u_vignette, (state.vignette / 100) * 0.62);
    gl.uniform1f(uLocs.u_zebra, !isHqStillCapture && state.showZebra ? 1.0 : 0.0);
    gl.uniform1f(uLocs.u_peaking, !isHqStillCapture && state.showPeaking ? 1.0 : 0.0);
    gl.uniform1f(uLocs.u_time, (performance.now() * 0.001) % 100.0);
    gl.uniform2f(uLocs.u_texel, 1.0 / safeW, 1.0 / safeH);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  let lastHistTime = 0;
  const histR = new Uint16Array(32);
  const histG = new Uint16Array(32);
  const histB = new Uint16Array(32);
  const histL = new Uint16Array(32);

  function updateTinyHistogram(now) {
    if (!state.showHistogram || now - lastHistTime < 250) return;
    lastHistTime = now;

    // Sample from already-rendered WebGL vfCanvas (avoids CPU decoding of <video> stream!)
    tinyCtx.drawImage(vfCanvas, 0, 0, 32, 24);
    const data = tinyCtx.getImageData(0, 0, 32, 24).data;
    histR.fill(0);
    histG.fill(0);
    histB.fill(0);
    histL.fill(0);

    for (let i = 0; i < data.length; i += 8) {
      const r = data[i] >> 3;
      const g = data[i + 1] >> 3;
      const b = data[i + 2] >> 3;
      const l = (r * 77 + g * 150 + b * 29) >> 8;
      histR[r]++;
      histG[g]++;
      histB[b]++;
      histL[l]++;
    }

    const w = histCanvas.width;
    const h = histCanvas.height;
    histCtx.clearRect(0, 0, w, h);

    let maxVal = 1;
    for (let i = 1; i < 31; i++) {
      if (histL[i] > maxVal) maxVal = histL[i];
    }

    const drawChan = (bins, stroke) => {
      histCtx.beginPath();
      for (let i = 0; i < 32; i++) {
        const x = (i / 31) * w;
        const y = h - Math.min(1, bins[i] / maxVal) * (h - 4);
        if (i === 0) histCtx.moveTo(x, y);
        else histCtx.lineTo(x, y);
      }
      histCtx.strokeStyle = stroke;
      histCtx.lineWidth = 1.4;
      histCtx.stroke();
    };

    drawChan(histR, '#ef4444');
    drawChan(histG, '#34d399');
    drawChan(histB, '#60a5fa');
    drawChan(histL, '#ffffff');
  }

  let isCapturingStill = false;

  function renderViewfinderLoop(now) {
    if (!isCapturingStill) {
      const source = state.labImage || (videoEl.readyState >= 2 ? videoEl : null);
      if (source) {
        const srcW = state.labImage ? state.labImage.width : (videoEl.videoWidth || 960);
        const srcH = state.labImage ? state.labImage.height : (videoEl.videoHeight || 720);
        if (srcW > 0 && srcH > 0) {
          // Fast 720p live preview resolution (butter-smooth 60 FPS on any mobile GPU!)
          const dispW = Math.min(720, srcW);
          const dispH = Math.round((srcH / srcW) * dispW);
          const mirrorX = state.facingMode === 'user' && !state.labImage;
          renderWebGLFrame(source, dispW, dispH, false, Math.max(1.0, state.zoom), mirrorX);
          updateTinyHistogram(now);
        }
      }
    }
    requestAnimationFrame(renderViewfinderLoop);
  }

  // -------------------------------------------------------------------------
  // 7. ULTRA-HD STILL CAPTURE PIPELINE (Runs Only When Pressing Shutter!)
  // -------------------------------------------------------------------------
  function extractDominantPalette(sourceCanvas) {
    tinyCtx.drawImage(sourceCanvas, 0, 0, 24, 24);
    const data = tinyCtx.getImageData(0, 0, 24, 24).data;
    const buckets = [
      { r: 0, g: 0, b: 0, c: 0 },
      { r: 0, g: 0, b: 0, c: 0 },
      { r: 0, g: 0, b: 0, c: 0 },
      { r: 0, g: 0, b: 0, c: 0 },
      { r: 0, g: 0, b: 0, c: 0 }
    ];
    for (let i = 0; i < data.length; i += 4) {
      const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const bIdx = Math.min(4, Math.floor((luma / 256) * 5));
      buckets[bIdx].r += data[i];
      buckets[bIdx].g += data[i + 1];
      buckets[bIdx].b += data[i + 2];
      buckets[bIdx].c++;
    }
    return buckets.map((b, idx) => {
      if (b.c === 0) return ['#1c1f26', '#3c4252', '#70798c', '#b5bdca', '#e5e9f0'][idx];
      const r = Math.round(b.r / b.c).toString(16).padStart(2, '0');
      const g = Math.round(b.g / b.c).toString(16).padStart(2, '0');
      const bl = Math.round(b.b / b.c).toString(16).padStart(2, '0');
      return '#' + r + g + bl;
    });
  }

  function buildFramedCanvas(rawCanvas, meta, palette, frameStyle) {
    if (frameStyle === 'none') {
      return rawCanvas;
    }

    const out = document.createElement('canvas');
    const ctx = out.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const w = rawCanvas.width;
    const h = rawCanvas.height;

    if (frameStyle === 'cinema-stamp') {
      out.width = w;
      out.height = h;
      ctx.drawImage(rawCanvas, 0, 0);
      const fontSize = Math.max(20, Math.round(w * 0.026));
      ctx.font = '700 ' + fontSize + 'px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      const stampText = meta.dateShort + '  •  ' + meta.filmCode + ' ' + meta.focalMm + 'MM';
      ctx.fillStyle = '#ff9233';
      ctx.fillText(stampText, w - Math.round(w * 0.035), h - Math.round(h * 0.035));
      return out;
    }

    const isDark = frameStyle === 'darkroom-black';
    const padSide = Math.round(w * 0.042);
    const padTop = Math.round(w * 0.042);
    const footerH = Math.round(Math.max(120, w * 0.14));

    out.width = w + padSide * 2;
    out.height = h + padTop + footerH;

    ctx.fillStyle = isDark ? '#0b0d11' : '#fbfaf7';
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(rawCanvas, padSide, padTop);

    const footerCenterY = padTop + h + footerH * 0.52;
    const leftX = padSide;
    const rightX = out.width - padSide;

    const dotRadius = Math.max(10, Math.round(w * 0.013));
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(leftX + dotRadius, footerCenterY - footerH * 0.12, dotRadius, 0, Math.PI * 2);
    ctx.fill();

    const titleSize = Math.max(18, Math.round(w * 0.025));
    const subSize = Math.max(13, Math.round(w * 0.017));
    ctx.textAlign = 'left';
    ctx.fillStyle = isDark ? '#f4f6f8' : '#111318';
    ctx.font = '800 ' + titleSize + 'px "Inter", sans-serif';
    ctx.fillText(meta.deviceModel, leftX + dotRadius * 2.8, footerCenterY - footerH * 0.06);

    ctx.fillStyle = isDark ? '#9aa4b5' : '#646d7d';
    ctx.font = '600 ' + subSize + 'px "JetBrains Mono", monospace';
    ctx.fillText(
      'FILM: ' + meta.filmName.toUpperCase() + ' (' + meta.filmCode + ') • ' + meta.resolutionText,
      leftX + dotRadius * 2.8,
      footerCenterY + footerH * 0.18
    );

    const swatchW = Math.max(16, Math.round(w * 0.022));
    const swatchH = Math.max(16, Math.round(w * 0.022));
    const paletteStartX = rightX - swatchW * 5 - Math.round(w * 0.28);
    if (paletteStartX > leftX + Math.round(w * 0.42)) {
      palette.forEach((hex, idx) => {
        ctx.fillStyle = hex;
        ctx.fillRect(
          paletteStartX + idx * (swatchW + 4),
          footerCenterY - swatchH * 0.6,
          swatchW,
          swatchH
        );
      });
    }

    ctx.textAlign = 'right';
    ctx.fillStyle = isDark ? '#f4f6f8' : '#111318';
    ctx.font = '700 ' + Math.round(titleSize * 0.9) + 'px "JetBrains Mono", monospace';
    ctx.fillText(
      meta.focalMm + 'mm  ' + meta.aperture + '  ' + meta.shutter + '  ISO ' + meta.iso,
      rightX,
      footerCenterY - footerH * 0.06
    );

    ctx.fillStyle = isDark ? '#9aa4b5' : '#646d7d';
    ctx.font = '500 ' + subSize + 'px "JetBrains Mono", monospace';
    ctx.fillText(meta.timestamp, rightX, footerCenterY + footerH * 0.18);

    return out;
  }

  function canvasToDataUrlAsync(canvas, quality = 0.98) {
    return new Promise((resolve) => {
      if (typeof canvas.toBlob === 'function') {
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(canvas.toDataURL('image/jpeg', quality));
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        }, 'image/jpeg', quality);
      } else {
        resolve(canvas.toDataURL('image/jpeg', quality));
      }
    });
  }

  async function grabHighestResolutionSource() {
    if (state.labImage) {
      return {
        source: state.labImage,
        w: state.labImage.width,
        h: state.labImage.height
      };
    }

    // Trigger Android Camera2 Full-Resolution ISP Still Photo (even while preview stream is 1280x960!)
    if (state.imageCapture && typeof state.imageCapture.takePhoto === 'function') {
      try {
        const opts = {};
        if (state.maxPhotoWidth > 0 && state.maxPhotoHeight > 0) {
          opts.imageWidth = Math.min(4096, state.maxPhotoWidth);
          opts.imageHeight = Math.min(3072, state.maxPhotoHeight);
        }
        const blob = await state.imageCapture.takePhoto(opts);
        if (blob && typeof window.createImageBitmap === 'function') {
          const bmp = await window.createImageBitmap(blob);
          return {
            source: bmp,
            w: bmp.width,
            h: bmp.height
          };
        }
      } catch (_) {}
    }

    if (videoEl.readyState >= 2) {
      return {
        source: videoEl,
        w: videoEl.videoWidth || 1280,
        h: videoEl.videoHeight || 960
      };
    }
    return null;
  }

  async function capturePhoto() {
    if (isCapturingStill) return;
    triggerHaptic('shutter');
    playMechanicalShutterSound();

    shutterCurtain.classList.add('fired');
    setTimeout(() => shutterCurtain.classList.remove('fired'), 85);

    isCapturingStill = true;
    try {
      const cap = await grabHighestResolutionSource();
      if (!cap) {
        showToast('⚠️ Sensor belum siap');
        isCapturingStill = false;
        return;
      }

      const srcW = Math.min(maxGpuTexSize, cap.w);
      const srcH = Math.min(maxGpuTexSize, cap.h);
      const mirrorX = state.facingMode === 'user' && !state.labImage;

      // Render Full-Resolution Still with HQ 5-Tap Optical Unsharp Mask (isHqStillCapture = true)
      renderWebGLFrame(cap.source, srcW, srcH, true, Math.max(1.0, state.zoom), mirrorX);

      const targetAspect = ASPECT_RATIOS[state.aspectIndex].ratio;
      const currentAspect = srcW / srcH;
      const effectiveAspect = (srcH > srcW && ASPECT_RATIOS[state.aspectIndex].label !== 'XPAN')
        ? (1 / targetAspect)
        : targetAspect;

      let cropW = srcW;
      let cropH = srcH;
      if (currentAspect > effectiveAspect) {
        cropW = srcH * effectiveAspect;
      } else {
        cropH = srcW / effectiveAspect;
      }
      const cropX = (srcW - cropW) * 0.5;
      const cropY = (srcH - cropH) * 0.5;

      const rawCanvas = document.createElement('canvas');
      rawCanvas.width = Math.round(cropW);
      rawCanvas.height = Math.round(cropH);
      const rCtx = rawCanvas.getContext('2d');
      rCtx.imageSmoothingEnabled = true;
      rCtx.imageSmoothingQuality = 'high';
      rCtx.drawImage(vfCanvas, cropX, cropY, cropW, cropH, 0, 0, rawCanvas.width, rawCanvas.height);

      if (cap.source && typeof cap.source.close === 'function') {
        cap.source.close();
      }

      // Immediately release viewfinder back to 60 FPS preview before encoding JPEG!
      isCapturingStill = false;

      const now = new Date();
      const pad2 = (n) => String(n).padStart(2, '0');
      const mp = ((rawCanvas.width * rawCanvas.height) / 1000000).toFixed(1) + 'MP';
      const meta = {
        deviceModel: state.deviceModel,
        filmCode: state.film.id,
        filmName: state.film.name,
        focalMm: state.focalMm,
        aperture: state.aperture,
        shutter: state.shutter === 'AUTO' ? '1/250s' : state.shutter + 's',
        iso: state.iso === 'AUTO' ? '100' : state.iso,
        resolutionText: rawCanvas.width + '×' + rawCanvas.height + ' (' + mp + ')',
        timestamp:
          now.getFullYear() + '.' + pad2(now.getMonth() + 1) + '.' + pad2(now.getDate()) +
          '  ' + pad2(now.getHours()) + ':' + pad2(now.getMinutes()) + ':' + pad2(now.getSeconds()),
        dateShort:
          "'" + String(now.getFullYear()).slice(-2) + ' ' + pad2(now.getMonth() + 1) + ' ' + pad2(now.getDate()),
        fileName:
          'LensCraft_UHD_' + state.film.id + '_' +
          now.getFullYear() + pad2(now.getMonth() + 1) + pad2(now.getDate()) + '_' +
          pad2(now.getHours()) + pad2(now.getMinutes()) + pad2(now.getSeconds()) + '.jpg'
      };

      const palette = extractDominantPalette(rawCanvas);
      const activeStyle = state.exifFrameEnabled ? state.selectedFrameStyle : 'none';
      const framedCanvas = buildFramedCanvas(rawCanvas, meta, palette, activeStyle);

      // Encode JPEG asynchronously via toBlob so UI never freezes!
      const framedDataUrl = await canvasToDataUrlAsync(framedCanvas, 0.98);

      const shot = { rawCanvas, framedDataUrl, meta, palette };
      state.capturedShots.unshift(shot);
      state.currentShotIndex = 0;

      const thumbImg = document.getElementById('thumb-preview');
      thumbImg.src = framedDataUrl;
      thumbImg.style.display = 'block';
      document.getElementById('thumb-empty-icon').style.display = 'none';
      document.getElementById('thumb-count').textContent = String(state.capturedShots.length);

      saveDataUrlToGallery(framedDataUrl, meta.fileName, true, meta.resolutionText);
    } catch (e) {
      isCapturingStill = false;
    }
  }

  function dataUrlToBase64(dataUrl) {
    const idx = dataUrl.indexOf(',');
    return idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
  }

  function saveDataUrlToGallery(dataUrl, fileName, isAutoCapture = false, resInfo = '') {
    const base64 = dataUrlToBase64(dataUrl);
    if (window.LensCraftAndroid && typeof window.LensCraftAndroid.savePhotoToGallery === 'function') {
      const savedPath = window.LensCraftAndroid.savePhotoToGallery(base64, fileName, 'image/jpeg');
      if (savedPath) {
        showToast('📸 UHD (' + (resInfo || state.film.id) + ') Tersimpan!');
        return;
      }
    }
    if (!isAutoCapture) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('💾 Foto UHD diunduh: ' + fileName);
    } else {
      showToast('📸 Tersimpan (' + (resInfo || state.film.id) + ')');
    }
  }

  // -------------------------------------------------------------------------
  // 8. UI CONTROLS, DIALS & EVENT BINDINGS
  // -------------------------------------------------------------------------
  function renderFilmCards() {
    filmStripScroll.innerHTML = '';
    FILM_RECIPES.forEach((r) => {
      const card = document.createElement('div');
      card.className = 'film-card' + (r.id === state.film.id ? ' active' : '');
      card.innerHTML =
        '<div class="film-card-code"><span>' + r.id + '</span><span>●</span></div>' +
        '<div class="film-card-name">' + r.name + '</div>' +
        '<div class="film-card-desc">' + r.desc + '</div>';
      card.addEventListener('click', () => {
        triggerHaptic('tick');
        state.film = r;
        state.sharpness = r.defaultSharpness;
        state.grain = r.defaultGrain;
        state.halation = r.defaultHalation;
        state.vignette = r.defaultVignette;
        syncCharacterSliders();
        document.getElementById('dial-val-film').textContent = r.id;
        renderFilmCards();
        updateTelemetryLabels();
        showToast('🎞️ ' + r.name);
      });
      filmStripScroll.appendChild(card);
    });
  }

  function syncCharacterSliders() {
    document.getElementById('slider-sharpness').value = state.sharpness;
    document.getElementById('val-sharpness').textContent = state.sharpness + '%';
    document.getElementById('slider-grain').value = state.grain;
    document.getElementById('val-grain').textContent = state.grain + '%';
    document.getElementById('slider-halation').value = state.halation;
    document.getElementById('val-halation').textContent = state.halation + '%';
    document.getElementById('slider-vignette').value = state.vignette;
    document.getElementById('val-vignette').textContent = state.vignette + '%';
  }

  function renderDialWheel(dialKey) {
    if (dialKey === 'FILM') {
      filmDrawer.classList.add('open');
      valueWheelBar.classList.add('hidden');
      return;
    }
    filmDrawer.classList.remove('open');
    valueWheelBar.classList.remove('hidden');
    valueWheelBar.innerHTML = '';

    const options = DIAL_OPTIONS[dialKey] || [];
    const currentVal =
      dialKey === 'ISO' ? state.iso :
      dialKey === 'SHUTTER' ? state.shutter :
      dialKey === 'EV' ? state.ev :
      dialKey === 'WB' ? state.wb : state.focus;

    options.forEach((opt) => {
      const chip = document.createElement('button');
      chip.className = 'wheel-chip' + (opt === currentVal ? ' selected' : '');
      chip.textContent = opt;
      chip.addEventListener('click', () => {
        triggerHaptic('tick');
        if (dialKey === 'ISO') {
          state.iso = opt;
          document.getElementById('dial-val-iso').textContent = opt;
        } else if (dialKey === 'SHUTTER') {
          state.shutter = opt;
          document.getElementById('dial-val-shutter').textContent = opt;
        } else if (dialKey === 'EV') {
          state.ev = opt;
          document.getElementById('dial-val-ev').textContent = opt;
          applyHardwareTrackConstraints();
        } else if (dialKey === 'WB') {
          state.wb = opt;
          document.getElementById('dial-val-wb').textContent = opt;
        } else if (dialKey === 'FOCUS') {
          state.focus = opt;
          document.getElementById('dial-val-focus').textContent = opt;
          applyHardwareTrackConstraints();
        }
        renderDialWheel(dialKey);
        updateTelemetryLabels();
      });
      valueWheelBar.appendChild(chip);
    });
  }

  function updateAspectCropBox() {
    const stage = document.getElementById('viewfinder-stage');
    const sw = stage.clientWidth || 360;
    const sh = stage.clientHeight || 480;
    const ratioObj = ASPECT_RATIOS[state.aspectIndex];
    const targetRatio = (sh > sw && ratioObj.label !== 'XPAN' && ratioObj.label !== '1:1')
      ? (1 / ratioObj.ratio)
      : ratioObj.ratio;

    let w = sw;
    let h = sw / targetRatio;
    if (h > sh) {
      h = sh;
      w = sh * targetRatio;
    }
    cropBox.style.width = Math.round(w) + 'px';
    cropBox.style.height = Math.round(h) + 'px';
    document.getElementById('btn-aspect').textContent = ratioObj.label;
  }

  function openGalleryModal() {
    if (state.capturedShots.length === 0) {
      showToast('🎞️ Belum ada foto di Film Roll');
      return;
    }
    triggerHaptic('tick');
    refreshModalView();
    document.getElementById('gallery-modal').classList.add('open');
  }

  async function refreshModalView() {
    const shot = state.capturedShots[state.currentShotIndex];
    if (!shot) return;
    const framedCanvas = buildFramedCanvas(
      shot.rawCanvas,
      shot.meta,
      shot.palette,
      state.selectedFrameStyle
    );
    shot.framedDataUrl = await canvasToDataUrlAsync(framedCanvas, 0.98);
    document.getElementById('preview-rendered-img').src = shot.framedDataUrl;
    document.getElementById('shot-counter-label').textContent =
      (state.currentShotIndex + 1) + ' / ' + state.capturedShots.length;
  }

  function bindEvents() {
    document.querySelectorAll('.dial-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        triggerHaptic('tick');
        const dial = pill.getAttribute('data-dial');
        if (state.activeDial === dial && dial === 'FILM') {
          filmDrawer.classList.toggle('open');
          return;
        }
        state.activeDial = dial;
        document.querySelectorAll('.dial-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        renderDialWheel(dial);
      });
    });

    document.getElementById('slider-sharpness').addEventListener('input', (e) => {
      state.sharpness = parseInt(e.target.value, 10) || 0;
      document.getElementById('val-sharpness').textContent = state.sharpness + '%';
    });
    document.getElementById('slider-grain').addEventListener('input', (e) => {
      state.grain = parseInt(e.target.value, 10) || 0;
      document.getElementById('val-grain').textContent = state.grain + '%';
    });
    document.getElementById('slider-halation').addEventListener('input', (e) => {
      state.halation = parseInt(e.target.value, 10) || 0;
      document.getElementById('val-halation').textContent = state.halation + '%';
    });
    document.getElementById('slider-vignette').addEventListener('input', (e) => {
      state.vignette = parseInt(e.target.value, 10) || 0;
      document.getElementById('val-vignette').textContent = state.vignette + '%';
    });

    document.querySelectorAll('.lens-btn[data-zoom]').forEach((btn) => {
      btn.addEventListener('click', () => {
        triggerHaptic('tick');
        document.querySelectorAll('.lens-btn[data-zoom]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.zoom = parseFloat(btn.getAttribute('data-zoom')) || 1.0;
        state.focalMm = parseInt(btn.getAttribute('data-mm'), 10) || 24;
        applyHardwareTrackConstraints();
        updateTelemetryLabels();
      });
    });

    const fileInput = document.getElementById('file-import-input');
    document.getElementById('btn-import-lab').addEventListener('click', () => {
      triggerHaptic('tick');
      fileInput.click();
    });
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          state.labImage = img;
          showToast('🖼️ Foto dimuat ke Film Lab (' + img.width + '×' + img.height + ')');
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('btn-aspect').addEventListener('click', () => {
      triggerHaptic('tick');
      state.aspectIndex = (state.aspectIndex + 1) % ASPECT_RATIOS.length;
      updateAspectCropBox();
    });

    document.getElementById('btn-grid').addEventListener('click', (e) => {
      triggerHaptic('tick');
      state.gridMode = (state.gridMode + 1) % 3;
      gridOverlay.className = 'grid-overlay ' + (
        state.gridMode === 1 ? 'grid-thirds' :
        state.gridMode === 2 ? 'grid-golden' : ''
      );
      e.currentTarget.classList.toggle('active', state.gridMode > 0);
      e.currentTarget.textContent = state.gridMode === 2 ? 'PHI' : 'GRID';
    });

    document.getElementById('btn-hist').addEventListener('click', (e) => {
      triggerHaptic('tick');
      state.showHistogram = !state.showHistogram;
      document.getElementById('histogram-box').classList.toggle('hidden', !state.showHistogram);
      e.currentTarget.classList.toggle('active', state.showHistogram);
    });

    document.getElementById('btn-zebra').addEventListener('click', (e) => {
      triggerHaptic('tick');
      state.showZebra = !state.showZebra;
      e.currentTarget.classList.toggle('active', state.showZebra);
    });

    document.getElementById('btn-peaking').addEventListener('click', (e) => {
      triggerHaptic('tick');
      state.showPeaking = !state.showPeaking;
      e.currentTarget.classList.toggle('active', state.showPeaking);
    });

    document.getElementById('btn-level').addEventListener('click', (e) => {
      triggerHaptic('tick');
      state.showLevel = !state.showLevel;
      horizonLevel.classList.toggle('hidden', !state.showLevel);
      e.currentTarget.classList.toggle('active', state.showLevel);
    });

    document.getElementById('btn-frame-toggle').addEventListener('click', (e) => {
      triggerHaptic('tick');
      state.exifFrameEnabled = !state.exifFrameEnabled;
      e.currentTarget.classList.toggle('active', state.exifFrameEnabled);
    });

    document.getElementById('btn-torch').addEventListener('click', (e) => {
      triggerHaptic('tick');
      state.torch = !state.torch;
      e.currentTarget.classList.toggle('active', state.torch);
      e.currentTarget.textContent = state.torch ? '⚡ ON' : '⚡ OFF';
      applyHardwareTrackConstraints();
    });

    const safeOffsets = [0, 28, 42];
    document.getElementById('btn-safe-top').addEventListener('click', (e) => {
      triggerHaptic('tick');
      state.topSafeIndex = (state.topSafeIndex + 1) % safeOffsets.length;
      const px = safeOffsets[state.topSafeIndex];
      document.documentElement.style.setProperty('--top-safe', px + 'px');
      e.currentTarget.textContent = 'SAFE ' + px;
      setTimeout(updateAspectCropBox, 60);
    });

    const vfStage = document.getElementById('viewfinder-stage');
    vfStage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.lens-bar-wrap')) return;
      const rect = vfStage.getBoundingClientRect();
      focusReticle.style.left = (e.clientX - rect.left) + 'px';
      focusReticle.style.top = (e.clientY - rect.top) + 'px';
      focusReticle.classList.remove('locked');
      focusReticle.classList.add('active');
      focusReticleLabel.textContent = 'AF • SEEK';

      setTimeout(() => {
        focusReticle.classList.add('locked');
        focusReticleLabel.textContent = 'AF-S • LOCK';
      }, 200);

      setTimeout(() => {
        focusReticle.classList.remove('active');
      }, 1800);
    });

    document.getElementById('btn-shutter').addEventListener('click', capturePhoto);

    document.getElementById('btn-sound-toggle').addEventListener('click', (e) => {
      state.shutterSoundEnabled = !state.shutterSoundEnabled;
      e.currentTarget.classList.toggle('active', state.shutterSoundEnabled);
      e.currentTarget.textContent = state.shutterSoundEnabled ? '🔊' : '🔇';
    });

    document.getElementById('btn-reset-all').addEventListener('click', () => {
      triggerHaptic('tick');
      state.iso = 'AUTO';
      state.shutter = 'AUTO';
      state.ev = '0.0';
      state.wb = '5400K';
      state.focus = 'AF-S';
      state.labImage = null;
      document.getElementById('dial-val-iso').textContent = 'AUTO';
      document.getElementById('dial-val-shutter').textContent = 'AUTO';
      document.getElementById('dial-val-ev').textContent = '0.0';
      document.getElementById('dial-val-wb').textContent = '5400K';
      document.getElementById('dial-val-focus').textContent = 'AF-S';
      applyHardwareTrackConstraints();
      updateTelemetryLabels();
      showToast('⚡ Reset Auto Exposure (AE)');
    });

    document.getElementById('btn-flip-cam').addEventListener('click', () => {
      triggerHaptic('tick');
      state.facingMode = state.facingMode === 'environment' ? 'user' : 'environment';
      startCamera();
    });

    document.getElementById('thumb-well').addEventListener('click', openGalleryModal);
    document.getElementById('btn-close-modal').addEventListener('click', () => {
      document.getElementById('gallery-modal').classList.remove('open');
    });
    document.getElementById('btn-prev-shot').addEventListener('click', () => {
      if (state.capturedShots.length === 0) return;
      state.currentShotIndex =
        (state.currentShotIndex - 1 + state.capturedShots.length) % state.capturedShots.length;
      refreshModalView();
    });
    document.getElementById('btn-next-shot').addEventListener('click', () => {
      if (state.capturedShots.length === 0) return;
      state.currentShotIndex = (state.currentShotIndex + 1) % state.capturedShots.length;
      refreshModalView();
    });

    document.querySelectorAll('.frame-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        triggerHaptic('tick');
        document.querySelectorAll('.frame-opt').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedFrameStyle = btn.getAttribute('data-frame');
        refreshModalView();
      });
    });

    document.getElementById('btn-save-dcim').addEventListener('click', () => {
      const shot = state.capturedShots[state.currentShotIndex];
      if (!shot) return;
      triggerHaptic('tick');
      saveDataUrlToGallery(shot.framedDataUrl, shot.meta.fileName, false, shot.meta.resolutionText);
    });

    document.getElementById('btn-save-as').addEventListener('click', () => {
      const shot = state.capturedShots[state.currentShotIndex];
      if (!shot) return;
      triggerHaptic('tick');
      const base64 = dataUrlToBase64(shot.framedDataUrl);
      if (window.LensCraftAndroid && typeof window.LensCraftAndroid.saveWithSystemPicker === 'function') {
        window.LensCraftAndroid.saveWithSystemPicker(base64, shot.meta.fileName, 'image/jpeg');
      } else {
        saveDataUrlToGallery(shot.framedDataUrl, shot.meta.fileName, false, shot.meta.resolutionText);
      }
    });

    document.getElementById('btn-share-photo').addEventListener('click', () => {
      const shot = state.capturedShots[state.currentShotIndex];
      if (!shot) return;
      triggerHaptic('tick');
      const base64 = dataUrlToBase64(shot.framedDataUrl);
      if (window.LensCraftAndroid && typeof window.LensCraftAndroid.shareFile === 'function') {
        window.LensCraftAndroid.shareFile(base64, shot.meta.fileName, 'image/jpeg');
      }
    });

    document.getElementById('btn-open-lightcraft').addEventListener('click', () => {
      const shot = state.capturedShots[state.currentShotIndex];
      if (!shot) return;
      triggerHaptic('tick');
      const base64 = dataUrlToBase64(shot.framedDataUrl);
      if (window.LensCraftAndroid && typeof window.LensCraftAndroid.openInLightCraft === 'function') {
        window.LensCraftAndroid.openInLightCraft(base64, shot.meta.fileName, 'image/jpeg');
      }
    });

    window.addEventListener('lenscraft:hardware-shutter', () => {
      const modalOpen = document.getElementById('gallery-modal').classList.contains('open');
      if (!modalOpen) capturePhoto();
    });

    window.addEventListener('lenscraft:permission-granted', () => {
      startCamera();
    });

    window.addEventListener('deviceorientation', (e) => {
      if (!state.showLevel || e.gamma === null) return;
      const roll = Math.max(-45, Math.min(45, e.gamma || 0));
      horizonLevel.style.transform = 'translate(-50%, -50%) rotate(' + (-roll).toFixed(1) + 'deg)';
      horizonLevel.classList.toggle('level-locked', Math.abs(roll) < 1.8);
    });

    window.addEventListener('resize', updateAspectCropBox);
  }

  renderFilmCards();
  syncCharacterSliders();
  bindEvents();
  initHardwareInfo();
  updateAspectCropBox();
  startCamera();
  requestAnimationFrame(renderViewfinderLoop);
})();
`;

fs.writeFileSync(path.join(distDir, 'styles.css'), stylesCss, 'utf8');
fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml, 'utf8');
fs.writeFileSync(path.join(distDir, 'app.js'), appJs, 'utf8');

console.log('✅ Built LensCraft v1.3 Dual-Engine (60FPS Preview + Ultra-HD Still Capture) into dist/');
