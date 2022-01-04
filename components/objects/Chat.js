import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { FlatList, View, Text, TextInput, Pressable, Animated, Easing, Dimensions } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faChevronRight, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'

import rootStyle from "../style.js"
import Button from '../objects/Button.js'
import { sendChatMessage } from '../../scripts/functions.js'

const Chat = ( props ) => {

    const sender = props.sender
    const height = (props.height !== null) ? props.height : '47%'
    const data = props.data
    const gameID = props.gameID

    const [open, setOpen] = useState(true)
    const width = useRef(new Animated.Value(0)).current
    const [chatMessage, setChatMessage] = useState("")

    useEffect(() => {

    }, [data, width])

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
        setOpen(!open)
    }

    const styles = {
        chat: {
            display: 'flex',
            margin:'2%',
            height: height,
            borderRadius:5,
            flexDirection: 'row'
        },
        minimize: {
            backgroundColor: 'black',
            flexDirection: 'column',
            justifyContent: 'center',
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            elevation: 5
        },
        chatMessages: {
            display: 'flex',
            overflow: 'hidden',
            backgroundColor: '#1c0e24',
            borderTopLeftRadius:5,
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
            backgroundColor: '#4e2866',
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
            display: 'flex',
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
        }
    }

    return(
        <View style={styles.chat}>
            <Animated.View style={styles.chatMessages}>

                <Text style={rootStyle.centeredText}>Day {data.cycle} Chat</Text>
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
                <FontAwesomeIcon 
                    icon={(!open) ? faChevronLeft : faChevronRight}
                    size={25}
                    color={'white'}
                    style={{borderColor:'white', shadowColor:"white",borderRadius:25}}/>
            </Pressable>
        </View>
    )
}

export default Chat;