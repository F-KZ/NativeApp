import React, { useState } from 'react';
import { View, TextInput, FlatList, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Search } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { listProducts } from '@/api/products';
import { useRouter } from 'expo-router';
import { Image } from '@/components/ui/image';


export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: listProducts,
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProductsMobile = filteredProducts?.slice(0, 4);

  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-6">
        <Search size={20} color="#666" />
        <TextInput
          className="flex-1 ml-2 text-base"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setShowResults(text.length > 0);
          }}
        />
      </View>

      {showResults && searchQuery.length > 0 && (
        <View className="absolute top-16 left-4 right-4 bg-white rounded-lg shadow-lg z-50">
          <FlatList
            data={filteredProductsMobile}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable 
                className="p-3 border-b border-gray-100"
                onPress={() => {
                  setSearchQuery(item.name);
                  setShowResults(false);
                  router.push(`/product/${item.id}`);
                  setSearchQuery('');
                }}
              >
               
                <View className="flex-row justify-between w-full">
                <Text className="text-base">{item.name}</Text>
                <Image 
                source={{ uri: item.image }} 
                className="w-10 h-10 rounded-full"
                alt="image"
                resizeMode="contain" 
                />
                </View>
               
              </Pressable>
            )}
            className="max-h-64"
          />
        </View>
      )}
    </View>
  );
}