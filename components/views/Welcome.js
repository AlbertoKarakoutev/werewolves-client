import React from 'react';
import { Text, View } from 'react-native';
import { Modal, ModalContent, ScaleAnimation } from 'react-native-modals';
import {useState} from 'react';
import host from '../../scripts/host.js';
import rootStyle from "../style.js"
import Button from '../objects/Button.js'
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {

    const [modalVisible, setModalVisible] = useState(false)

    const navigation = useNavigation();

    const createGameWithServerCheck = async () => {
        let res = await fetch(`${host}/ping`).catch((error) => {
            setModalVisible(true);
        });
        if(res === undefined) return;
        navigation.navigate('Create')
    }

    const joinGameWithServerCheck = async () => {
        let res = await fetch(`${host}/ping`).catch((error) => {
            setModalVisible(true);
        });
        if(res === undefined) return;
        navigation.navigate('Join')
    }

    const exit = async () => {
        setModalVisible(false);
    }

    return (
        <View style={rootStyle.container}>
            <Text h1 style={rootStyle.title}>Welcome!</Text>

            <Button onPress={createGameWithServerCheck}>Create Game</Button>
            <Button onPress={joinGameWithServerCheck}>Join Game</Button>
            <Button onPress={() => navigation.navigate('HowTo')}>Help</Button>
            <Button onPress={exit}>Exit</Button>
            
            <Modal 
                style={rootStyle.modal} 
                visible={modalVisible} 
                onTouchOutside={() => {
                    setModalVisible(false);
                }}
                modalAnimation={new ScaleAnimation()}>
                    <ModalContent>
                        <Text style={rootStyle.textSmall}>No connection to the game servers!</Text>
                    </ModalContent>
            </Modal>
            
        </View>
    )
}

export default Welcome