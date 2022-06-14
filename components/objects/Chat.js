import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { FlatList, View, Text, TextInput, Pressable, Animated, Easing, Dimensions } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faChevronRight, faArrowCircleRight, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

import rootStyle from "../style.js"
import Button from '../objects/Button.js'
import { sendChatMessage } from '../../scripts/functions.js'

const Chat = ( props ) => {

    const sender = props.sender
    const data = props.data
    const gameID = props.gameId

    const [open, setOpen] = useState(true)
    const [notification, setNotification] = useState(false)
    const width = useRef(new Animated.Value(0)).current
    const [chatMessage, setChatMessage] = useState("")

    useEffect(() => {

    }, [notification, width])

    useEffect(() => {
        if (open) {
            setNotification(true)
        }
    }, [data])

    const toggleChat = () => {
        Animated.timing(
            width,
            {
                toValue: (open) ? 0.93 : 0,
                duration: 500,
                easing: Easing.bounce,
                useNativeDriver: false
            }
        ).start();
        setNotification(false)
        setOpen(!open)
    }

    const styles = {
        chat: {
            margin:'2%',
            flex: 1,
            marginLeft: 0,
            borderRadius:5,
            flexDirection: 'row',
        },
        chatModal: {
            margin:'2%',
            borderRadius:5,
            flexDirection: 'row',
            flex: 1.5
        },
        minimize: {
            backgroundColor: 'black',
            flexDirection: 'column',
            justifyContent: 'center',
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            overflow: 'visible',
            elevation: 5
        },
        chatMessages: {
            overflow: 'hidden',
            backgroundColor: '#1c0e24',
            borderTopLeftRadius:5,
            height: '100%',
            width: width.interpolate( {
                inputRange: [0, 0.96],
                outputRange: ['0%', '96%'],
            }),
            borderBottomLeftRadius:5,
        },
        chatMessage: {
            color: 'white',
            display: 'flex',
            backgroundColor: '#371d47',
            borderRadius:5,
            padding: '1%',
            margin: '2%',
            maxWidth: Dimensions.get('window').width * (60/100),
            minWidth: Dimensions.get('window').width * (30/100),
        },
        myChatMessage: {
            display: 'flex',
            backgroundColor: '#7a3da1',
            borderRadius:5,
            padding: '1%',
            margin: '1%',
            maxWidth: Dimensions.get('window').width * (60/100),
            minWidth: Dimensions.get('window').width * (30/100),
            marginLeft: 'auto',
            marginRight: '2%'
        },
        chatMessageText: {
            fontSize: 16,
            color: 'white',
            textAlign: 'left',
            marginRight: '5%'
        },
        chatSender: {
            fontSize: 10,
            color: 'white',
            textAlign: 'center'
        },
        chatTs: {
            fontSize: 10,
            color: '#777',
            textAlign: 'right'
        },    
        chatInput: {
            flexDirection: 'row',
            borderTopWidth: 1,
            borderColor: 'white',
            backgroundColor: '#371d47',
            justifyContent: 'space-around',
            width: Dimensions.get('window').width * (85/100),
            borderBottomLeftRadius: 5,
        },
        chatInputText: {
            width: '67%',
            fontSize: 16,
            color: 'white',
            paddingLeft: '2%',
        },
        chatInputBtn: {
            padding: "3%",
            backgroundColor: '#9d0aff',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5
        },
        notification: {
            position: 'absolute',
            top: 20,
            left: 10,
            marginBottom: 20
        }
    }

    return(
        <View style={(data.type === 'day') ? styles.chat : styles.chatModal}>
            <Animated.View style={styles.chatMessages}>

                <Text style={{...rootStyle.centeredText, ...{width: Dimensions.get('window').width * (30/100)}}}>Day {data.cycle} Chat</Text>
                <FlatList inverted keyExtractor={item => String(data.messages.indexOf(item))} data={data.messages} contentContainerStyle={{ justifyContent: 'flex-end' }} style={{width: Dimensions.get('window').width * (85/100)}} renderItem={ ({item, index}) => 
                    <View style={(item.sender == sender) ? styles.myChatMessage : styles.chatMessage}>
                        <Text style={styles.chatSender}> {item.sender} </Text>
                        <Text style={styles.chatMessageText}> {item.message} </Text>
                        <Text style={styles.chatTs}> {item.ts} </Text>
                    </View>
                }/>
                <View style={styles.chatInput}>
                    <TextInput
                        onChangeText={message => setChatMessage(message)}
                        style={styles.chatInputText}
                        value={chatMessage}
                        multiline={true}
                        placeholder="Enter message..."
                        placeholderTextColor="#999"/>
                    <Button style={styles.chatInputBtn} onPress={() => {
                        if (chatMessage !== '') {
                            sendChatMessage(gameID, data.id, sender, chatMessage)
                            setChatMessage("")
                        }
                    }}>
                        <FontAwesomeIcon 
                            icon={faArrowCircleRight}
                            size={35}
                            color={'white'}/>
                    </Button>
                </View>
            </Animated.View>
               
            <Pressable onPress={toggleChat} style={styles.minimize}>
                {(notification)
                    ? <FontAwesomeIcon icon={faExclamationCircle} size={35} color={'red'} style={styles.notification}/>
                    : <Text/>
                }
                <FontAwesomeIcon 
                    icon={(!open) ? faChevronLeft : faChevronRight}
                    size={30}
                    color={'white'}
                    style={{borderColor:'white', shadowColor:"white", borderRadius:25}}/>
            </Pressable>
        </View>
    )
}

export default Chat;