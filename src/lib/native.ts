/**
 * Native platform utilities for Capacitor iOS/Android
 * These provide native feel when running as a mobile app
 */

// Check if running in Capacitor native shell
export function isNative(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as Window & { Capacitor?: { isNativePlatform: () => boolean } }).Capacitor?.isNativePlatform?.();
}

// Check platform
export function getPlatform(): "ios" | "android" | "web" {
  if (typeof window === "undefined") return "web";
  const capacitor = (window as Window & { Capacitor?: { getPlatform: () => string } }).Capacitor;
  if (capacitor?.getPlatform) {
    const platform = capacitor.getPlatform();
    if (platform === "ios") return "ios";
    if (platform === "android") return "android";
  }
  return "web";
}

// Haptic feedback (with graceful fallback)
export async function hapticLight() {
  if (!isNative()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Haptics not available
  }
}

export async function hapticMedium() {
  if (!isNative()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    // Haptics not available
  }
}

export async function hapticSuccess() {
  if (!isNative()) return;
  try {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    // Haptics not available
  }
}

export async function hapticWarning() {
  if (!isNative()) return;
  try {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Warning });
  } catch {
    // Haptics not available
  }
}

// Hide splash screen (call when app is ready)
export async function hideSplash() {
  if (!isNative()) return;
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();
  } catch {
    // Splash screen not available
  }
}

// Status bar styling
export async function setStatusBarDark() {
  if (!isNative()) return;
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
  } catch {
    // Status bar not available
  }
}

export async function setStatusBarLight() {
  if (!isNative()) return;
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Light });
  } catch {
    // Status bar not available
  }
}
