# 🍎 MindEase — App Store Publishing from Windows

Since Xcode only runs on macOS, here are your options to publish to the Apple App Store from Windows:

---

## Option 1: Cloud Mac Service (Recommended) ⭐

Rent a Mac in the cloud — most affordable and straightforward.

### Services:

| Service | Price | Best For |
|---------|-------|----------|
| [MacStadium](https://www.macstadium.com) | ~$79/mo | Dedicated Mac mini |
| [MacInCloud](https://www.macincloud.com) | ~$20/mo | Pay-as-you-go |
| [AWS EC2 Mac](https://aws.amazon.com/ec2/instance-types/mac/) | ~$26/day | Enterprise |
| [Scaleway Mac Mini](https://www.scaleway.com/en/hello-m1/) | ~€0.10/hr | Hourly billing |

### Steps:
1. Sign up for MacInCloud (cheapest for one-time builds)
2. Connect via Remote Desktop
3. Follow the standard macOS build process
4. Upload to App Store Connect

---

## Option 2: Codemagic CI/CD (Easiest) ⭐⭐

Codemagic builds your app in the cloud — no Mac needed!

### Setup:

1. **Sign up** at [codemagic.io](https://codemagic.io)

2. **Connect your repository** (GitHub, GitLab, Bitbucket)

3. **Create `codemagic.yaml`** in your project root:

```yaml
workflows:
  ios-release:
    name: iOS Release
    max_build_duration: 60
    instance_type: mac_mini_m2
    
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.mindease.app
      vars:
        XCODE_WORKSPACE: "ios/App/App.xcworkspace"
        XCODE_SCHEME: "App"
      node: 18
    
    scripts:
      - name: Install dependencies
        script: npm install
      
      - name: Build web app
        script: npm run build
      
      - name: Install CocoaPods
        script: |
          cd ios/App
          pod install
      
      - name: Build iOS
        script: |
          xcode-project build-ipa \
            --workspace "$XCODE_WORKSPACE" \
            --scheme "$XCODE_SCHEME"
    
    artifacts:
      - build/ios/ipa/*.ipa
    
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
```

4. **Add Apple credentials** in Codemagic dashboard

5. **Push code** → Codemagic builds and uploads automatically!

### Pricing:
- **Free tier:** 500 build minutes/month
- **Pay-as-you-go:** $0.095/min (Mac M2)
- One iOS build ≈ $3-5

---

## Option 3: GitHub Actions

Use GitHub's macOS runners for free (limited minutes).

### Create `.github/workflows/ios-build.yml`:

```yaml
name: iOS Build

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: macos-14
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build web app
        run: npm run build
      
      - name: Setup Capacitor iOS
        run: |
          npx cap add ios || true
          npx cap sync ios
      
      - name: Install CocoaPods
        run: |
          cd ios/App
          pod install
      
      - name: Import signing certificate
        env:
          CERTIFICATE_BASE64: ${{ secrets.CERTIFICATE_BASE64 }}
          CERTIFICATE_PASSWORD: ${{ secrets.CERTIFICATE_PASSWORD }}
          KEYCHAIN_PASSWORD: ${{ secrets.KEYCHAIN_PASSWORD }}
        run: |
          # Create keychain
          security create-keychain -p "$KEYCHAIN_PASSWORD" build.keychain
          security default-keychain -s build.keychain
          security unlock-keychain -p "$KEYCHAIN_PASSWORD" build.keychain
          
          # Import certificate
          echo "$CERTIFICATE_BASE64" | base64 --decode > certificate.p12
          security import certificate.p12 -k build.keychain -P "$CERTIFICATE_PASSWORD" -T /usr/bin/codesign
          security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k "$KEYCHAIN_PASSWORD" build.keychain
      
      - name: Build archive
        run: |
          xcodebuild -workspace ios/App/App.xcworkspace \
            -scheme App \
            -configuration Release \
            -archivePath build/App.xcarchive \
            archive
      
      - name: Export IPA
        run: |
          xcodebuild -exportArchive \
            -archivePath build/App.xcarchive \
            -exportPath build/ipa \
            -exportOptionsPlist ios/ExportOptions.plist
      
      - name: Upload to App Store Connect
        env:
          APP_STORE_CONNECT_API_KEY: ${{ secrets.APP_STORE_API_KEY }}
        run: |
          xcrun altool --upload-app \
            --type ios \
            --file build/ipa/App.ipa \
            --apiKey $APP_STORE_CONNECT_API_KEY
```

### Pricing:
- **Free tier:** 2,000 minutes/month (but macOS = 10x multiplier → 200 min)
- **Pro:** Included with GitHub Pro

---

## Option 4: Expo + EAS Build

If you're open to migrating to React Native/Expo, you get the easiest cloud builds.

### Why Expo?
- One codebase for iOS + Android + Web
- Cloud builds (no Mac needed)
- Over-the-air updates
- Push notifications built-in

### Migration effort: 
~2-3 days to convert (most React code transfers directly)

---

## Option 5: PWA (No App Store)

Skip the App Store entirely — users install from Safari!

### How it works:
1. User visits your website on iPhone
2. Taps Share → "Add to Home Screen"
3. App icon appears on home screen
4. Opens full-screen like native app

### Pros:
- No Apple Developer fee ($99/year saved)
- No App Store review process
- Instant updates
- Already working in your current build!

### Cons:
- No App Store discoverability
- Some native APIs unavailable
- Users must know to "Add to Home Screen"

### Your PWA is already configured! Just deploy to:
- Vercel
- Netlify  
- Cloudflare Pages

---

## Comparison

| Option | Cost | Difficulty | Time to First Build |
|--------|------|------------|---------------------|
| MacInCloud | ~$20-30 one-time | Medium | 2-3 hours |
| Codemagic | ~$5/build | Easy | 1 hour |
| GitHub Actions | Free (limited) | Hard | 3-4 hours |
| Expo Migration | Free tier | Medium | 2-3 days |
| PWA | Free | Already done! | Now |

---

## My Recommendation

### For App Store presence:
**Use Codemagic** — $5 per build, no Mac needed, handles everything.

### For quick launch:
**Deploy as PWA** — Already working, free, instant.

### For long-term:
**Consider Expo** — Better native experience, easier maintenance.

---

## Quick Start with Codemagic

1. Push your code to GitHub

2. Sign up at [codemagic.io](https://codemagic.io) with GitHub

3. Add new app → Select your repo

4. Add the `codemagic.yaml` file (above)

5. In Codemagic dashboard:
   - Go to **Teams** → **Integrations**
   - Add **App Store Connect** integration
   - Upload your Apple Distribution certificate
   - Add your provisioning profile

6. Click **Start build** 🚀

---

## Apple Developer Account Setup

You still need an Apple Developer Account ($99/year):

1. Go to [developer.apple.com/programs](https://developer.apple.com/programs/enroll/)
2. Sign in with your Apple ID
3. Enroll as Individual or Organization
4. Pay $99
5. Wait for approval (usually 24-48 hours)

### Create Certificates (in browser):
1. [developer.apple.com/account](https://developer.apple.com/account)
2. Certificates, Identifiers & Profiles
3. Create App ID: `com.mindease.app`
4. Create Distribution Certificate (for App Store)
5. Create Provisioning Profile (App Store type)
6. Download and upload to Codemagic

---

## Need Help?

- [Codemagic Docs](https://docs.codemagic.io)
- [Capacitor iOS Docs](https://capacitorjs.com/docs/ios)
- [Apple Developer Support](https://developer.apple.com/support/)

Good luck! 🎉
