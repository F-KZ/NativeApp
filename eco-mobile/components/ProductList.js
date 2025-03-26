
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions} from "react-native";
import  {ProductCard} from "./ProductCard";
import { listProducts } from "@/api/products";
import { useQuery } from "@tanstack/react-query";


export default function ProductList() {
    const [numColumns, setNumColumns] = useState();
    const { data, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: listProducts,
      });


    useEffect(() => {
        const updateLayout = () => {
            const width = Dimensions.get("window").width;
            setNumColumns(width > 700 ? 3 : 2);
        };

        const subscription = Dimensions.addEventListener("change", updateLayout);
        
        updateLayout(); // Initial check on mount

        return () => subscription.remove();
    }, []);

    // Render a loading indicator while data is being fetched
    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if(error){
        return <Text>Error fetching Products</Text>
    }

    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Product List</Text>
            { !data ? <Text> No products available</Text> : (
                <FlatList
                className="gap-2 max-w-[960px] mx-auto w-full"
                key={numColumns}
                    data={data} // Pass the products array as data
                    renderItem={({ item }) => (
                        <ProductCard {...item} /> // Pass item props to ProductCard
                    )}
                
                    numColumns={numColumns}
                     // Display in a grid
                    keyExtractor={(item) => item.id.toString()} // Use a unique key for each item
                />
            )}
        </View>
    );
}

// Styles for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
        marginTop: 30,
    },
    listContent: {
        paddingBottom: 16, // Add padding at the bottom of the list
    },
    card: {
        gap : '2rem'
    }
});
