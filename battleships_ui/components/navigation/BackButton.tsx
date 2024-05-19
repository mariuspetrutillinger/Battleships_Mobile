import React from "react";
import {
    Button,
    Icon,
} from "@gluestack-ui/themed";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import PropType from "prop-types";

type BackButtonProps = {
    path: string;
};

const BackButton = (props: BackButtonProps) => {
    const router = useRouter();

    return (
        <Button onPress={() => router.push(props.path)} width={50} height={50} zIndex={10} position='absolute' top='5%' left='5%' bgColor='$orange500'>
            <Icon as={ArrowLeft} size='xl' color="white" />
        </Button>
    );
}

export default BackButton;