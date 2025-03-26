import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useCart } from '@/store/cartStore';
import { useAuth } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useState } from 'react';
import { createOrder } from '@/api/orders';

export default function CheckoutScreen() {
  const items = useCart((state) => state.items);
  const totalCart = useCart((state) => state.totalCart);
  const resetCart = useCart((state) => state.resetCart);
  const router = useRouter();
  const [showPayPal, setShowPayPal] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleCreateOrder = async () => {
    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const order = await createOrder(orderItems);
      setOrderId(order.id);
      setShowPayPal(true);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handlePayPalSuccess = () => {
    resetCart();
    router.replace('/');
  };

  const handlePayPalError = () => {
    console.error('Payment failed');
  };

  if (showPayPal) {
    return (
      <WebView
        source={{
          uri: `${process.env.EXPO_PUBLIC_API_URL}/paypal/checkout/${orderId}`,
        }}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes('success')) {
            handlePayPalSuccess();
          } else if (navState.url.includes('error')) {
            handlePayPalError();
          }
        }}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      
      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <View key={item.product.id} style={styles.item}>
            <Text>{item.product.name}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>${(item.product.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${totalCart.toFixed(2)}</Text>
      </View>

      <Button onPress={handleCreateOrder} style={styles.payButton}>
        <ButtonText>Pay with PayPal</ButtonText>
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemsContainer: {
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  payButton: {
    marginTop: 20,
  },
}); 