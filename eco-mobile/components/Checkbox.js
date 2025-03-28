import { Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon } from "@/components/ui/checkbox";
import { FavouriteIcon, Icon } from "@/components/ui/icon";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useCart } from "@/store/cartStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeProduct } from "@/api/products";

export default function CheckboxComponent({ productId }) {
  const [like, setLike] = useState(false);
  const queryClient = useQueryClient();
  const { items } = useCart();

  const favoriteMutation = useMutation({
    mutationFn: () => likeProduct(productId),
    onSuccess: () => {
      setLike(prev => !prev);
      console.log(like);
      queryClient.invalidateQueries(['products']);
    }
  });

  

 
  return (
    <TouchableOpacity onPress={() => favoriteMutation.mutate}>
      <Ionicons name={like ? "heart" : "heart-outline"} size={24} color="red" />
    </TouchableOpacity>
  );
}