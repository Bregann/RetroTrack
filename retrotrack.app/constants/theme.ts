/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#1976d2';
const tintColorDark = '#1976d2';

export const Colors = {
  light: {
    text: '#495057',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#6c757d',
    tabIconDefault: '#6c757d',
    tabIconSelected: tintColorLight,
    tabBarBackground: '#f4f4f4',
    inputBackground: '#f8f9fa',
    inputBorder: '#ced4da',
    secondaryText: '#6c757d',
    error: '#fa5252',
    cardBackground: '#f8f9fa',
  },
  dark: {
    text: '#c1c2c5',
    background: '#15171C',
    tint: tintColorDark,
    icon: '#909296',
    tabIconDefault: '#909296',
    tabIconSelected: tintColorDark,
    tabBarBackground: '#1A1B1E',
    inputBackground: '#25262b',
    inputBorder: '#373A40',
    secondaryText: '#909296',
    error: '#fa5252',
    cardBackground: '#25262b',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
