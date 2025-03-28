import { Link, Stack } from 'expo-router'
import React, { useEffect } from 'react'
import "@/global.css";
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Icon, BellIcon } from '@/components/ui/icon';
import { ShoppingCart } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useCart } from '@/store/cartStore';
import { useAuth } from '@/store/authStore';
import { User } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import MenuProfil from '@/components/MenuProfil';
import { StyleSheet } from 'react-native-css-interop';
import { useRouter } from "expo-router";

// Create a new QueryClient instance
const queryClient = new QueryClient();

export default function RootLayout() {
  const cartItemsNum = useCart((state) => state.items.length);
  const isLoggedIn = useAuth((s) => !!s.token);
  const router = useRouter();


  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn]);

  return (
    <QueryClientProvider client={queryClient}>
      
        <GluestackUIProvider>
          <Stack
            screenOptions={{
              headerRight: () =>
                cartItemsNum > 0 && isLoggedIn ? (
                  <Link href={'/cart'} asChild>
                    <Pressable className="flex-row gap-2">
                      <Icon as={ShoppingCart} />
                      <Text>{cartItemsNum}</Text>
                    </Pressable>
                  </Link>
                ) : (
                  
                    <Pressable className="flex-row gap-2">
                      <Icon as={BellIcon} />
                    </Pressable>
                
                ),
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: 'Shop',
                headerLeft: () =>
                  !isLoggedIn ? (
                    <Link href={'/login'} asChild>
                      <Pressable className="flex-row gap-2">
                        <Icon as={User} />
                      </Pressable>
                    </Link>
                  ) : (
                    <MenuProfil />
                  ),
              }}
            />
            <Stack.Screen name="product/[id]" options={{ title: 'Product' }} />
          </Stack>
        </GluestackUIProvider>
    
    </QueryClientProvider>
  );
}
