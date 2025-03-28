import { FormControl } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { useState } from 'react';
import { HStack } from '@/components/ui/hstack';
import { useMutation } from '@tanstack/react-query';
import { login, signup } from '@/api/auth';
import { err } from 'react-native-svg/lib/typescript/xml';
import { useAuth } from '@/store/authStore';
import { Redirect, router, Stack } from 'expo-router';
import Alert from '@/components/Alert';
import React from 'react';


export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const setUser = useAuth((s) => s.setUser);
  const setToken = useAuth((s) => s.setToken);
  const isLoggedIn = useAuth((s) => !!s.token);

  const [error, setError] = useState<Error | null>(null);

  const signupMutation = useMutation({
    mutationFn: () => signup(name, email, password, address),
    onSuccess: (data) => {
      console.log('SUccess sign up: ', data);
      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
      }
    },
    onError: (error) => {
      console.log('Error: ', error);
      setError(error);
    },
  });

  

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  if (isLoggedIn) {
    return <Redirect href={'/'} />;
  }

  return (
    <>
    {error && <Alert error={error} onClose={() => setError(null)} />}
    <FormControl
      isInvalid={signupMutation.error}
      className="p-4 border rounded-lg max-w-[500px] border-outline-300 bg-white m-2"
    >
      <Stack.Screen options={{ title: 'Sign up' }}/>
      <VStack space="xl">
        <Heading className="text-typography-900 leading-3 pt-3">Sign up</Heading>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Name</Text>
          <Input>
            <InputField value={name} onChangeText={setName} type="text" />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Email</Text>
          <Input>
            <InputField value={email} onChangeText={setEmail} type="text" />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Adress</Text>
          <Input>
            <InputField value={address} onChangeText={setAddress} type="text" />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Password</Text>
          <Input className="text-center">
            <InputField
              value={password}
              onChangeText={setPassword}
              type={showPassword ? 'text' : 'password'}
            />
            <InputSlot className="pr-3" onPress={handleState}>
              {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
              <InputIcon
                as={showPassword ? EyeIcon : EyeOffIcon}
                className="text-darkBlue-500"
              />
            </InputSlot>
          </Input>
        </VStack>
        <HStack space="sm">
          <Button
            className="flex-1"
            variant="outline"
            onPress={() => signupMutation.mutate()}
          >
            <ButtonText>Sign in</ButtonText>
          </Button>
          <Button className="flex-1" onPress={() => router.push('/login')}>
            <ButtonText>i have an account</ButtonText>
          </Button>
        </HStack>
      </VStack>
      </FormControl>
    </>
  );
}