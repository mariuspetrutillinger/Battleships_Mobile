import React from 'react';
import { useState, useEffect } from 'react';
import {
    Text,
    Center,
    View,
    FlatList,
    Pressable,
	ScrollView,
    Button
} from '@gluestack-ui/themed';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/navigation/BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Ship {
    x: string;
    y: number;
    size: number;
    direction: string;
}

interface Move {
    x: string;
    y: number;
    result: boolean;
    playerId: string;
}

interface Game {
    status: string;
    moves: Move[];
    playerToMove: number;
}

const GameBoard = () => {
    const [game, setGame] = useState<Game>({status: '', moves: [], playerToMove: 0});
    const [ships, setShips] = useState<Ship[]>([]);
    const [pressedCells, setPressedCells] = useState<Record<string, string>>({});
	const [orientation, setOrientation] = useState('vertical');
    const [number, setNumber] = useState('2');
    const rows = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i)); // ['A', 'B', 'C', ..., 'J']
    const columns = Array.from({ length: 10 }, (_, i) => (i + 1).toString()); // ['1', '2', '3', ..., '10']
    const data = rows.flatMap(row => columns.map(column => ({ row, column })));

	const renderItem = ({ item }: { item: any }) => (
		<View width={40} height={40} justifyContent='center' alignContent='center' borderWidth={1} borderColor='black' bgColor={pressedCells[`${item.row}${item.column.toString()}`]}>
			<Pressable bgColor='transparent' width='100%' height='100%' onPress={() => handlePress(item.row, item.column)}>
				<Text>{item.row}{item.column}</Text>
			</Pressable>
		</View>
	);

	const handlePress = (row: string, column: string) => {
		const color = '$orange500';
		let newPressedCells = { ...pressedCells };
		let newShipCells: string[] = [];
		
		if (orientation === 'horizontal') {
			const startColumn = parseInt(column);
			const endColumn = Math.min(startColumn + parseInt(number)-1, 10); // Don't go past the 10th column
	
			for (let i = startColumn; i <= endColumn; i++) {
				newPressedCells[`${row}${i}`] = color;
				newShipCells.push(`${row}${i}`);
			}
		} else if (orientation === 'vertical') {
			const startRow = row.charCodeAt(0) - 65; // Convert 'A' to 0, 'B' to 1, etc.
			const endRow = Math.min(startRow + parseInt(number)-1, 9); // Don't go past the 10th row
	
			for (let i = startRow; i <= endRow; i++) {
				const currentRow = String.fromCharCode(65 + i); // Convert 0 to 'A', 1 to 'B', etc.
				newPressedCells[`${currentRow}${column}`] = color;
				newShipCells.push(`${currentRow}${column}`);
			}
		} else {
			newPressedCells[`${row}${column}`] = color;
			newShipCells.push(`${row}${column}`);
		}
	
		const newShip: Ship = {
			x: row,
			y: parseInt(column),
			size: parseInt(number),
			direction: orientation.toUpperCase()
		};

		setPressedCells(newPressedCells);
		setShips(prevShips => [...prevShips, newShip]);
	}

    const clearBoard = () => {
        setPressedCells({});
        setShips([]);
    };

    const getGameId = async (): Promise<string | null> => {
        try {
            const value = await AsyncStorage.getItem('@gameId');
            return value;
        } catch (error) {
            console.error('Error getting gameId from AsyncStorage:', error);
            return null;
        }
    }

    const getToken = async (): Promise<string | null> => {
        try {
            const value = await AsyncStorage.getItem('@token');
            return value;
        } catch (error) {
            console.error('Error getting token from AsyncStorage:', error);
            return null;
        }
    }

    const getGame = async () => {
        const gameId = await getGameId();
        const token = await getToken();
        try {
            const response = await fetch(`http://163.172.177.98:8081/game/${gameId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            setGame(data);
        }
        catch (error) {
            console.error(error);
        }
    }

    const submitShips = async () => {
        const gameId = await getGameId();
        const token = await getToken();
        try {
            const response = await fetch(`http://163.172.177.98:8081/game/${gameId}`, 
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ ships })
                });
            const data = await response.json();
            if (data.code === 400) {
                alert(data.message);
            }
            console.log(data);
        }
        catch (error) {
            console.error(error);
        }
    }       

    useEffect(() => {
        getGame();

        return () => {
            setGame({status: '', moves: [], playerToMove: 0});
            setShips([]);
            setPressedCells({});
            setOrientation('vertical');
            setNumber('2');
        }
    }, []);

    return (
        <>
            <SafeAreaView />
            <BackButton path='/games'/>
            <Center marginTop='20%' width='100%' height='60%'>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    numColumns={10}
                    keyExtractor={(item: any) => `${item.row}${item.column}`}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center'}}
                />
                <Center width='100%' height='auto' gap={20} flexDirection='row'>
					<View width={150} height={50} borderWidth={1} borderColor='$orange500'>
						<Picker
							selectedValue={orientation}
							onValueChange={(itemValue) => setOrientation(itemValue)}
						>
							<Picker.Item label="Vertical" value="vertical" />
							<Picker.Item label="Horizontal" value="horizontal" />
						</Picker>
					</View>
					<View width={150} height={50} borderWidth={1} borderColor='$orange500'>
						<Picker
							selectedValue={number}
							onValueChange={(itemValue) => setNumber(itemValue)}
						>
							<Picker.Item label="2" value="2" />
							<Picker.Item label="3" value="3" />
							<Picker.Item label="4" value="4" />
							<Picker.Item label="6" value="6" />
						</Picker>
					</View>
                </Center>
            </Center>
            <Center width='100%' height='10%' flexDirection='row' gap={20}>
                <Button bgColor='$orange500' width='auto' height='auto' padding={10} borderRadius={15} onPress={clearBoard}>
                    <Text fontSize={20} color='black'>Clear Board</Text>
                </Button>
                <Button bgColor='$orange500' width='auto' height='auto' padding={10} borderRadius={15} onPress={submitShips}>
                    <Text fontSize={20} color='black'>Submit Ships</Text>
                </Button>
            </Center>
            <Center width='100%' height='14%' flexDirection='row'>
				<ScrollView width='100%' height='100%' borderWidth={1} borderColor='$orange500' horizontal gap={20}>
					{
						ships.map((ship, index) => (
							<View key={index} width={200} height={100} borderWidth={1} borderColor='black' borderRadius={15} padding={10} margin={10}>
								<Text>Ship {index + 1}:</Text>
                                <Text>Location: {ship.x}{ship.y}</Text>
								<Text>Direction: {ship.direction}</Text>
								<Text>Size: {ship.size}</Text>
							</View>
						))
					}
				</ScrollView>
			</Center>
        </>
    );

}

export default GameBoard;