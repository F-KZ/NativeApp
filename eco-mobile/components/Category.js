import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';

const CategoryList = [
  {
    id: 1,
    name: 'Promo',
  },
  {
    id: 2,
    name: 'Electronique',
  },
  {
    id: 3,
    name: 'Beauté',
  },
  {
    id: 4,
    name: 'Offres du moment',
  },
  {
    id: 5,
    name: 'Vetements',
  },
  {
    id: 6,
    name: 'Sports',
  }
];

export default function Category() {
  const [selectedId, setSelectedId] = useState(1);

  return (
    <View className="py-4">
      <Text className="text-xl font-bold px-4 mb-3">Catégories</Text>
      <View className="flex-row px-4 gap-3">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {CategoryList.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setSelectedId(item.id)}
              className={`px-4 py-2 rounded-full ${
                selectedId === item.id 
                ? "bg-primary" 
                : "bg-gray-100"
              }`}
            >
              <Text
                className={`${
                  selectedId === item.id 
                  ? "text-red font-medium" 
                  : "text-gray-600"
                }`}
              >
                {item.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
