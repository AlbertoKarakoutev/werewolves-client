import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { Modal, ModalContent, ScaleAnimation } from 'react-native-modals';
import { useNavigation } from '@react-navigation/native';
import { createGameRequest } from '../../scripts/functions.js'
import rootStyle from "../style.js"

const Create = () => {

    const [number, setNumber] = React.useState(null);

    const [modalVisible, setModalVisible] = useState(false)
    const [modalContent, setModalContent] = useState("")

    const navigation = useNavigation();

    const createGame = () => {
        if(number === null || number == 0){
            setModalContent("Please enter the number of players!");
            setModalVisible(true)
            return;
        }
        createGameRequest(number).then(data => {
            if (validateResponse(data)) {
                navigation.navigate("Join");
            }
        })
    }

    const validateResponse = (data) => {
        if (data.type == "ERROR") {
            setModalContent(`Error ${data.content.code}: ${data.content.error}!`);
            setModalVisible(true);
            return false
        }
        return true
    }

    return (
        <View style={rootStyle.container}>
            <Text style={rootStyle.title}>Create Game</Text>
            <TextInput
                style={styles.input}
                onChangeText={number => setNumber(number)}
                value={number}
                placeholder="Enter number of players..."
                placeholderTextColor="#999" 
                keyboardType="numeric"
                maxLength={2}
            />
            <View>
                <Pressable style={rootStyle.button} onPress={createGame}>
                    <Text style={rootStyle.text}>Create</Text>
                </Pressable>
                <Pressable style={rootStyle.button} onPress={() => navigation.navigate('Welcome')}>
                    <Text style={rootStyle.text}>Back</Text>
                </Pressable>
            </View>
            <Modal 
            style={rootStyle.modal} 
            visible={modalVisible} 
            onTouchOutside={() => {
                setModalVisible(false);
            }}
            modalAnimation={new ScaleAnimation()}>
                <ModalContent>
                    <Text style={rootStyle.textSmall}>{modalContent}</Text>
                </ModalContent>
            </Modal>

        </View>
    )
}

export default Create;

const styles = StyleSheet.create({
    input: {
        height: 60,
        fontSize: 25,
        textAlign:'center',
        margin: 12,
        borderWidth: 1,
        borderColor: '#999',
        fontStyle: 'italic',
        color:'white'
    },
    modal: {
        height:"70%",
        backgroundColor:'white',
        borderRadius:15
    }
  });