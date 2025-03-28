import React from 'react'
import { Text } from '@/components/ui/text'
import { useLocalSearchParams } from 'expo-router'
import products from '@/assets/data/products.json'
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import {Stack} from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/api/products';
import { useCart } from '@/store/cartStore';
import { ActivityIndicator } from 'react-native';
import Alert from '@/components/Alert';
export default function detailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const addProduct = useCart((state) => state.addProduct);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', id],
    queryFn: () => fetchProductById(Number(id)),
  });

  const addToCart = () => {
    addProduct(product);
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    Alert(error);
  }

  return (
    <Box className='bg-red-500 flex-1 items-start p-3'>
      <Stack.Screen options={{ title: product.name }}/>
    <Card className="p-5 rounded-lg max-w-[560px] mx-auto flex-1">
      
    <Image
     source={{ uri: product.image }}
     alt="image"
     resizeMode="contain" 
     className="mb-6 h-[240px] w-full rounded-md aspect-[4/3]"
     height={240}
     />
    <Text
      className="text-lg font-normal mb-2 text-typography-700"
      >
     {product.name}
    </Text>
    <VStack className="mb-6">
      <Heading size="md" className="mb-4">
       {product.price}
      </Heading>
      <Text size="sm">
        {product.description}
      </Text>
    </VStack>
    <Box
      className="flex-col sm:flex-row"
      >
      <Button
        className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1"
        onPress={addToCart}
        >
        <ButtonText
        size="sm">Add to cart</ButtonText>
      </Button>
      <Button
        variant="outline"
        className="px-4 py-2 border-outline-300 sm:flex-1"
        >
        <ButtonText
          size="sm"
          className="text-typography-600"
          >
          Wishlist
        </ButtonText>
      </Button>
    </Box>
  </Card>
  </Box>
  )
}
