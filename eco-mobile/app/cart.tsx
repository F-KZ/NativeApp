import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { useCart } from '@/store/cartStore';
import { View, FlatList, Alert, Pressable, StyleSheet } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Redirect, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createOrder } from '@/api/orders';
import { createPaymentIntent } from '@/api/stripe';
import { useEffect } from 'react';
import { Trash2 } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useStripe } from '@stripe/stripe-react-native';
import { useAuth } from '@/store/authStore';
interface CartItem {
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
}

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export default function CartScreen() {
  const items = useCart((state) => state.items);
  const resetCart = useCart((state) => state.resetCart);
  const removeProduct = useCart((state) => state.removeProduct);
  const totalCart = useCart((state) => state.totalCart);
  const user = useAuth((state) => state.user);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const paymentIntentMutation = useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: async (data) => {
      const { customer, ephemeralKey, paymentIntent } = data;

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Example, Inc.',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        // allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Jane Doe',
        },
        // returnURL: 'notjust-ecom:/',
      });
      if (error) {
        Alert.alert('Error', error.message);
        console.log(error);
      }

      openPaymentSheet();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const router = useRouter();

  const createOrderMutation = useMutation({
    mutationFn: () => {
      const orderItems: OrderItem[] = items.map((item: CartItem) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      return createOrder({ items: orderItems });
    },
    onSuccess: (data) => {
      paymentIntentMutation.mutate({ orderId: data.id });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      // TODO: handle error. The order is submitted, but payment failed.
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
      resetCart();
      // router.push(`/orders/${orderId}`);
      router.replace('/');
    }
  };

  const onCheckout = async () => {
    createOrderMutation.mutateAsync();
    
     openPaymentSheet();
  };

  if (items.length === 0) {
    return <Redirect href={'/'} />;
  }

  return (
    <View style={styles.container}>
      {user ? (
    <FlatList
      data={items}
      contentContainerClassName="gap-2 max-w-[960px] w-full mx-auto p-2"
      renderItem={({ item }: { item: CartItem }) => (
        <HStack className="bg-white p-3 items-center">
          <VStack space="sm" className="flex-1 mr-4">
            <Text bold numberOfLines={1} className="max-w-[200px]">{item.product.name}</Text>
            <Text>$ {item.product.price}</Text>
          </VStack>
          <Text className="w-8 text-center">{item.quantity}</Text>
          <Pressable onPress={() => removeProduct(item.product.id)} className="w-8 ml-4">
            <Icon as={Trash2} />
          </Pressable>
        </HStack>
      )}

      ListFooterComponent={() => (
        <VStack space="md" className="mt-4">
          <HStack className="justify-between px-4">
            <Text bold>Total:</Text>
            <Text bold>$ {totalCart(items).toFixed(2)}</Text>
          </HStack>
          
    <Button onPress={() => router.push('/checkout')} style={styles.checkoutButton}>
      <ButtonText>Proceed to Checkout</ButtonText>
    </Button>
        </VStack>
      )}
      />
    ) : (
      <Button onPress={() => router.push('/login')} style={styles.checkoutButton}>
        <ButtonText>Login to Checkout</ButtonText>
      </Button>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  checkoutButton: {
    marginTop: 20,
  },
});