import React from "react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import {
    Center,
    Heading,
    Text,
    Button,
    Icon,
    ToastDescription,
    ToastTitle,
    VStack,
    SafeAreaView,
    Toast,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated } from "react-native";
import { useToast } from "@gluestack-ui/themed";
import BackButton from "@/components/navigation/BackButton";
import { router } from "expo-router";

interface CreatedGame {
    id: string;
    player1: {
        id: string;
        email: string;
    } | null;
    player2: {
        id: string;
        email: string;
    } | null;
} 


const CreatedGame = () => {
    const [token, setToken] = useState("");
    const [game, setGame] = useState<CreatedGame | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const progress = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0)).current;

    const toast = useToast();

    const getToken = async () => {
        try {
            const response = await AsyncStorage.getItem("@token");
            console.log(response);
            if (response) {
                setToken(response);
                return response;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const createGame = async () => {
        const accessToken = await getToken();
        console.log(accessToken);
        try {
            const response = await axios.post('http://163.172.177.98:8081/game',
            {},
            {
                headers: {
                    ContentType: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response.data);
            if (response) {
                AsyncStorage.setItem('@gameId', response.data.id);
                setGame(response.data);
                toast.show({
                    placement: "bottom left",
                    render: ({ id }) => {
                        const toastId = "toast-" + id
                        return (
                            <SafeAreaView>
                                <Toast nativeID={toastId} action="attention" variant="solid">
                                    <VStack space="xs">
                                        <ToastTitle>Game creation succesful</ToastTitle>
                                    <ToastDescription>
                                        Your game has been created successfully.
                                    </ToastDescription>
                                    </VStack>
                                </Toast>
                            </SafeAreaView>
                        )
                    },
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        createGame();

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
            <BackButton path='/games'/>
            <Animated.View style={{ opacity: progress, transform: [{ scale }] }}>
                <SafeAreaView />
                <Center width='100%' height='100%'>
                    <Heading>Create Game</Heading>
                    <Text>Game ID: {game?.id}</Text>
                    <Text>Player 1: {game?.player1?.email}</Text>
                    <Text>Player 2: {game?.player2?.email}</Text>
                    <Button bgColor='$orange500' marginTop='10%' width='auto' height='auto' padding={10} borderRadius={15} onPress={() => router.push('/gameboard')}>
                        <Text fontSize={20} color='black'>Go to board</Text>
                    </Button>
                </Center>
            </Animated.View>
        </>
    );

}

export default CreatedGame;