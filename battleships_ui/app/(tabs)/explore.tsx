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
} from '@gluestack-ui/themed';
import { Animated } from 'react-native';
import { User, Gamepad, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { Dimensions } from 'react-native';
import BackButton from '@/components/navigation/BackButton';

export default function TabTwoScreen() {
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const buttonSize = Dimensions.get('window').width / 4;

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
    <>
      <Animated.View style={{ opacity: progress, transform: [{ scale }] }}>
        <Center width='100%' height='100%'>
          <Heading>Explore</Heading>
          <Center width='70%' flexDirection='row' gap={10} marginTop={20}>
            <Button bgColor='$orange500' flexDirection='column' width={buttonSize} height={buttonSize} justifyContent='center' alignItems='center' onPress={() => {router.push('/userdetails')}}>
              <Icon as={User} size={30} color='black' />
              <Text color='black'>Profile</Text>
            </Button>
            <Button bgColor='$orange500' flexDirection='column' width={buttonSize} height={buttonSize} justifyContent='center' alignItems='center' onPress={() => {router.push('/games')}}>
              <Icon as={Gamepad} size={30} color='black'/>
              <Text color='black'>Games</Text>
            </Button>
          </Center>
        </Center>
      </Animated.View>
    </>
  );
}

