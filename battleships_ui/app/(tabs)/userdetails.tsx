import React from "react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import {
    Center,
    Heading,
    Text,
    Button,
    Icon,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated } from "react-native";
import { User } from "lucide-react-native";
import { useRouter } from "expo-router";
import BackButton from "@/components/navigation/BackButton";

const UserDetails = () => {
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [gamesWon, setGamesWon] = useState(0);
    const [gamesLost, setGamesLost] = useState(0);
    const [currentlyPlayingGames, setCurrentlyPlayingGames] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const progress = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0)).current;
    const router = useRouter();

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
    const getUserDetails = async () => {
        const accessToken = await getToken();
        try {
            const response = await axios.get("http://163.172.177.98:8081/user/details/me",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response.data);
            if (response) {
                setId(response.data.user.id);
                setEmail(response.data.user.email);
                setGamesPlayed(response.data.gamesPlayed);
                setGamesWon(response.data.gamesWon);
                setGamesLost(response.data.gamesLost);
                setCurrentlyPlayingGames(response.data.currentlyGamesPlaying);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUserDetails();

        Animated.spring (progress, {
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
            <BackButton path='/explore'/>
            <Animated.View style={{ opacity: progress, transform: [{ scale }] }}>
                <Center
                    width="100%"
                    height="100%"
                    gap={20}
                >
                    <Center width='70%' bgColor='$orange500' padding={15} borderRadius={15}>
                        <Heading fontSize={30} marginBottom={20}>{email}</Heading>
                        <Center width='auto' height='auto' borderRadius={50} padding={3} bgColor='black'>
                            <Icon as={User} size={100} color="white" />
                        </Center>
                        <Text fontSize={15} marginTop={20} color='black'>User ID: {id}</Text>
                    </Center>
                    <Center width='70%' height='auto' flexDirection="row" flexWrap='wrap' gap={10}>
                        <Center width={130} height={130} bgColor='$orange500' borderRadius={15}>
                            <Text color='black'>Games Played</Text>
                            <Text color='black'>{gamesPlayed}</Text>
                        </Center>
                        <Center width={130} height={130} bgColor='$orange500' borderRadius={15}>
                            <Text color='black'>Games Won</Text>
                            <Text color='black'>{gamesWon}</Text>
                        </Center>
                        <Center width={130} height={130} bgColor='$orange500' borderRadius={15}>
                            <Text color='black'>Games Lost</Text>
                            <Text color='black'>{gamesLost}</Text>
                        </Center>
                        <Center width={130} height={130} bgColor='$orange500' borderRadius={15}>
                            <Text color='black'>Currently Playing</Text>
                            <Text color='black'>{currentlyPlayingGames}</Text>
                        </Center>
                    </Center>
                </Center>
            </Animated.View>
        </>
    );

};

export default UserDetails;