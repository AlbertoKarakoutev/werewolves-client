import React from 'react';
import { useState, useEffect } from 'react';
import { FlatList, View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalContent, ScaleAnimation } from 'react-native-modals';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import Button from '../objects/Button.js'

import { readyRequest } from '../../scripts/functions.js'
import host from '../../scripts/host.js';
import rootStyle from "../style.js"

const Lobby = ({ route }) => {
    
    const { gameID } = route.params;
    const { username } = route.params;

    const navigation = useNavigation();

    const [playerReady, setPlayerReady] = useState(false);
    const [players, setPlayers] = useState([]);

    const [modalVisible, setModalVisible] = useState(false)
    const [modalContent, setModalContent] = useState("")

    const sock = new SockJS(`${host}/handshake`);
    const stompClient = Stomp.over(sock);

    useEffect(() => {
        
        let publicSubscription;
        let privateSubscription;

        const onMessageReceived = (payload) => {
            const message = JSON.parse(payload.body);
            if (message.type === 'CONNECT' || message.type === 'DISCONNECT') {
                setPlayers(message.content);
            } else if(message.type === 'GAME_BEGIN') {
                publicSubscription.unsubscribe();
                privateSubscription.unsubscribe();
                navigation.navigate('ActiveGame', { 
                    rootStyle:rootStyle, 
                    gameID:gameID, 
                    username:username
                });
            } else if(message.type === 'READY') {
                setPlayers(message.content);

            } else if(message.type ==='ERROR') {
                setModalContent(`Error ${message.error.code}: ${message.content.error}!`);
                setModalVisible(true);
            } 
        }

        const onConnected = () => {
            publicSubscription = stompClient.subscribe(`/topic/lobby/${gameID}`, onMessageReceived)
            stompClient.send(`/app/lobby/subscribe/${gameID}`,
                {},
                JSON.stringify({sender: username, type: 'CONNECT'})
            )
            privateSubscription = stompClient.subscribe(`/topic/lobby/${gameID}/${username}`, onMessageReceived)
            stompClient.send(`/app/lobby/subscribe/${gameID}/${username}`,
                {},
                JSON.stringify({sender: username, type: 'CONNECT'})
            )
        }

        stompClient.debug = () => {};
        stompClient.connect({}, onConnected, () => {} )
    }, [])

    useEffect(() => {
    }, [players])

    const logout = () => {
        if(stompClient !== null && stompClient !== undefined){
            stompClient.unsubscribe();
            stompClient.send(`/app/lobby/logout/${gameID}`,{},JSON.stringify({sender: username, type: 'DISCONNECT'}))
            navigation.goBack();
        }
    }

    const ready = () => {

        readyRequest(username, gameID).then(data => {
            if (validateResponse(data)) {
                setPlayerReady(true)
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
            <Text style={rootStyle.title}>Waiting for players...</Text>
            {/* <ActivityIndicator size={Dimensions.get('window').width / 5} color="#69237d"/> */}
            <FlatList keyExtractor={(item, index) => index.toString()} style={{flex:1}} data={players} renderItem={({item, index}) => 
                    <View style={styles.player}>
                        <Text id={index} style={rootStyle.text}> {index+1}.    {item["name"]}</Text> 
                        <FontAwesomeIcon 
                            icon={item["ready"] === 'true' ? faCheckSquare : faTimesCircle}
                            color={item["ready"] === 'true' ? "lime" : "#ff0000"}
                            size={Dimensions.get('window').width / 15}
                            style={{borderColor:'white', shadowColor:"black",borderRadius:25, elevation:10}}/>
                    </View>
            }/>
            <View>
                <Button disabled={playerReady} onPress={ready}>Ready</Button>
                <Button onPress={logout}>Exit</Button>
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

export default Lobby;

const styles = {
    disabledButton:{
        alignItems: 'center',
        justifyContent: 'center',
        color:'#000',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius:5,
        backgroundColor:'#471854',
        margin:10,
        marginTop:50
    },
    player:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        backgroundColor: "#9d0aff",
        borderRadius: 4,
        margin: 10,
        marginTop:0,
        padding: 10,
        borderColor:'white',
        borderWidth:0.5
    }
}
