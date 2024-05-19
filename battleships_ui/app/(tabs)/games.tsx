import React from 'react';
import {
    View,
    Text,
    Button,
    Center,
    ScrollView,
    Accordion,
    AccordionItem,
    AccordionIcon,
    AccordionTrigger,
    AccordionTitleText,
    AccordionHeader,
    AccordionContent,
    AccordionContentText,
    Icon,
    set,
} from '@gluestack-ui/themed';
import { Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import BackButton from '@/components/navigation/BackButton';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';

interface Game {
    id: number;
    status: string;
    player1Id: string;
    player2Id: string;
    playerToMoveId: string;
    player1: {
        id: string;
        email: string;
    };
    player2: {
        id: string;
        email: string;
    };
}

const Games = () => {
    const progress = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0)).current;
    const [games, setGames] = useState<Game[]>([]);
    const [PageSize, setPageSize] = useState(10);

    const getAccessToken = async () => {
        try {
            const response = await AsyncStorage.getItem('@token');
            if (response) {
                return response;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getAllGames = async (pageSize:number) => {
        const accessToken = await getAccessToken();
        try {
            const response = await axios.get('http://163.172.177.98:8081/game',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response) {
                if (response.data.games.slice(pageSize-10, pageSize).length > 0) {
                    setGames(response.data.games.slice(pageSize-10, pageSize));
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleArrowLeft = async () => {
        setPageSize((prevPageSize) => {
            const newSize = prevPageSize > 10 ? prevPageSize - 10 : 10;
            getAllGames(newSize);
            console.log(`PageSize after Arrow Left: ${newSize}`);
            return newSize;
        });
    };
    
    const handleArrowRight = async () => {
        setPageSize((prevPageSize) => {
            const newSize = prevPageSize + 10;
            getAllGames(newSize);
            console.log(`PageSize after Arrow Right: ${newSize}`);
            return newSize;
        });
    };

    useEffect(() => {
        Animated.spring(progress, {
            toValue: 1,
            useNativeDriver: true,
        }).start();

        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();

        getAllGames(PageSize);

        return () => {
            progress.setValue(0);
            scale.setValue(0);
        };
    }, []);

    return (
        <>
            <BackButton path='/explore'/>
            <Animated.View style={{ opacity: progress, transform: [{ scale }] }}>
                <SafeAreaView />
                <Center marginTop='23%' gap={30} flexDirection='row'>
                    <Button bgColor='$orange500' width='auto' height='auto' padding={10} borderRadius={15} onPress={() => router.push('/createdgame')}>
                        <Text fontSize={20} color='black'>New Game</Text>
                    </Button>
                    <Button bgColor='$orange500' width='auto' height='auto' padding={10} borderRadius={15} onPress={() => router.push('/joingame')}>
                        <Text fontSize={20} color='black'>Join Game</Text>
                    </Button>
                </Center>
                <Center marginTop='5%' flexDirection='row' gap={50}>
                    <Button bgColor='$orange500' width='auto' height='auto' padding={5} borderRadius={15} onPress={handleArrowLeft}>
                        <Icon as ={ArrowLeft} color='black' size={20} />
                    </Button>
                    <Button bgColor='$orange500' width='auto' height='auto' padding={5} borderRadius={15} onPress={handleArrowRight}>
                        <Icon as ={ArrowRight} color='black' size={20} />
                    </Button>
                </Center>
                <Center marginTop='5%' width='100%' height='74%'>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Center>
                            {
                                games.map((game, index) => {
                                    if (game) {
                                        let player1: any = 'none'
                                        if (game.player1) {
                                            player1 = game.player1.email;
                                        }
                                        let player2: any = 'none'
                                        if (game.player2) {
                                            player2 = game.player2.email;
                                        }
                                        return (
                                            <View key={index} width='100%' height='auto' bgColor='white' elevation={10} shadowColor='$orange500' shadowOffset={{width: 2, height: 2}} borderRadius={10} marginTop={15} justifyContent='center' padding={20}>
                                                <Text color='black'>Game ID: {game.id}</Text>
                                                <Text color='black'>Game Status: {game.status}</Text>
                                                <Accordion>
                                                    <AccordionItem value='a'>
                                                        <AccordionHeader>
                                                            <AccordionTrigger>
                                                                {({ isExpanded }) => {
                                                                    return (
                                                                        <>
                                                                            <AccordionTitleText color='black'>Players</AccordionTitleText>
                                                                            {isExpanded ? (
                                                                                <AccordionIcon as={ArrowUp} color='black' />
                                                                            ) : (
                                                                                <AccordionIcon as={ArrowDown} color='black' />
                                                                            )}
                                                                        </>
                                                                    )
                                                                }}
                                                            </AccordionTrigger>
                                                        </AccordionHeader>
                                                        <AccordionContent>
                                                            <AccordionContentText color='black'>Player 1: {player1}</AccordionContentText>
                                                            <AccordionContentText color='black'>Player 2: {player2}</AccordionContentText>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            </View>
                                        );
                                    }
                                })
                            }
                        </Center>
                    </ScrollView>
                </Center>
            </Animated.View>
        </>
    );
}

export default Games;