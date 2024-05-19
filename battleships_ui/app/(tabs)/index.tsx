import React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Input,
  InputField,
  Button,
  Center,
  Heading,
  Icon,
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
  VStack,
  SafeAreaView,
} from '@gluestack-ui/themed';
import { Animated } from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [loginOrRegister, setLoginOrRegister] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [credentialError, setCredentialError] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  const toast = useToast();

  const handleEmailChange = (email: string) => {
    setEmail(email);
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
  };

  const handleLoginOrRegister = async () => {
    if (!email || !password) {
      setCredentialError(true);
      return;
    }
    setCredentialError(false);
    if (loginOrRegister === 'login') {
      try {
        const response = await axios.post('http://163.172.177.98:8081/auth/login', {
          email,
          password,
        });
        await AsyncStorage.setItem('@email', email);
        await AsyncStorage.setItem('@token', response.data.accessToken);
        setEmail('');
        setPassword('');

        router.push('/explore');
      } catch (error) {
        setCredentialError(true);
        toast.show({
          placement: "bottom left",
          render: ({ id }) => {
            const toastId = "toast-" + id
            return (
              <SafeAreaView>
                <Toast nativeID={toastId} action="attention" variant="solid">
                  <VStack space="xs">
                    <ToastTitle>Invalid credentials</ToastTitle>
                    <ToastDescription>
                      The email or password you entered is incorrect.
                    </ToastDescription>
                  </VStack>
                </Toast>
              </SafeAreaView>
            )
          },
        });
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post('http://163.172.177.98:8081/auth/register', {
          email,
          password,
        });
        console.log(response.data);
        toast.show({
          placement: "bottom left",
          render: ({ id }) => {
            const toastId = "toast-" + id
            return (
              <SafeAreaView>
                <Toast nativeID={toastId} action="attention" variant="solid">
                  <VStack space="xs">
                    <ToastTitle>Register succesful</ToastTitle>
                    <ToastDescription>
                      Your account has been created successfully.
                    </ToastDescription>
                  </VStack>
                </Toast>
              </SafeAreaView>
            )
          },
        });
        setLoginOrRegister('login');
      } catch (error) {
        setCredentialError(true);
        console.error(error);
      }
    }
  }

  useEffect(() => {
    Animated.spring(progress, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    return () => {
      progress.setValue(0);
      scale.setValue(0);
    };
  }, []);

  return (
    <Animated.View style={[{ opacity: progress, transform:[{ scale }] }]}>
      <Center
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
        gap={10}
      >

        <Heading>{loginOrRegister === 'login' ? 'Login' : 'Register'}</Heading>
        <Input 
          isInvalid={credentialError}
          width='70%'
          size = 'lg'
          alignItems='center'
        >
          <Icon as={Mail} size='lg' marginLeft={4}/>
          <InputField
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
          />
        </Input>
        <Input
          isInvalid={credentialError}
          width='70%'
          size = "lg"
          alignItems='center'
        >
          <Icon as={Lock} size='lg' marginLeft={4}/>
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={true}
          />
        </Input>
        <Button
          onPress={handleLoginOrRegister}
          bgColor='$orange500'
          width='70%'
          size='lg'
        >
          <Text color='black' fontWeight='$bold'>
            {loginOrRegister === 'login' ? 'Login' : 'Register'}
          </Text>
        </Button>
        <Text>
          {loginOrRegister === 'login' ? 'Don\'t have an account? ' : 'Already have an account? '}
          <Text
            onPress={() => setLoginOrRegister(loginOrRegister === 'login' ? 'register' : 'login')}
            color='blue'
          >
            {loginOrRegister === 'login' ? 'Register' : 'Login'}
          </Text>
        </Text>
      </Center>
    </Animated.View>
  );
}