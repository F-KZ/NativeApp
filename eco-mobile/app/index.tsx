import { FlatList, View } from "react-native";
import Category from "@/components/Category";
import TopSelection from "@/components/TopSelection";
import ProductList from '@/components/ProductList'
import SearchBar from '@/components/SearchBar';

const sections = [
  { id: 'searchBar', component: SearchBar },
  { id: 'category', component: Category },
  { id: 'topSelection', component: TopSelection },
  { id: 'productList', component: ProductList }
];

export default function Home() {
  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => {
        const Component = item.component;
        return <Component />;
      }}
      keyExtractor={item => item.id}
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
    />
  );
}
