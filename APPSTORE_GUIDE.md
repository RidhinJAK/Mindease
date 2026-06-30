# 🍎 MindEase — Apple App Store Publishing Guide

## Overview

This guide walks you through publishing MindEase to the Apple App Store using **Capacitor** to wrap your Next.js web app in a native iOS shell.

---

## Prerequisites

Before you begin, you'll need:

1. **Mac computer** (required for iOS development)
2. **Xcode 15+** (free from Mac App Store)
3. **Apple Developer Account** ($99/year) — [developer.apple.com](https://developer.apple.com)
4. **Node.js 18+** installed
5. **CocoaPods** installed (`sudo gem install cocoapods`)

---

## Step 1: Prepare for Static Export

Since Capacitor needs static files, configure Next.js for static export.

### Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
```

> ⚠️ **Note:** Static export means no server-side features. API routes won't work — you'll need to connect to an external backend (Firebase, Supabase, etc.).

---

## Step 2: Build the Web App

```bash
# Install dependencies
npm install

# Build for production (creates /out folder)
npm run build
```

---

## Step 3: Initialize Capacitor iOS Project

```bash
# Initialize Capacitor (already configured via capacitor.config.ts)
npx cap add ios

# Sync web assets to iOS project
npx cap sync ios
```

This creates an `ios/` folder with the native Xcode project.

---

## Step 4: Configure Xcode Project

```bash
# Open in Xcode
npx cap open ios
```

### In Xcode:

1. **Select your Team**
   - Click on "App" in the project navigator
   - Under "Signing & Capabilities" → Select your Apple Developer Team
   - Xcode will create provisioning profiles automatically

2. **Set Bundle Identifier**
   - Should match `capacitor.config.ts`: `com.mindease.app`

3. **Set Version & Build Number**
   - Version: `1.0.0`
   - Build: `1`

4. **Configure App Icons**
   - Open `Assets.xcassets` → `AppIcon`
   - Add icons for all required sizes (use an icon generator tool)

5. **Add Launch Screen**
   - Edit `LaunchScreen.storyboard` or use the splash image

---

## Step 5: Configure App Capabilities

In Xcode under "Signing & Capabilities":

### Required:
- ✅ **App Groups** (for shared data)
- ✅ **Push Notifications** (if you plan to add them)

### Recommended:
- ✅ **HealthKit** (for future wellness integrations)
- ✅ **Sign in with Apple** (required if you offer social login)

---

## Step 6: Create App Store Connect Listing

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** → **New App**

### Fill in:
- **Platform:** iOS
- **Name:** MindEase
- **Primary Language:** English
- **Bundle ID:** com.mindease.app
- **SKU:** mindease-ios-v1

---

## Step 7: Prepare App Store Assets

### Screenshots (Required)
Capture these on iOS Simulator:
- **6.7" Display** (iPhone 15 Pro Max): 1290 × 2796
- **6.5" Display** (iPhone 14 Plus): 1284 × 2778
- **5.5" Display** (iPhone 8 Plus): 1242 × 2208
- **12.9" iPad Pro**: 2048 × 2732

### App Preview Videos (Optional but recommended)
- Up to 30 seconds
- Show key features

### App Icon
- 1024 × 1024 PNG (no alpha/transparency)

### Metadata
```
Name: MindEase
Subtitle: Your Calm Companion
Description: 
MindEase is your AI-powered mental wellness companion designed to help you feel calmer, more supported, and mindful.

✨ Features:
• AI Companion — A thoughtful conversation partner that listens and guides
• Mood Tracking — Beautiful visualizations of your emotional journey
• Journal — A premium writing space for reflection and growth
• Breathing Exercises — Immersive guided sessions to restore balance
• Daily Insights — Personalized reflections and progress tracking

🔒 Your Privacy Matters
All your data stays on your device. We never share or sell your personal information.

Keywords: mental health, wellness, meditation, journal, mood tracker, breathing, mindfulness, calm, anxiety, stress relief
```

---

## Step 8: Build for App Store

### In Xcode:

1. **Select "Any iOS Device (arm64)"** as build target

2. **Archive the app:**
   - Menu: **Product** → **Archive**
   - Wait for build to complete

3. **Validate:**
   - In Organizer, select archive → **Validate App**
   - Fix any issues

4. **Upload:**
   - Click **Distribute App** → **App Store Connect**
   - Follow prompts

---

## Step 9: Submit for Review

In App Store Connect:

1. Select your uploaded build
2. Complete all required information:
   - Age Rating
   - App Privacy (data collection details)
   - Contact Information
   - Review Notes

3. Click **Submit for Review**

### Review Timeline
- First submission: 24-48 hours (sometimes longer)
- Updates: Usually 24 hours
- Rejections: You can reply or resubmit

---

## Common Rejection Reasons & Fixes

### 1. **Guideline 4.2 - Minimum Functionality**
> "Your app provides limited functionality."

**Fix:** Ensure all features work offline or clearly explain they require internet.

### 2. **Guideline 2.1 - App Completeness**
> "Your app crashed during review."

**Fix:** Test thoroughly on physical devices.

### 3. **Guideline 5.1.1 - Data Collection**
> "Privacy policy missing or incomplete."

**Fix:** Add comprehensive privacy policy.

### 4. **Guideline 4.0 - Design**
> "Your app uses standard web views."

**Fix:** Make the app feel native (haptics, smooth animations, native navigation patterns).

---

## Step 10: Post-Launch

### Analytics
- Set up **App Analytics** in App Store Connect
- Consider adding **Firebase Analytics**

### Updates
```bash
# Make changes to web app
npm run build

# Sync to iOS
npx cap sync ios

# Open Xcode, increment build number, archive, upload
npx cap open ios
```

### Respond to Reviews
- Monitor ratings in App Store Connect
- Reply to user reviews

---

## Native Enhancements (Recommended)

To make your app feel more native, consider adding:

### Haptic Feedback
```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Light tap
await Haptics.impact({ style: ImpactStyle.Light });

// Success vibration
await Haptics.notification({ type: 'SUCCESS' });
```

### Native Status Bar
```typescript
import { StatusBar, Style } from '@capacitor/status-bar';

await StatusBar.setStyle({ style: Style.Dark });
await StatusBar.setBackgroundColor({ color: '#FAF8F5' });
```

### Splash Screen Control
```typescript
import { SplashScreen } from '@capacitor/splash-screen';

// Hide when your app is ready
await SplashScreen.hide();
```

---

## Helpful Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

---

## Cost Summary

| Item | Cost |
|------|------|
| Apple Developer Program | $99/year |
| Xcode | Free |
| App Store listing | Free (included in Developer Program) |
| **Total** | **$99/year** |

---

## Timeline Estimate

| Task | Duration |
|------|----------|
| Set up Apple Developer Account | 1-2 days (verification) |
| Configure Xcode project | 1-2 hours |
| Create App Store assets | 2-4 hours |
| Build & upload | 30 minutes |
| App Review | 1-7 days |
| **Total** | **3-10 days** |

---

## Need Help?

For backend authentication and data sync, consider:
- **Firebase** — Auth, Firestore, Analytics
- **Supabase** — Open-source Firebase alternative
- **Clerk** — Auth-as-a-service

Good luck with your App Store launch! 🚀
