import React from 'react'
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/api/products";
import { FlatList, View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';
import { useRouter } from 'expo-router';

export default function TopSelection() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: listProducts,
  });

  const topProducts = data?.slice(5, 9);    
  return (
    <View className="py-4 bg-white">
      <Text className="text-xl font-bold px-4 mb-3">Top Selection</Text>
      <FlatList
        data={topProducts}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image 
        source={{ uri: item.image }}
        alt="image"
        size="lg"
        resizeMode="contain"
        />
        </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      />
    </View>
  )
}