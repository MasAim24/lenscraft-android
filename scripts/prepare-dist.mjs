import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');
fs.mkdirSync(distDir, { recursive: true });

// ---------------------------------------------------------------------------
// 1. styles.css — Scalable Token System (60-30-10 Hierarchy & Optical Balance)
// ---------------------------------------------------------------------------
const stylesCss = `/* LensCraft Pro Camera — Semantic Design Tokens & 60-30-10 Hierarchy */
:root {
  color-scheme: dark;

  /* Primitive Scale — Obsidian & Titanium (60% Dominant Neutral Canvas) */
  --obsidian-950: #07080a;
  --obsidian-900: #0c0e12;
  --obsidian-850: #12151b;
  --obsidian-800: #181c24;
  --obsidian-700: #232936;
  --obsidian-600: #323a4b;

  /* Primitive Scale — Tungsten & Silver (30% Secondary Structure) */
  --silver-100: #f4f6f8;
  --silver-200: #dfe4ec;
  --silver-400: #9aa4b5;
  --silver-500: #6c7689;

  /* Primitive Scale — Leica Gold & Shutter Crimson (10% Intentional Accent) */
  --amber-400: #fbbf24;
  --amber-500: #f59e0b;
  --amber-600: #d97706;
  --crimson-500: #ef4444;
  --emerald-400: #34d399;
  --emerald-500: #10b981;

  /* Semantic Tokens */
  --bg-surface: var(--obsidian-950);
  --bg-elevated: var(--obsidian-900);
  --bg-panel: rgba(18, 21, 27, 0.88);
  --bg-pill: rgba(24, 28, 36, 0.86);
  --text-primary: var(--silver-100);
  --text-secondary: var(--silver-400);
  --text-muted: var(--silver-500);
  --border-subtle: rgba(255, 255, 255, 0.09);
  --border-active: rgba(251, 191, 36, 0.55);
  --brand-primary: var(--amber-400);
  --brand-primary-strong: var(--amber-500);
  --status-shutter: var(--crimson-500);
  --status-focus: var(--emerald-400);

  /* Safe Area & Layout */
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
  min-height: 54px;
  gap: 8px;
}

.brand-cluster {
  display: flex;
  align-items: center;
  gap: 8px;
}

.leica-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--status-shutter);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.65);
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
  background: rgba(251, 191, 36, 0.15);
  color: var(--brand-primary);
  border: 1px solid var(--border-active);
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
  height: 32px;
  padding: 0 10px;
  border-radius: 6px;
  background: var(--obsidian-800);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.hud-btn.active {
  background: rgba(251, 191, 36, 0.16);
  color: var(--brand-primary);
  border-color: var(--border-active);
}

.hud-btn:active {
  transform: scale(0.95);
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
}

.viewfinder-frame {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: aspect-ratio 0.22s ease;
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
  box-shadow: 0 0 0 9999px rgba(4, 5, 7, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.24);
  transition: width 0.2s ease, height 0.2s ease;
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
}
.horizon-level.hidden {
  display: none;
}
.horizon-wing {
  width: 42px;
  height: 2px;
  background: rgba(255, 255, 255, 0.65);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  transition: background 0.15s ease;
}
.horizon-center-ring {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.65);
}
.horizon-level.level-locked .horizon-wing {
  background: var(--status-focus);
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.8);
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
  background: rgba(10, 12, 16, 0.78);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 6px 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.45;
  color: var(--text-primary);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
}

.exif-live-pill .sub {
  color: var(--text-secondary);
  font-size: 10px;
}

.histogram-box {
  background: rgba(10, 12, 16, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 5px 6px 3px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
}
.histogram-box.hidden {
  display: none;
}

#histogram-canvas {
  width: 108px;
  height: 44px;
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
  width: 68px;
  height: 68px;
  border: 1.5px solid var(--brand-primary);
  border-radius: 4px;
  transform: translate(-50%, -50%) scale(1);
  pointer-events: none;
  z-index: 15;
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.18s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.15s ease;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.35);
}
.focus-reticle.active {
  opacity: 1;
}
.focus-reticle.locked {
  border-color: var(--status-focus);
  box-shadow: 0 0 12px rgba(52, 211, 153, 0.45);
}
.focus-reticle::before,
.focus-reticle::after {
  content: '';
  position: absolute;
  background: currentColor;
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
  background: rgba(7, 8, 10, 0.85);
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
  transition: opacity 0.08s ease;
}
.shutter-curtain.fired {
  opacity: 0.92;
}

/* Multi-Lens Floating Pill Inside Bottom of Viewfinder */
.lens-bar-wrap {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-pill);
  backdrop-filter: blur(12px);
  padding: 5px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  z-index: 16;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.55);
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
  transition: all 0.15s ease;
}

.lens-btn.active {
  background: var(--brand-primary);
  color: var(--obsidian-950);
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
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

/* Sub-panel drawer (Film Simulation / Manual Sliders / Frame Style) */
.drawer-panel {
  padding: 10px 14px;
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
  transition: all 0.15s ease;
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

/* Character Sliders inside Film Drawer */
.character-sliders {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding-top: 4px;
}
.mini-slider-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
  background: var(--obsidian-800);
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid var(--border-subtle);
}
.mini-slider-header {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10px;
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
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--brand-primary);
  cursor: pointer;
  border: 2px solid var(--obsidian-950);
}

/* Tactile Manual Dial Strip (ISO, SHUTTER, EV, WB, FOCUS, FILM) */
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
  transition: all 0.15s ease;
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

/* Discrete Value Selector Bar when a Manual Dial is active */
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
  padding: 12px 22px 14px;
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
  width: 50px;
  height: 50px;
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
  background: rgba(7, 8, 10, 0.85);
  color: var(--brand-primary);
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 800;
  padding: 1px 4px;
  border-radius: 4px;
}

.round-action-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--obsidian-800);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.round-action-btn:active {
  transform: scale(0.92);
}
.round-action-btn.active {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  background: rgba(251, 191, 36, 0.14);
}

/* Optical Overshoot Mechanical Shutter Button */
.shutter-outer {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  padding: 5px;
  background: transparent;
  border: 3px solid var(--silver-200);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s ease, border-color 0.15s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}
.shutter-outer:active {
  transform: scale(0.93);
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
  position: relative;
}
.shutter-inner::after {
  content: '';
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--status-shutter);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4);
}

/* ---------------- FILM ROLL & LIGHTBOX MODAL ---------------- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(7, 8, 10, 0.96);
  backdrop-filter: blur(14px);
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
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.75);
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

/* Toast Banner */
.toast-banner {
  position: fixed;
  top: calc(var(--top-safe) + 64px);
  left: 50%;
  transform: translateX(-50%) translateY(-16px);
  background: rgba(12, 14, 18, 0.94);
  border: 1px solid var(--border-active);
  color: var(--text-primary);
  padding: 9px 14px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  z-index: 90;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.65);
  white-space: nowrap;
}
.toast-banner.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
`;

