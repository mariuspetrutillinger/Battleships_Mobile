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
    Input,
    InputField,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated } from "react-native";
import { useToast } from "@gluestack-ui/themed";
import BackButton from "@/components/navigation/BackButton";

interface JoinGame {
    id: string;
    player1Id: string;
    player2Id: string;
} 


const JoinGame = () => {
    const [token, setToken] = useState("");
    const [game, setGame] = useState<JoinGame | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [joinId, setJoinId] = useState('');
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

    const joinGame = async () => {
        const accessToken = await getToken();
        console.log(accessToken);
        console.log(joinId);
        try {
            const response = await fetch(`http://163.172.177.98:8081/game/join/${joinId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            console.log(data);
            if (response) {
                setGame(data);
                toast.show({
                    placement: "bottom left",
                    render: ({ id }) => {
                        const toastId = "toast-" + id
                        return (
                            <SafeAreaView>
                                <Toast nativeID={toastId} action="attention" variant="solid">
                                    <VStack space="xs">
                                        <ToastTitle>Game join succesful</ToastTitle>
                                    <ToastDescription>
                                        Your game has been joined successfully.
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

    const handleJoinIdChange = (joinId: string) => {
        setJoinId(joinId);
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
        <>
            <BackButton path='/games'/>
            <Animated.View style={{ opacity: progress, transform: [{ scale }] }}>
                <SafeAreaView />
                <Center width='100%' height='100%'>
                    <Heading>Join Game</Heading>
                    <Text>Enter game ID:</Text>
                    <Input
                        width='70%'
                        size = 'lg'
                        alignItems='center'
                    >
                        <InputField
                            placeholder="Game Id"
                            value={joinId}
                            onChangeText={handleJoinIdChange}
                        />
                    </Input>
                    <Button bgColor='$orange500' width='auto' height='auto' padding={5} borderRadius={15} marginTop={10} marginBottom={20} onPress={joinGame}>
                        <Text fontSize={20} color='black'>Join Game</Text>
                    </Button>
                    <Text>Joined game ID: {game?.id}</Text>
                    <Text>Player 1: {game?.player1Id}</Text>
                    <Text>Player 2: {game?.player2Id}</Text>
                </Center>
            </Animated.View>
        </>
    );

}

export default JoinGame;