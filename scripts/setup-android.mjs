import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.join(process.cwd(), 'android/app/src/main/AndroidManifest.xml');
const mainActivityPath = path.join(
  process.cwd(),
  'android/app/src/main/java/com/storytold/lenscraft/MainActivity.java'
);

if (fs.existsSync(manifestPath)) {
  let xml = fs.readFileSync(manifestPath, 'utf8');

  // 1. Add Camera, Flash/Torch, Haptics, Audio & Media Storage permissions + LightCraft package visibility
  const permissionsBlock = `
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.FLASHLIGHT" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />

    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
    <uses-feature android:name="android.hardware.camera.flash" android:required="false" />

    <queries>
        <package android:name="com.storytold.lightcraft" />
    </queries>
`;
  if (!xml.includes('android.permission.CAMERA')) {
    xml = xml.replace('</manifest>', `${permissionsBlock}\n</manifest>`);
  }

  // 2. Enable largeHeap, hardwareAccelerated & requestLegacyExternalStorage on <application>
  if (!xml.includes('android:largeHeap="true"')) {
    xml = xml.replace(
      '<application',
      '<application\n        android:largeHeap="true"\n        android:hardwareAccelerated="true"\n        android:requestLegacyExternalStorage="true"'
    );
  }

  // 3. Ensure activity handles orientation changes smoothly
  if (!xml.includes('android:windowSoftInputMode')) {
    xml = xml.replace(
      'android:launchMode="singleTask"',
      'android:launchMode="singleTask"\n            android:windowSoftInputMode="adjustResize"'
    );
  }

  fs.writeFileSync(manifestPath, xml, 'utf8');
  console.log('✅ Configured AndroidManifest.xml (CAMERA, FLASHLIGHT, VIBRATE, MediaStore DCIM, LightCraft query)');
} else {
  console.warn('⚠️ AndroidManifest.xml not found, skipping manifest patch.');
}

// Configure custom Leica/Craft style launcher icon if drawable-v24 exists
const fgIconPath = path.join(process.cwd(), 'android/app/src/main/res/drawable-v24/ic_launcher_foreground.xml');
const bgValuePath = path.join(process.cwd(), 'android/app/src/main/res/values/ic_launcher_background.xml');
if (fs.existsSync(path.dirname(fgIconPath))) {
  const fgXml = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <!-- Outer Machined Lens Ring -->
    <path
        android:fillColor="#181C24"
        android:strokeColor="#FBBF24"
        android:strokeWidth="2.5"
        android:pathData="M54,24 A30,30 0 1,1 53.9,24 Z" />
    <!-- Inner Optical Glass Element -->
    <path
        android:fillColor="#0B0E14"
        android:strokeColor="#9AA4B5"
        android:strokeWidth="1.5"
        android:pathData="M54,33 A21,21 0 1,1 53.9,33 Z" />
    <!-- Aperture Center -->
    <path
        android:fillColor="#121824"
        android:strokeColor="#F59E0B"
        android:strokeWidth="1.2"
        android:pathData="M54,42 A12,12 0 1,1 53.9,42 Z" />
    <!-- Leica Red Dot Emblem -->
    <path
        android:fillColor="#EF4444"
        android:pathData="M75,30 A4.5,4.5 0 1,1 74.9,30 Z" />
    <!-- Lens Coating Glint -->
    <path
        android:fillColor="#34D399"
        android:fillAlpha="0.7"
        android:pathData="M47,46 A3.2,3.2 0 1,1 46.9,46 Z" />
</vector>
`;
  fs.writeFileSync(fgIconPath, fgXml, 'utf8');
  if (fs.existsSync(bgValuePath)) {
    const bgXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0A0C10</color>
</resources>
`;
    fs.writeFileSync(bgValuePath, bgXml, 'utf8');
  }
  console.log('✅ Configured custom LensCraft camera lens launcher icon');
}