// ---------------------------------------------------------------------------
// 2. index.html — Semantic Pro Camera Layout
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
        <span class="leica-dot" title="LensCraft Optical Engine"></span>
        <span class="brand-title">LENSCRAFT</span>
        <span id="active-film-badge" class="film-badge-top">CHR • CHROME</span>
      </div>

      <div class="hud-toggles">
        <button id="btn-aspect" class="hud-btn" title="Aspect Ratio">4:3</button>
        <button id="btn-grid" class="hud-btn active" title="Framing Grid">GRID</button>
        <button id="btn-hist" class="hud-btn active" title="Live RGB Histogram">HIST</button>
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
          <div id="hud-device-line" class="sub">OPTICAL SENSOR READY</div>
        </div>

        <div id="histogram-box" class="histogram-box">
          <canvas id="histogram-canvas" width="108" height="44"></canvas>
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
            <div class="mini-slider-header"><span>GRAIN</span><span id="val-grain">25%</span></div>
            <input id="slider-grain" type="range" class="pro-range" min="0" max="100" value="25" />
          </div>
          <div class="mini-slider-group">
            <div class="mini-slider-header"><span>HALATION</span><span id="val-halation">30%</span></div>
            <input id="slider-halation" type="range" class="pro-range" min="0" max="100" value="30" />
          </div>
          <div class="mini-slider-group">
            <div class="mini-slider-header"><span>VIGNETTE</span><span id="val-vignette">20%</span></div>
            <input id="slider-vignette" type="range" class="pro-range" min="0" max="100" value="20" />
          </div>
        </div>
      </div>

      <!-- Discrete Value Wheel for Manual Dials (ISO / SHUTTER / EV / WB / FOCUS) -->
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
// 3. app.js — Film Simulation Engine, Manual Camera Controller, & Native Bridge
// ---------------------------------------------------------------------------
const appJs = `(() => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. FILM SIMULATION RECIPES (8 Iconic Stocks)
  // -------------------------------------------------------------------------
  const FILM_RECIPES = [
    {
      id: 'CHR',
      name: 'Classic Chrome',
      desc: 'Muted shadows • Documentary cyan skies',
      contrast: 1.16,
      saturation: 0.82,
      warmth: 6,
      tint: -3,
      shadowLift: 8,
      highlightRoll: 0.90,
      bw: false,
      redFilter: false,
      defaultGrain: 25,
      defaultHalation: 20,
      defaultVignette: 22
    },
    {
      id: 'POR',
      name: 'Kodak Portra 400',
      desc: 'Golden skin tones • Creamy highlights',
      contrast: 1.06,
      saturation: 1.08,
      warmth: 16,
      tint: 4,
      shadowLift: 14,
      highlightRoll: 0.92,
      bw: false,
      redFilter: false,
      defaultGrain: 22,
      defaultHalation: 18,
      defaultVignette: 18
    },
    {
      id: '800T',
      name: 'CineStill 800T',
      desc: 'Tungsten night • Red halation glow',
      contrast: 1.18,
      saturation: 1.05,
      warmth: -14,
      tint: 6,
      shadowLift: 6,
      highlightRoll: 0.88,
      bw: false,
      redFilter: false,
      defaultGrain: 35,
      defaultHalation: 65,
      defaultVignette: 28
    },
    {
      id: 'VEL',
      name: 'Fujichrome Velvia 50',
      desc: 'Vivid landscape • Deep micro-contrast',
      contrast: 1.24,
      saturation: 1.38,
      warmth: 5,
      tint: 2,
      shadowLift: -4,
      highlightRoll: 0.95,
      bw: false,
      redFilter: false,
      defaultGrain: 12,
      defaultHalation: 10,
      defaultVignette: 24
    },
    {
      id: 'ACR',
      name: 'Neopan Acros 100',
      desc: 'Fine silver B&W • Rich tonal curve',
      contrast: 1.26,
      saturation: 0.0,
      warmth: 0,
      tint: 0,
      shadowLift: 4,
      highlightRoll: 0.92,
      bw: true,
      redFilter: false,
      defaultGrain: 32,
      defaultHalation: 15,
      defaultVignette: 26
    },
    {
      id: 'MCR',
      name: 'Leica Monochrom Red',
      desc: 'High-contrast B&W • Dramatic skies',
      contrast: 1.38,
      saturation: 0.0,
      warmth: 0,
      tint: 0,
      shadowLift: -6,
      highlightRoll: 0.89,
      bw: true,
      redFilter: true,
      defaultGrain: 38,
      defaultHalation: 12,
      defaultVignette: 32
    },
    {
      id: 'AST',
      name: 'Astia 100F Soft',
      desc: 'Gentle portrait • Silky pastel tones',
      contrast: 0.98,
      saturation: 1.04,
      warmth: 8,
      tint: 3,
      shadowLift: 16,
      highlightRoll: 0.90,
      bw: false,
      redFilter: false,
      defaultGrain: 15,
      defaultHalation: 20,
      defaultVignette: 14
    },
    {
      id: 'STD',
      name: 'Provia Standard',
      desc: 'True optical neutral • Clean color',
      contrast: 1.04,
      saturation: 1.0,
      warmth: 0,
      tint: 0,
      shadowLift: 0,
      highlightRoll: 0.96,
      bw: false,
      redFilter: false,
      defaultGrain: 10,
      defaultHalation: 0,
      defaultVignette: 10
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

  // -------------------------------------------------------------------------
  // 2. APPLICATION STATE
  // -------------------------------------------------------------------------
  const state = {
    film: FILM_RECIPES[0],
    grain: 25,
    halation: 20,
    vignette: 22,
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
    gridMode: 1, // 0: off, 1: thirds, 2: golden
    showHistogram: true,
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
    labImage: null, // Optional static image for Film Lab testing
    capturedShots: [], // Array of { rawCanvas, framedDataUrl, meta, palette }
    currentShotIndex: 0,
    rollAngle: 0
  };

  // -------------------------------------------------------------------------
  // 3. DOM ELEMENTS
  // -------------------------------------------------------------------------
  const videoEl = document.getElementById('live-video');
  const vfCanvas = document.getElementById('viewfinder-canvas');
  const vfCtx = vfCanvas.getContext('2d', { willReadFrequently: true });
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

  // Offscreen work canvas for fast 60fps shader & histogram processing
  const workCanvas = document.createElement('canvas');
  const workCtx = workCanvas.getContext('2d', { willReadFrequently: true });

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
        navigator.vibrate(type === 'shutter' ? [18, 30, 12] : 10);
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
      // Curtain 1 click
      const bufferSize = audioCtx.sampleRate * 0.045;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.008));
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1850, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      whiteNoise.start(now);

      // Curtain 2 mechanical rebound
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now + 0.032);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.065);
      oscGain.gain.setValueAtTime(0.22, now + 0.032);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.068);
      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      osc.start(now + 0.032);
      osc.stop(now + 0.07);
    } catch (_) {}
  }

  let toastTimer = null;
  function showToast(msg) {
    toastBanner.textContent = msg;
    toastBanner.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastBanner.classList.remove('visible');
    }, 2400);
  }

  // -------------------------------------------------------------------------
  // 5. QUERY HARDWARE SPECS FROM NATIVE ANDROID BRIDGE
  // -------------------------------------------------------------------------
  function initHardwareInfo() {
    try {
      if (window.LensCraftAndroid && typeof window.LensCraftAndroid.getDeviceCameraSpecs === 'function') {
        const raw = window.LensCraftAndroid.getDeviceCameraSpecs();
        if (raw) {
          const info = JSON.parse(raw);
          if (info.model) {
            state.deviceModel = info.model.toUpperCase();
          }
          if (info.aperture) {
            state.aperture = 'f/' + info.aperture;
          }
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
    document.getElementById('hud-device-line').textContent =
      state.deviceModel + ' • ' + state.film.name.toUpperCase();
    document.getElementById('active-film-badge').textContent =
      state.film.id + ' • ' + state.film.name.split(' ').pop().toUpperCase();
  }

  // -------------------------------------------------------------------------
  // 6. CAMERA STREAM INITIALIZATION & HARDWARE CONSTRAINTS
  // -------------------------------------------------------------------------
  async function startCamera() {
    try {
      if (state.stream) {
        state.stream.getTracks().forEach((t) => t.stop());
      }
      const constraints = {
        audio: false,
        video: {
          facingMode: { ideal: state.facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1440 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      state.stream = stream;
      state.videoTrack = stream.getVideoTracks()[0] || null;
      state.labImage = null;
      videoEl.srcObject = stream;
      await videoEl.play().catch(() => {});
      applyHardwareTrackConstraints();
      updateTelemetryLabels();
    } catch (err) {
      console.warn('Camera stream fallback:', err);
      showToast('📷 Mode Simulasi Sensor Aktif (Atau pilih foto lewat 🖼️ LAB)');
      createProceduralTestScene();
    }
  }

  // Procedural fallback scene so the viewfinder & shaders work even in emulators without a camera
  function createProceduralTestScene() {
    const c = document.createElement('canvas');
    c.width = 960;
    c.height = 720;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 720);
    grad.addColorStop(0, '#1a2a44');
    grad.addColorStop(0.52, '#d97742');
    grad.addColorStop(0.55, '#182026');
    grad.addColorStop(1, '#090b0e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 960, 720);

    // Sun & city silhouette for testing halation, film simulation, and histogram
    ctx.fillStyle = '#fff5d6';
    ctx.beginPath();
    ctx.arc(640, 260, 58, 0, Math.PI * 2);
    ctx.fill();

    // Color checker swatches at bottom
    const swatches = ['#b8332a', '#d9822b', '#e6c229', '#2b8a3e', '#1971c2', '#6741d9'];
    swatches.forEach((hex, idx) => {
      ctx.fillStyle = hex;
      ctx.fillRect(180 + idx * 100, 520, 84, 84);
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
  // 7. REAL-TIME FILM SIMULATION & OPTICAL PIXEL ENGINE
  // -------------------------------------------------------------------------
  function computeExposureGain() {
    let evStops = parseFloat(state.ev) || 0;
    if (state.iso !== 'AUTO') {
      const isoNum = parseInt(state.iso, 10) || 200;
      evStops += Math.log2(isoNum / 200) * 0.45;
    }
    if (state.shutter !== 'AUTO') {
      const parts = state.shutter.split('/');
      const sec = parts.length === 2 ? parseFloat(parts[0]) / parseFloat(parts[1]) : parseFloat(state.shutter);
      evStops += Math.log2(sec / (1 / 250)) * 0.45;
    }
    return Math.pow(2, Math.max(-3.0, Math.min(3.0, evStops)));
  }

  function computeWbShift() {
    if (state.wb === 'AUTO') return { rShift: 0, bShift: 0 };
    const kelvin = parseInt(state.wb, 10) || 5400;
    // Relative to 5400K daylight
    const delta = (kelvin - 5400) / 100;
    return {
      rShift: delta * 1.15,
      bShift: -delta * 1.15
    };
  }

  function processFramePixels(ctx, width, height, includeHudOverlays = false) {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const recipe = state.film;
    const gain = computeExposureGain();
    const { rShift, bShift } = computeWbShift();

    const contrast = recipe.contrast;
    const sat = recipe.saturation;
    const warmth = recipe.warmth + rShift;
    const tint = recipe.tint;
    const blueOffset = -recipe.warmth * 0.8 + bShift;
    const shadowLift = recipe.shadowLift;
    const highlightRoll = recipe.highlightRoll;

    const grainStrength = (state.grain / 100) * 34;
    const halationStrength = state.halation / 100;
    const vigStrength = (state.vignette / 100) * 0.68;

    const cx = width * 0.5;
    const cy = height * 0.5;
    const invMaxDistSq = 1 / (cx * cx + cy * cy);

    const histR = new Uint32Array(64);
    const histG = new Uint32Array(64);
    const histB = new Uint32Array(64);
    const histL = new Uint32Array(64);

    const doZebra = includeHudOverlays && state.showZebra;
    const doPeaking = includeHudOverlays && state.showPeaking;
    const timeStripe = Math.floor(performance.now() / 60);

    for (let y = 0; y < height; y++) {
      const dy = y - cy;
      const dySq = dy * dy;
      const rowOffset = y * width;

      for (let x = 0; x < width; x++) {
        const idx = (rowOffset + x) * 4;
        let r = data[idx] * gain;
        let g = data[idx + 1] * gain;
        let b = data[idx + 2] * gain;

        // 1. White Balance & Recipe Color Matrix
        r += warmth;
        g += tint;
        b += blueOffset;

        // 2. Contrast & Shadow Lift + Highlight Roll-off
        r = ((r - 128) * contrast + 128) + shadowLift;
        g = ((g - 128) * contrast + 128) + shadowLift;
        b = ((b - 128) * contrast + 128) + shadowLift;

        if (r > 210) r = 210 + (r - 210) * highlightRoll;
        if (g > 210) g = 210 + (g - 210) * highlightRoll;
        if (b > 210) b = 210 + (b - 210) * highlightRoll;

        // 3. Monochrome / Red Filter or Saturation
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        if (recipe.bw) {
          const mono = recipe.redFilter ? (0.58 * r + 0.34 * g + 0.08 * b) : luma;
          r = g = b = mono;
        } else if (sat !== 1.0) {
          r = luma + (r - luma) * sat;
          g = luma + (g - luma) * sat;
          b = luma + (b - luma) * sat;
        }

        // 4. CineStill / Optical Highlight Halation (Warm Red-Orange Bloom on High Luma)
        if (halationStrength > 0 && luma > 205) {
          const halo = (luma - 205) * halationStrength * 0.95;
          r += halo * 1.35;
          g += halo * 0.38;
        }

        // 5. Optical Lens Vignette
        if (vigStrength > 0) {
          const dx = x - cx;
          const distNorm = (dx * dx + dySq) * invMaxDistSq;
          const vigFactor = Math.max(0.18, 1 - distNorm * vigStrength);
          r *= vigFactor;
          g *= vigFactor;
          b *= vigFactor;
        }

        // 6. Organic Film Grain
        if (grainStrength > 0) {
          const noise = ((Math.random() - 0.5) * grainStrength);
          r += noise;
          g += noise;
          b += noise;
        }

        // Clamp
        r = r < 0 ? 0 : r > 255 ? 255 : r;
        g = g < 0 ? 0 : g > 255 ? 255 : g;
        b = b < 0 ? 0 : b > 255 ? 255 : b;

        const finalLuma = 0.299 * r + 0.587 * g + 0.114 * b;

        // Sample every 2nd pixel for 60fps RGB Histogram
        if (includeHudOverlays && ((x + y) & 1) === 0) {
          histR[r >> 2]++;
          histG[g >> 2]++;
          histB[b >> 2]++;
          histL[finalLuma >> 2]++;
        }

        // 7. Live Viewfinder Overlays (Zebra Clipping & Focus Peaking)
        if (doZebra && finalLuma >= 242) {
          if (((x + y + timeStripe) & 7) < 3) {
            r = 255;
            g = 40;
            b = 40;
          }
        } else if (doPeaking && x > 1 && x < width - 1) {
          const prevIdx = idx - 4;
          const edge = Math.abs(finalLuma - data[prevIdx]);
          if (edge > 28) {
            r = 16;
            g = 245;
            b = 150;
          }
        }

        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    if (includeHudOverlays && state.showHistogram) {
      drawHistogram(histR, histG, histB, histL);
    }
  }

  function drawHistogram(histR, histG, histB, histL) {
    const w = histCanvas.width;
    const h = histCanvas.height;
    histCtx.clearRect(0, 0, w, h);

    let maxVal = 1;
    for (let i = 2; i < 62; i++) {
      if (histL[i] > maxVal) maxVal = histL[i];
    }

    const drawChannel = (bins, stroke, fill) => {
      histCtx.beginPath();
      histCtx.moveTo(0, h);
      for (let i = 0; i < 64; i++) {
        const x = (i / 63) * w;
        const norm = Math.min(1, bins[i] / maxVal);
        const y = h - norm * (h - 4);
        histCtx.lineTo(x, y);
      }
      histCtx.lineTo(w, h);
      histCtx.closePath();
      histCtx.fillStyle = fill;
      histCtx.fill();
      histCtx.strokeStyle = stroke;
      histCtx.lineWidth = 1;
      histCtx.stroke();
    };

    drawChannel(histR, 'rgba(239,68,68,0.85)', 'rgba(239,68,68,0.22)');
    drawChannel(histG, 'rgba(52,211,153,0.85)', 'rgba(52,211,153,0.20)');
    drawChannel(histB, 'rgba(96,165,250,0.85)', 'rgba(96,165,250,0.22)');
    drawChannel(histL, 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0.14)');
  }

  // -------------------------------------------------------------------------
  // 8. VIEWFINDER RENDER LOOP (60 FPS)
  // -------------------------------------------------------------------------
  function renderViewfinderLoop() {
    const source = state.labImage || (videoEl.readyState >= 2 ? videoEl : null);
    if (source) {
      const srcW = state.labImage ? state.labImage.width : (videoEl.videoWidth || 640);
      const srcH = state.labImage ? state.labImage.height : (videoEl.videoHeight || 480);

      if (srcW > 0 && srcH > 0) {
        const targetW = 480;
        const targetH = Math.round((srcH / srcW) * targetW);
        if (workCanvas.width !== targetW || workCanvas.height !== targetH) {
          workCanvas.width = targetW;
          workCanvas.height = targetH;
          vfCanvas.width = targetW;
          vfCanvas.height = targetH;
        }

        // Apply digital zoom crop smoothly if zoom > 1
        const z = Math.max(1.0, state.zoom);
        const cropW = srcW / z;
        const cropH = srcH / z;
        const cropX = (srcW - cropW) * 0.5;
        const cropY = (srcH - cropH) * 0.5;

        workCtx.save();
        if (state.facingMode === 'user' && !state.labImage) {
          workCtx.translate(targetW, 0);
          workCtx.scale(-1, 1);
        }
        workCtx.drawImage(source, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);
        workCtx.restore();

        processFramePixels(workCtx, targetW, targetH, true);
        vfCtx.drawImage(workCanvas, 0, 0);
      }
    }
    requestAnimationFrame(renderViewfinderLoop);
  }

  // -------------------------------------------------------------------------
  // 9. HIGH-RESOLUTION CAPTURE & LEICA EXIF FRAME GENERATOR
  // -------------------------------------------------------------------------
  function extractDominantPalette(canvas) {
    const sample = document.createElement('canvas');
    sample.width = 24;
    sample.height = 24;
    const sctx = sample.getContext('2d');
    sctx.drawImage(canvas, 0, 0, 24, 24);
    const data = sctx.getImageData(0, 0, 24, 24).data;
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

  function renderExifFramedImage(rawCanvas, meta, palette, frameStyle) {
    if (frameStyle === 'none') {
      return rawCanvas.toDataURL('image/jpeg', 0.95);
    }

    const out = document.createElement('canvas');
    const ctx = out.getContext('2d');
    const w = rawCanvas.width;
    const h = rawCanvas.height;

    if (frameStyle === 'cinema-stamp') {
      out.width = w;
      out.height = h;
      ctx.drawImage(rawCanvas, 0, 0);

      // Classic 90s quartz date + recipe stamp in bottom-right
      const fontSize = Math.max(18, Math.round(w * 0.026));
      ctx.font = '700 ' + fontSize + 'px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      const stampText = meta.dateShort + '  •  ' + meta.filmCode + ' ' + meta.focalMm + 'MM';
      ctx.shadowColor = 'rgba(239, 68, 68, 0.85)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#ff9233';
      ctx.fillText(stampText, w - Math.round(w * 0.035), h - Math.round(h * 0.035));
      return out.toDataURL('image/jpeg', 0.95);
    }

    // Leica White or Darkroom Black Gallery Border
    const isDark = frameStyle === 'darkroom-black';
    const padSide = Math.round(w * 0.042);
    const padTop = Math.round(w * 0.042);
    const footerH = Math.round(Math.max(130, w * 0.145));

    out.width = w + padSide * 2;
    out.height = h + padTop + footerH;

    ctx.fillStyle = isDark ? '#0b0d11' : '#fbfaf7';
    ctx.fillRect(0, 0, out.width, out.height);

    // Subtle inner shadow border around photo
    ctx.drawImage(rawCanvas, padSide, padTop);
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(padSide, padTop, w, h);

    const footerCenterY = padTop + h + footerH * 0.52;
    const leftX = padSide;
    const rightX = out.width - padSide;

    // Red Leica Dot
    const dotRadius = Math.max(10, Math.round(w * 0.013));
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(leftX + dotRadius, footerCenterY - footerH * 0.12, dotRadius, 0, Math.PI * 2);
    ctx.fill();

    // Camera / Device Name
    const titleSize = Math.max(18, Math.round(w * 0.025));
    const subSize = Math.max(13, Math.round(w * 0.017));
    ctx.textAlign = 'left';
    ctx.fillStyle = isDark ? '#f4f6f8' : '#111318';
    ctx.font = '800 ' + titleSize + 'px "Inter", sans-serif';
    ctx.fillText(meta.deviceModel, leftX + dotRadius * 2.8, footerCenterY - footerH * 0.06);

    ctx.fillStyle = isDark ? '#9aa4b5' : '#646d7d';
    ctx.font = '600 ' + subSize + 'px "JetBrains Mono", monospace';
    ctx.fillText(
      'FILM: ' + meta.filmName.toUpperCase() + ' (' + meta.filmCode + ')',
      leftX + dotRadius * 2.8,
      footerCenterY + footerH * 0.18
    );

    // 5-Color Dominant Palette Swatches in Center-Right
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

    // Right Technical EXIF Specs
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

    return out.toDataURL('image/jpeg', 0.95);
  }

  async function capturePhoto() {
    triggerHaptic('shutter');
    playMechanicalShutterSound();

    // Shutter curtain visual blink
    shutterCurtain.classList.add('fired');
    setTimeout(() => shutterCurtain.classList.remove('fired'), 110);

    const source = state.labImage || (videoEl.readyState >= 2 ? videoEl : null);
    if (!source) {
      showToast('⚠️ Sensor belum siap');
      return;
    }

    const srcW = state.labImage ? state.labImage.width : (videoEl.videoWidth || 1280);
    const srcH = state.labImage ? state.labImage.height : (videoEl.videoHeight || 960);

    // Compute aspect ratio + zoom crop on full native source resolution
    const z = Math.max(1.0, state.zoom);
    let zoomedW = srcW / z;
    let zoomedH = srcH / z;

    const targetAspect = ASPECT_RATIOS[state.aspectIndex].ratio;
    const currentAspect = zoomedW / zoomedH;
    // In portrait orientation, invert aspect if video stream is portrait
    const effectiveAspect = srcH > srcW ? (1 / targetAspect) : targetAspect;

    let cropW = zoomedW;
    let cropH = zoomedH;
    if (currentAspect > effectiveAspect) {
      cropW = zoomedH * effectiveAspect;
    } else {
      cropH = zoomedW / effectiveAspect;
    }

    const cropX = (srcW - cropW) * 0.5;
    const cropY = (srcH - cropH) * 0.5;

    const rawCanvas = document.createElement('canvas');
    rawCanvas.width = Math.round(cropW);
    rawCanvas.height = Math.round(cropH);
    const rCtx = rawCanvas.getContext('2d');

    rCtx.save();
    if (state.facingMode === 'user' && !state.labImage) {
      rCtx.translate(rawCanvas.width, 0);
      rCtx.scale(-1, 1);
    }
    rCtx.drawImage(source, cropX, cropY, cropW, cropH, 0, 0, rawCanvas.width, rawCanvas.height);
    rCtx.restore();

    // Apply full-res Film Simulation shader without HUD overlays
    processFramePixels(rCtx, rawCanvas.width, rawCanvas.height, false);

    const now = new Date();
    const pad2 = (n) => String(n).padStart(2, '0');
    const meta = {
      deviceModel: state.deviceModel,
      filmCode: state.film.id,
      filmName: state.film.name,
      focalMm: state.focalMm,
      aperture: state.aperture,
      shutter: state.shutter === 'AUTO' ? '1/250s' : state.shutter + 's',
      iso: state.iso === 'AUTO' ? '200' : state.iso,
      timestamp:
        now.getFullYear() + '.' + pad2(now.getMonth() + 1) + '.' + pad2(now.getDate()) +
        '  ' + pad2(now.getHours()) + ':' + pad2(now.getMinutes()) + ':' + pad2(now.getSeconds()),
      dateShort:
        "'" + String(now.getFullYear()).slice(-2) + ' ' + pad2(now.getMonth() + 1) + ' ' + pad2(now.getDate()),
      fileName:
        'LensCraft_' + state.film.id + '_' +
        now.getFullYear() + pad2(now.getMonth() + 1) + pad2(now.getDate()) + '_' +
        pad2(now.getHours()) + pad2(now.getMinutes()) + pad2(now.getSeconds()) + '.jpg'
    };

    const palette = extractDominantPalette(rawCanvas);
    const activeStyle = state.exifFrameEnabled ? state.selectedFrameStyle : 'none';
    const framedDataUrl = renderExifFramedImage(rawCanvas, meta, palette, activeStyle);

    const shot = { rawCanvas, framedDataUrl, meta, palette };
    state.capturedShots.unshift(shot);
    state.currentShotIndex = 0;

    // Update Thumbnail Well
    const thumbImg = document.getElementById('thumb-preview');
    thumbImg.src = framedDataUrl;
    thumbImg.style.display = 'block';
    document.getElementById('thumb-empty-icon').style.display = 'none';
    document.getElementById('thumb-count').textContent = String(state.capturedShots.length);

    // Auto-Save directly to Android DCIM/LensCraft Gallery!
    saveDataUrlToGallery(framedDataUrl, meta.fileName, true);
  }

  function dataUrlToBase64(dataUrl) {
    const idx = dataUrl.indexOf(',');
    return idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
  }

  function saveDataUrlToGallery(dataUrl, fileName, isAutoCapture = false) {
    const base64 = dataUrlToBase64(dataUrl);
    if (window.LensCraftAndroid && typeof window.LensCraftAndroid.savePhotoToGallery === 'function') {
      const savedPath = window.LensCraftAndroid.savePhotoToGallery(base64, fileName, 'image/jpeg');
      if (savedPath) {
        showToast('📸 Tersimpan di Galeri: ' + savedPath);
        return;
      }
    }
    if (!isAutoCapture) {
      // Browser fallback download
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('💾 Foto diunduh: ' + fileName);
    } else {
      showToast('📸 Jepretan tersimpan di Film Roll (' + state.film.id + ')');
    }
  }

  // -------------------------------------------------------------------------
  // 10. UI CONTROLS, DIALS & EVENT BINDINGS
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
        state.grain = r.defaultGrain;
        state.halation = r.defaultHalation;
        state.vignette = r.defaultVignette;
        syncCharacterSliders();
        document.getElementById('dial-val-film').textContent = r.id;
        renderFilmCards();
        updateTelemetryLabels();
        showToast('🎞️ Film Simulation: ' + r.name);
      });
      filmStripScroll.appendChild(card);
    });
  }

  function syncCharacterSliders() {
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
    // Respect portrait viewfinder orientation except for panoramic XPAN
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
      showToast('🎞️ Belum ada foto di Film Roll — tekan tombol Shutter dulu!');
      return;
    }
    triggerHaptic('tick');
    refreshModalView();
    document.getElementById('gallery-modal').classList.add('open');
  }

  function refreshModalView() {
    const shot = state.capturedShots[state.currentShotIndex];
    if (!shot) return;
    shot.framedDataUrl = renderExifFramedImage(
      shot.rawCanvas,
      shot.meta,
      shot.palette,
      state.selectedFrameStyle
    );
    document.getElementById('preview-rendered-img').src = shot.framedDataUrl;
    document.getElementById('shot-counter-label').textContent =
      (state.currentShotIndex + 1) + ' / ' + state.capturedShots.length;
  }

  function bindEvents() {
    // Manual Dial Pills
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

    // Character Sliders
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

    // Multi-Lens Zoom Buttons
    document.querySelectorAll('.lens-btn[data-zoom]').forEach((btn) => {
      btn.addEventListener('click', () => {
        triggerHaptic('tick');
        document.querySelectorAll('.lens-btn[data-zoom]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.zoom = parseFloat(btn.getAttribute('data-zoom')) || 1.0;
        state.focalMm = parseInt(btn.getAttribute('data-mm'), 10) || 24;
        applyHardwareTrackConstraints();
        updateTelemetryLabels();
        showToast('🔭 Lensa ' + state.focalMm + 'mm (' + state.zoom + 'x)');
      });
    });

    // Import Photo to Film Lab
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
          showToast('🖼️ Foto dimuat ke Film Lab — pilih resep Film & tekan Shutter!');
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    // Top HUD Toggles
    document.getElementById('btn-aspect').addEventListener('click', () => {
      triggerHaptic('tick');
      state.aspectIndex = (state.aspectIndex + 1) % ASPECT_RATIOS.length;
      updateAspectCropBox();
      showToast('📐 Rasio Frame: ' + ASPECT_RATIOS[state.aspectIndex].label);
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
      showToast(state.showZebra ? '🦓 Overexposure Zebra: ON' : '🦓 Overexposure Zebra: OFF');
    });

    document.getElementById('btn-peaking').addEventListener('click', (e) => {
      triggerHaptic('tick');
      state.showPeaking = !state.showPeaking;
      e.currentTarget.classList.toggle('active', state.showPeaking);
      showToast(state.showPeaking ? '🟢 Focus Peaking: ON' : '🟢 Focus Peaking: OFF');
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
      showToast(state.exifFrameEnabled ? '🖼️ Bingkai EXIF Leica: AKTIF' : '🖼️ Bingkai EXIF: NONAKTIF');
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

    // Tap-to-Focus on Viewfinder
    const vfStage = document.getElementById('viewfinder-stage');
    vfStage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.lens-bar-wrap')) return;
      const rect = vfStage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      triggerHaptic('tick');
      focusReticle.style.left = x + 'px';
      focusReticle.style.top = y + 'px';
      focusReticle.classList.remove('locked');
      focusReticle.classList.add('active');
      focusReticleLabel.textContent = 'AF • SEEK';

      setTimeout(() => {
        focusReticle.classList.add('locked');
        focusReticleLabel.textContent = 'AF-S • LOCK';
        triggerHaptic('tick');
      }, 260);

      setTimeout(() => {
        focusReticle.classList.remove('active');
      }, 2200);
    });

    // Shutter & Dock Buttons
    document.getElementById('btn-shutter').addEventListener('click', capturePhoto);

    document.getElementById('btn-sound-toggle').addEventListener('click', (e) => {
      state.shutterSoundEnabled = !state.shutterSoundEnabled;
      e.currentTarget.classList.toggle('active', state.shutterSoundEnabled);
      e.currentTarget.textContent = state.shutterSoundEnabled ? '🔊' : '🔇';
      showToast(state.shutterSoundEnabled ? '🔊 Suara Shutter Mekanik: ON' : '🔇 Suara Shutter: MUTE');
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
      showToast('⚡ Semua Dial kembali ke Auto Exposure (AE)');
    });

    document.getElementById('btn-flip-cam').addEventListener('click', () => {
      triggerHaptic('tick');
      state.facingMode = state.facingMode === 'environment' ? 'user' : 'environment';
      startCamera();
      showToast(state.facingMode === 'user' ? '🤳 Kamera Depan' : '📷 Kamera Belakang Utama');
    });

    // Film Roll Modal Controls
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
      saveDataUrlToGallery(shot.framedDataUrl, shot.meta.fileName, false);
    });

    document.getElementById('btn-save-as').addEventListener('click', () => {
      const shot = state.capturedShots[state.currentShotIndex];
      if (!shot) return;
      triggerHaptic('tick');
      const base64 = dataUrlToBase64(shot.framedDataUrl);
      if (window.LensCraftAndroid && typeof window.LensCraftAndroid.saveWithSystemPicker === 'function') {
        window.LensCraftAndroid.saveWithSystemPicker(base64, shot.meta.fileName, 'image/jpeg');
      } else {
        saveDataUrlToGallery(shot.framedDataUrl, shot.meta.fileName, false);
      }
    });

    document.getElementById('btn-share-photo').addEventListener('click', () => {
      const shot = state.capturedShots[state.currentShotIndex];
      if (!shot) return;
      triggerHaptic('tick');
      const base64 = dataUrlToBase64(shot.framedDataUrl);
      if (window.LensCraftAndroid && typeof window.LensCraftAndroid.shareFile === 'function') {
        window.LensCraftAndroid.shareFile(base64, shot.meta.fileName, 'image/jpeg');
      } else {
        showToast('📤 Gunakan APK Android untuk membuka Share Sheet');
      }
    });

    document.getElementById('btn-open-lightcraft').addEventListener('click', () => {
      const shot = state.capturedShots[state.currentShotIndex];
      if (!shot) return;
      triggerHaptic('tick');
      const base64 = dataUrlToBase64(shot.framedDataUrl);
      if (window.LensCraftAndroid && typeof window.LensCraftAndroid.openInLightCraft === 'function') {
        window.LensCraftAndroid.openInLightCraft(base64, shot.meta.fileName, 'image/jpeg');
      } else {
        showToast('🎞️ Tersimpan di DCIM/LensCraft — siap di-import di LightCraft!');
      }
    });

    // Hardware Volume Key Shutter Event from MainActivity.java
    window.addEventListener('lenscraft:hardware-shutter', () => {
      const modalOpen = document.getElementById('gallery-modal').classList.contains('open');
      if (!modalOpen) {
        capturePhoto();
      }
    });

    // Re-init camera when Native Android OS Camera Permission is granted
    window.addEventListener('lenscraft:permission-granted', () => {
      startCamera();
    });

    // DeviceOrientation for 3D Electronic Horizon Level
    window.addEventListener('deviceorientation', (e) => {
      if (!state.showLevel || e.gamma === null) return;
      const roll = Math.max(-45, Math.min(45, e.gamma || 0));
      horizonLevel.style.transform = 'translate(-50%, -50%) rotate(' + (-roll).toFixed(1) + 'deg)';
      horizonLevel.classList.toggle('level-locked', Math.abs(roll) < 1.8);
    });

    window.addEventListener('resize', updateAspectCropBox);
  }

  // -------------------------------------------------------------------------
  // 11. BOOTSTRAP
  // -------------------------------------------------------------------------
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

console.log('✅ Built LensCraft Pro Camera web assets into dist/ (index.html, styles.css, app.js)');
