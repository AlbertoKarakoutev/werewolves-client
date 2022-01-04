import React, { useEffect } from 'react';
import {useState} from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, Pressable, Dimensions} from 'react-native';
import { Modal, ModalContent, ScaleAnimation, BottomModal } from 'react-native-modals';
import { useNavigation } from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { fetchGames, lobbyLogin, deleteGameRequest } from '../../scripts/functions.js'
import rootStyle from "../style.js"
import Button from '../objects/Button.js'

const Join = () => {

    const [games, setGames] = useState([]);
    const [name, setName] = useState("");
    const [selectedGame, setSelectedGame] = useState("");

    const [modalVisible, setModalVisible] = useState(false)
    const [modalContent, setModalContent] = useState("")
    const [nameModalVisible, setNameModalVisible] = useState(false)

    const navigation = useNavigation();

    useEffect(() => {
        fetchGames().then(data => {
            if (validateResponse(data)) {     
                setGames(data.content)
            } 
        })
    }, [])

    const joinGame = (gameID) => {
        if (name == "") {   
            setModalContent("Please enter your username!");
            setModalVisible(true);
            return;
        }
        setNameModalVisible(false)
        lobbyLogin(name, gameID).then(data => {
            if (validateResponse(data)) {
                navigation.navigate('Lobby', {gameID:gameID, username:name});
            }
        })
    }

    const deleteGame = (gameID) => {
        deleteGameRequest(gameID).then(data => {
            if (validateResponse(data)) {
                setGames(games.filter((game) => game.id != gameID));
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
    
    const renderGames = () => {
        if (games.length == 0) {
            let margins = {
                textAlign:'center'
            }
            return <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}><Text style={{...rootStyle.text, ...margins}}>No active games!</Text></View>
        }
        return <FlatList style={styles.list} data={games} renderItem={({item, index}) => 
                    <Pressable onPress={() => {setSelectedGame(item.id); setNameModalVisible(true)}} style={styles.gameButton}>
                        <Text style={styles.gameButtonText}> {index+1}. ID: #{item.id}, ({item.players} Players active) </Text>
                        
                        <Pressable onPress={() => deleteGame(item.id)} style={styles.deleteButton}>
                        <FontAwesomeIcon 
                            icon={faTrashAlt}
                            color="#ff0000"
                            size={Dimensions.get('window').width / 12}/>
                        </Pressable>
                    </Pressable>
                }/>
    }

    return (
        <View style={rootStyle.container}>
            <Text h1 style={rootStyle.title}>Join Game</Text>

            {renderGames()}

            <Button onPress={() => navigation.navigate('Create')}>New Game</Button>
            <Button onPress={() => navigation.navigate('Welcome')}>Back</Button>

            <BottomModal
                visible={nameModalVisible}
                width={1}
                onTouchOutside={() => {
                    setNameModalVisible(false);
                }}
                onSwipeOut={() => {
                    setNameModalVisible(false);
                }}
            >
                <ModalContent style={rootStyle.bottomModal}>
                    <View>
                        <TextInput
                            style={rootStyle.input}
                            onChangeText={name => setName(name)}
                            value={name}
                            placeholder="Enter username..."
                        />
                    </View>
                    <Button onPress={() => joinGame(selectedGame)}>Login</Button>
                </ModalContent>
            </BottomModal>

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

export default Join;

const styles = StyleSheet.create({
    list:{
        height:"62%", 
        marginTop:0,
        backgroundColor:"#1b0d24",
        padding:5,
        borderRadius:5,
        //elevation:5,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,  
        borderColor:'white',
        borderWidth:0.3

    },
    gameButton:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        backgroundColor: "#9d0aff",
        borderRadius: 4,
        margin: 10,
        padding: 10
    },
    gameButtonText:{
        color: '#fff', 
        fontSize: Dimensions.get('window').width / 26
    },
    deleteButton:{
        borderRadius: 4,
        padding: 5,
        marginRight:0
    }
  });