// Generate MainActivity.java with Native Camera Permission Handling, Volume Shutter,
// DCIM MediaStore Auto-Save, Haptics, Hardware Camera2 Inspector, and LightCraft Bridge
if (fs.existsSync(path.dirname(mainActivityPath))) {
  const javaCode = `package com.storytold.lenscraft;

import android.Manifest;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraManager;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.HapticFeedbackConstants;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class MainActivity extends BridgeActivity {
    private static final int REQ_CREATE_DOCUMENT = 9501;
    private static final int REQ_CAMERA_PERMISSIONS = 9502;
    private byte[] pendingSaveBytes = null;
    private boolean volumeShutterEnabled = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        hideSystemBars();
        ensureCameraPermissions();

        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setAllowFileAccess(true);
                settings.setAllowContentAccess(true);
                settings.setMediaPlaybackRequiresUserGesture(false);
                webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
                webView.addJavascriptInterface(new LensCraftNativeBridge(), "LensCraftAndroid");
            }
        } catch (Exception ignored) {}
    }

    private void ensureCameraPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.CAMERA}, REQ_CAMERA_PERMISSIONS);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_CAMERA_PERMISSIONS) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                try {
                    WebView webView = getBridge().getWebView();
                    if (webView != null) {
                        webView.post(() -> webView.evaluateJavascript(
                            "window.dispatchEvent(new CustomEvent('lenscraft:permission-granted'))",
                            null
                        ));
                    }
                } catch (Exception ignored) {}
            }
        }
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        int keyCode = event.getKeyCode();
        if (volumeShutterEnabled && (
            keyCode == KeyEvent.KEYCODE_VOLUME_UP ||
            keyCode == KeyEvent.KEYCODE_VOLUME_DOWN ||
            keyCode == KeyEvent.KEYCODE_CAMERA
        )) {
            if (event.getAction() == KeyEvent.ACTION_DOWN && event.getRepeatCount() == 0) {
                try {
                    WebView webView = getBridge().getWebView();
                    if (webView != null) {
                        webView.evaluateJavascript(
                            "window.dispatchEvent(new CustomEvent('lenscraft:hardware-shutter', { detail: { keyCode: " + keyCode + " } }))",
                            null
                        );
                        return true;
                    }
                } catch (Exception ignored) {}
            }
            return true;
        }
        return super.dispatchKeyEvent(event);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemBars();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_CREATE_DOCUMENT) {
            final byte[] bytesToWrite = pendingSaveBytes;
            pendingSaveBytes = null;
            if (resultCode == Activity.RESULT_OK && data != null && data.getData() != null && bytesToWrite != null) {
                Uri uri = data.getData();
                try {
                    OutputStream os = getContentResolver().openOutputStream(uri);
                    if (os != null) {
                        os.write(bytesToWrite);
                        os.flush();
                        os.close();
                        Toast.makeText(this, "✅ Foto berhasil disimpan!", Toast.LENGTH_LONG).show();
                    }
                } catch (Exception e) {
                    Toast.makeText(this, "❌ Gagal menyimpan: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            }
        }
    }

    private void hideSystemBars() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                WindowInsetsController controller = getWindow().getInsetsController();
                if (controller != null) {
                    controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                    controller.setSystemBarsBehavior(
                        WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                    );
                }
            } else {
                View decorView = getWindow().getDecorView();
                decorView.setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                );
            }
        } catch (Exception ignored) {}
    }

    public class LensCraftNativeBridge {
        @JavascriptInterface
        public String savePhotoToGallery(String base64Data, String fileName, String mimeType) {
            new Thread(() -> {
                try {
                    byte[] bytes = Base64.decode(base64Data, Base64.DEFAULT);
                    String safeMime = (mimeType != null && !mimeType.isEmpty()) ? mimeType : "image/jpeg";

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        ContentResolver resolver = getContentResolver();
                        ContentValues values = new ContentValues();
                        values.put(MediaStore.Images.Media.DISPLAY_NAME, fileName);
                        values.put(MediaStore.Images.Media.MIME_TYPE, safeMime);
                        values.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_DCIM + "/LensCraft");
                        Uri uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                        if (uri != null) {
                            OutputStream os = resolver.openOutputStream(uri);
                            if (os != null) {
                                os.write(bytes);
                                os.flush();
                                os.close();
                            }
                            return;
                        }
                    }

                    File dcimDir = new File(
                        Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM),
                        "LensCraft"
                    );
                    if (!dcimDir.exists()) {
                        dcimDir.mkdirs();
                    }
                    File outFile = new File(dcimDir, fileName);
                    FileOutputStream fos = new FileOutputStream(outFile);
                    fos.write(bytes);
                    fos.flush();
                    fos.close();
                    MediaScannerConnection.scanFile(
                        MainActivity.this,
                        new String[]{outFile.getAbsolutePath()},
                        new String[]{safeMime},
                        null
                    );
                } catch (Exception e) {
                    runOnUiThread(() -> Toast.makeText(
                        MainActivity.this,
                        "❌ Gagal simpan ke Galeri: " + e.getMessage(),
                        Toast.LENGTH_LONG
                    ).show());
                }
            }).start();
            return "DCIM/LensCraft/" + fileName;
        }

        @JavascriptInterface
        public void saveWithSystemPicker(String base64Data, String fileName, String mimeType) {
            try {
                pendingSaveBytes = Base64.decode(base64Data, Base64.DEFAULT);
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType(mimeType != null && !mimeType.isEmpty() ? mimeType : "image/jpeg");
                intent.putExtra(Intent.EXTRA_TITLE, fileName);
                startActivityForResult(intent, REQ_CREATE_DOCUMENT);
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(
                    MainActivity.this,
                    "❌ Gagal membuka dialog Save As: " + e.getMessage(),
                    Toast.LENGTH_LONG
                ).show());
            }
        }

        @JavascriptInterface
        public void shareFile(String base64Data, String fileName, String mimeType) {
            try {
                byte[] bytes = Base64.decode(base64Data, Base64.DEFAULT);
                File cacheDir = new File(getCacheDir(), "shared_captures");
                if (!cacheDir.exists()) {
                    cacheDir.mkdirs();
                }
                File file = new File(cacheDir, fileName);
                FileOutputStream fos = new FileOutputStream(file);
                fos.write(bytes);
                fos.flush();
                fos.close();

                Uri uri = FileProvider.getUriForFile(
                    MainActivity.this,
                    getPackageName() + ".fileprovider",
                    file
                );
                Intent shareIntent = new Intent(Intent.ACTION_SEND);
                shareIntent.setType(mimeType != null ? mimeType : "image/jpeg");
                shareIntent.putExtra(Intent.EXTRA_STREAM, uri);
                shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                startActivity(Intent.createChooser(shareIntent, "Bagikan " + fileName));
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(
                    MainActivity.this,
                    "❌ Gagal membagikan foto: " + e.getMessage(),
                    Toast.LENGTH_LONG
                ).show());
            }
        }

        @JavascriptInterface
        public void openInLightCraft(String base64Data, String fileName, String mimeType) {
            try {
                // Save to DCIM/LensCraft first so LightCraft can also access it from storage
                savePhotoToGallery(base64Data, fileName, mimeType);

                byte[] bytes = Base64.decode(base64Data, Base64.DEFAULT);
                File cacheDir = new File(getCacheDir(), "shared_captures");
                if (!cacheDir.exists()) {
                    cacheDir.mkdirs();
                }
                File file = new File(cacheDir, fileName);
                FileOutputStream fos = new FileOutputStream(file);
                fos.write(bytes);
                fos.flush();
                fos.close();

                Uri uri = FileProvider.getUriForFile(
                    MainActivity.this,
                    getPackageName() + ".fileprovider",
                    file
                );

                PackageManager pm = getPackageManager();
                Intent launchIntent = pm.getLaunchIntentForPackage("com.storytold.lightcraft");
                if (launchIntent != null) {
                    Toast.makeText(
                        MainActivity.this,
                        "🎞️ Membuka LightCraft (Foto tersimpan di DCIM/LensCraft/" + fileName + ")",
                        Toast.LENGTH_LONG
                    ).show();
                    startActivity(launchIntent);
                } else {
                    Intent sendIntent = new Intent(Intent.ACTION_SEND);
                    sendIntent.setType(mimeType != null ? mimeType : "image/jpeg");
                    sendIntent.putExtra(Intent.EXTRA_STREAM, uri);
                    sendIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    startActivity(Intent.createChooser(sendIntent, "Edit / Buka dengan Aplikasi Foto"));
                }
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(
                    MainActivity.this,
                    "❌ Gagal membuka LightCraft: " + e.getMessage(),
                    Toast.LENGTH_LONG
                ).show());
            }
        }

        @JavascriptInterface
        public String getDeviceCameraSpecs() {
            try {
                String manufacturer = Build.MANUFACTURER != null ? Build.MANUFACTURER.trim() : "";
                String model = Build.MODEL != null ? Build.MODEL.trim() : "ANDROID PRO";
                String fullName = model.toLowerCase().startsWith(manufacturer.toLowerCase())
                    ? model
                    : (manufacturer + " " + model).trim();

                String apertureStr = "1.8";
                CameraManager cm = (CameraManager) getSystemService(Context.CAMERA_SERVICE);
                if (cm != null) {
                    for (String camId : cm.getCameraIdList()) {
                        CameraCharacteristics chars = cm.getCameraCharacteristics(camId);
                        Integer facing = chars.get(CameraCharacteristics.LENS_FACING);
                        if (facing != null && facing == CameraCharacteristics.LENS_FACING_BACK) {
                            float[] apertures = chars.get(CameraCharacteristics.LENS_INFO_AVAILABLE_APERTURES);
                            if (apertures != null && apertures.length > 0) {
                                apertureStr = String.valueOf(apertures[0]);
                            }
                            break;
                        }
                    }
                }
                return "{\\"model\\":\\"" + fullName.replace("\\"", "") + "\\",\\"aperture\\":\\"" + apertureStr + "\\"}";
            } catch (Exception ignored) {
                return "{\\"model\\":\\"LENSCRAFT PRO\\",\\"aperture\\":\\"1.8\\"}";
            }
        }

        @JavascriptInterface
        public void triggerHaptic(String type) {
            try {
                runOnUiThread(() -> {
                    View decor = getWindow().getDecorView();
                    if (decor != null) {
                        decor.performHapticFeedback(
                            "shutter".equals(type)
                                ? HapticFeedbackConstants.LONG_PRESS
                                : HapticFeedbackConstants.CLOCK_TICK
                        );
                    }
                });
                Vibrator vib = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                if (vib != null && vib.hasVibrator()) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        int ms = "shutter".equals(type) ? 24 : 9;
                        int amp = "shutter".equals(type) ? 210 : 90;
                        vib.vibrate(VibrationEffect.createOneShot(ms, amp));
                    } else {
                        vib.vibrate("shutter".equals(type) ? 24 : 9);
                    }
                }
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public void setVolumeShutterEnabled(boolean enabled) {
            volumeShutterEnabled = enabled;
        }
    }
}
`;
  fs.writeFileSync(mainActivityPath, javaCode, 'utf8');
  console.log('✅ Configured MainActivity.java with LensCraftNativeBridge (DCIM Auto-Save, Volume Shutter, Camera2 Specs, Haptics, LightCraft Integration)');
}
