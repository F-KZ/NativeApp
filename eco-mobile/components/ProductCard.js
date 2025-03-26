import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import CheckboxComponent from "./Checkbox";
import { useAuth } from "@/store/authStore";

export const ProductCard = ({ image, name, id, price, description }) => {
  const user = useAuth((state) => state.user);
  
    return (
      <Link href={`/product/${id}`} asChild>
        <Pressable className="flex-1">

    <Card className="p-5 rounded-lg m-[4px] flex-1">
      {user && <CheckboxComponent productId={id} />}
      
      <Image
       source={{ uri: image }}
       alt="image"
       resizeMode="contain" 
       className="mb-6 h-[240px] w-full rounded-md aspect-[4/3]"
       height={240}
    
       />
      <Text
        className="text-lg font-normal mb-2 text-typography-700"
        >
       {name}
      </Text>
    
        <Heading size="md" className="mb-4">
         {price}
        </Heading>
       
  
    
    </Card>
              </Pressable>
            </Link>
);
}
