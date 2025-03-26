import { Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon } from "@/components/ui/checkbox";
import { FavouriteIcon, Icon } from "@/components/ui/icon";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { likeProduct } from "@/api/products";
import { useState } from "react";
export default function CheckboxComponent({ productId }) {
  const [like, setLike] = useState(false);

  const handleLike = () => {
    setLike(!like);
    likeProduct(productId);
  };

  return (
    <TouchableOpacity onPress={handleLike}>
      <Ionicons name={like ? "heart" : "heart-outline"} size={24} color="red" />
    </TouchableOpacity>
  );
}