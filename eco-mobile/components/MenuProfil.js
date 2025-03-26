import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Drawer, DrawerBackdrop, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@/components/ui/drawer";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Icon, PhoneIcon, StarIcon } from "@/components/ui/icon";
import React from "react";
import { User, Home, ShoppingCart, Wallet, LogOut } from "lucide-react-native";
import { AvatarProfile } from "./AvatarProfile";
import { useRouter } from "expo-router";
import { useAuth } from "@/store/authStore";


export default function MenuProfil() {

            const [showDrawer, setShowDrawer] = React.useState(false);
            const router = useRouter();
            const logout = useAuth((state) => state.logout);
            const user = useAuth((state) => state.user);

           
            
            return (
              <>
               <Pressable
                  onPress={() => {
                    setShowDrawer(true);
                  }}
                >
                  <AvatarProfile />
                </Pressable>
                
                <Drawer
                  isOpen={showDrawer}
                  onClose={() => {
                    setShowDrawer(false);
                  }}
                >
                  <DrawerBackdrop />
                  <DrawerContent className="w-[270px] md:w-[300px] ">
                    <DrawerHeader className="justify-center flex-col gap-2">
                      <Avatar size="2xl">
                        <AvatarFallbackText>User Image</AvatarFallbackText>
                        <AvatarImage
                          source={{
                            uri: user.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                          }}
                        />
                      </Avatar>
                      <VStack className="justify-center items-center">
                        <Text size="lg">{user.name}</Text>
                        <Text size="sm" className="text-typography-600">
                          {user.email}
                        </Text>
                      </VStack>
                    </DrawerHeader>
                    <Divider className="my-4" />
                    <DrawerBody contentContainerClassName="gap-2">
                      <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
                        <Icon as={User} size="lg" className="text-typography-600" />
                        <Text>My Profile</Text>
                      </Pressable>
                      <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
                        <Icon as={Home} size="lg" className="text-typography-600" />
                        <Text>Saved Address</Text>
                      </Pressable>
                      <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
                        <Icon
                          as={ShoppingCart}
                          size="lg"
                          className="text-typography-600"
                        />
                        <Text>Orders</Text>
                      </Pressable>
                      <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
                        <Icon as={Wallet} size="lg" className="text-typography-600" />
                        <Text>Saved Cards</Text>
                      </Pressable>
                      <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
                        <Icon as={StarIcon} size="lg" className="text-typography-600" />
                        <Text>Review App</Text>
                      </Pressable>
                      <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
                        <Icon as={PhoneIcon} size="lg" className="text-typography-600" />
                        <Text>Contact Us</Text>
                      </Pressable>
                    </DrawerBody>
                    <DrawerFooter>
                      <Button
                        className="w-full gap-2"
                        variant="outline"
                        action="secondary"
                        onPress={() => {
                            logout();
                            router.replace("/");
                        }}
                      >
                        <ButtonText>Logout</ButtonText>
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </>
            );
          }