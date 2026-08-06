import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans/800ExtraBold';
import { NunitoSans_900Black } from '@expo-google-fonts/nunito-sans/900Black';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/providers/AuthProvider';
import { ProfileProvider } from '@/providers/ProfileProvider';
import { ProductsProvider } from '@/providers/ProductsProvider';
import { CartProvider } from '@/providers/CartProvider';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NunitoSans_800ExtraBold,
    NunitoSans_900Black,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ProfileProvider>
        <ProductsProvider>
          <CartProvider>
            <ThemeProvider value={DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="admin" options={{ headerShown: false }} />
                <Stack.Screen name="all-products" options={{ headerShown: false }} />
                <Stack.Screen
                  name="cart"
                  options={{ headerShown: false, presentation: 'modal', title: 'Shopping Cart' }}
                />
                <Stack.Screen name="categories" options={{ headerShown: false }} />
                <Stack.Screen name="add" options={{ headerShown: false }} />
                <Stack.Screen name="export" options={{ headerShown: false }} />
                <Stack.Screen
                  name="product/[id]"
                  options={{ headerShown: false, presentation: 'card' }}
                />
                <Stack.Screen name="+not-found" options={{ title: 'Not found' }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </CartProvider>
        </ProductsProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
