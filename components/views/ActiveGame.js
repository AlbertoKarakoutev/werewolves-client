import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, ActivityIndicator } from 'react-native';

import { BottomModal, Modal, ModalContent, ScaleAnimation } from 'react-native-modals';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import rootStyle from "../style.js"
import Button from '../objects/Button.js'
import Chat from '../objects/Chat.js'
import Vote from '../objects/Vote.js'
import MessageModal from '../objects/MessageModal.js'
import MultipleWakeModal from '../objects/MultipleWakeModal.js'
import host from '../../scripts/host.js';
import { loggedIn, setReadyToSleep, answer } from '../../scripts/functions.js'
import { set } from 'react-native-reanimated';

const ActiveGame = ({route}) => {

    const { gameID } = route.params;
    const { username } = route.params;

    const navigation = useNavigation();

    const [roles, setRoles ] = useState({active: {sprite: "", name: ""}, passive: {sprite: "", name: ""}});
    
    const [day, setDay] = useState(false)
    const [summary, setSummary] = useState({})

    const [notificationModalVisible, setNotificationModalVisible] = useState(false)
    const [notificationModalContent, setNotificationModalContent] = useState("")
    const [notificationQueue, setNotificationQueue] = useState([])
    const [messageQueue, setMessageQueue] = useState([])
    const [questionModalVisible, setQuestionModalVisible] = useState(false)
    const [questionModalContent, setQuestionModalContent] = useState({question: "", active:  false})
    const [multipleWakeModalVisible, setMultipleWakeModalVisible] = useState(false)
    const [multipleWakeModalContent, setMultipleWakeModalContent] = useState({chat: {}, vote: {}, message: "", targetCount: 0, voter: ""})
    const [sleepBtnVisible, setSleepBtnVisible] = useState(false)

    const [awokenRole, setAwokenRole] = useState("")

    const [dayChat, setDayChat] = useState({id:"0", messages:[], cycle: 0})
    const [votes, setVotes] = useState({day: {id: 0}, ww: {}, vamp: {}})
    const [players, setPlayers] = useState([])

    console.log(multipleWakeModalContent)

    let sock = new SockJS(`${host}/handshake`);
    let stompClient = Stomp.over(sock);

    useEffect(() => {

        loggedIn(username, gameID).then(loggedInData => validateResponse(loggedInData))

        const onMessageReceived = (payload) => {
            const message = JSON.parse(payload.body);
            
            if (!validateResponse(message)) {
                return
            } 

            if(message.type === 'DISCONNECT') {
                if(message.content.player !== username){
                    setNotificationQueue(q => [...q, message.content.player + " has disconnected!"])
                }
            
            } else if (message.type === 'NOTIFY') {
                setNotificationQueue([...notificationQueue, message.content.message])
            } else if (message.type === 'WAKE') {
                setAwokenRole(message.content.awokenRole)
                const list = (message.content.list === undefined) ? [] : message.content.list;
                const count = (message.content.targetCount === undefined) ? 0 : message.content.targetCount;
                const awokenRole = message.content.awokenRole
                let messageObj = {message: message.content.message, targetList: list, targetCount: count, awokenRole: awokenRole}
                setMessageQueue(q => [...q, messageObj])
            } else if (message.type === 'CHAT') {
                let newMessages = message.content.messages
                newMessages.reverse()
                if (message.content.type === "ww" || message.content.type === "vamp") {
                    let newContent = {
                        chat: message.content,
                        message: {...multipleWakeModalContent.message},
                        targetCount: {...multipleWakeModalContent.targetCount},
                        vote: {...multipleWakeModalContent.vote},
                        voter: {...multipleWakeModalContent.voter}
                    }
                    setMultipleWakeModalContent(c => ({
                        chat: message.content,
                        message: c.message,
                        targetCount: c.targetCount,
                        vote: c.vote,
                        voter: c.voter
                    }))
                } else if (message.content.type === "day") {
                    setDayChat({
                        id: message.content.id,
                        messages: newMessages,
                        type: message.content.type,
                        cycle: message.content.cycle
                    })
                }
            } else if (message.type === 'DAY') {
                setDay(true)
                setSummary(message.content.summary)
                setPlayers(message.content.players)
                setDayChat({ id: message.content.chat, cycle: message.content.cycle })
                setVotes({day: message.content.vote, ww: {}, vamp: {}})
                setSleepBtnVisible(true)

                let summaryStr = "SUMMARY\n\n"
                summaryStr += "Dead: " + ((message.content.summary.dead.length == 0) ? 'No one' : message.content.summary.dead) + "\n"
                summaryStr += "Hagged: " + ((message.content.summary.hagged === undefined) ? 'No one' : message.content.summary.hagged) + "\n"
                summaryStr += "Silenced: " + ((message.content.summary.silenced == undefined) ? 'No one' : message.content.summary.silenced) + "\n"
                summaryStr += "Troublemaker: " + ((message.content.summary.troublemaker === undefined) ? 'No one' : message.content.summary.troublemaker) + "\n"

                if (message.content.summary.dead.includes(username)) {
                    alert("You have been killed!")
                    logout()
                } else {
                    setNotificationQueue(q => [...q, message.content.message, summaryStr])
                }
        
            } else if (message.type === 'NIGHT') {
                setDay(false)
                setNotificationQueue([...notificationQueue, message.content.message])
            } else if (message.type === 'ROLES') {
                let roles = {
                    active: JSON.parse(message.content.active),
                    passive: JSON.parse(message.content.passive)
                }
                setRoles(roles)
            } else if (message.type === 'QUESTION') {
                setQuestionModalContent(message.content)
                setQuestionModalVisible(true)
            } else if (message.type === 'VOTE') {
                setVotes({day: message.content, ww: {}, vamp: {}})
            } else if (message.type === 'LYNCH') {
                const lynchMessage = `Player ${message.content.lynched} has been lynched.`
                setNotificationQueue(q => [...q, lynchMessage])
                if (message.content.lynched === username) {
                    logout();
                }
            } else if (message.type === 'WAKE_MULTIPLE') {
                setMultipleWakeModalContent(message.content)
                setMultipleWakeModalVisible(true)
            } else if (message.type === 'HIDE_WAKE_MULTIPLE') {
                setMultipleWakeModalVisible(false)
            }
        }
    
        const onConnected = () => {
            stompClient.subscribe(`/topic/game/${gameID}`, onMessageReceived)
            stompClient.send(`/app/game/subscribe/${gameID}`,
                {},
                JSON.stringify({sender: username, type: 'CONNECT'})
            )
            stompClient.subscribe(`/topic/game/${gameID}/${username}`, onMessageReceived)
            stompClient.send(`/app/game/subscribe/${gameID}/${username}`,
                {},
                JSON.stringify({sender: username, type: 'CONNECT'})
            )
    
        } 
        
        stompClient.debug = () => {}
        stompClient.connect({}, onConnected, () => {} )
    }, [])

    useEffect(() => {
        if (!notificationModalVisible) {
            showNextNotification()
        }
    }, [notificationQueue])

    useEffect(() => {
    }, [multipleWakeModalContent, dayChat, messageQueue])

    const showNextNotification = () => {
        if (notificationQueue.length > 0) {
            setNotificationModalContent(notificationQueue[0]);
            let newNotificationQueue = notificationQueue;
            newNotificationQueue.shift()
            setNotificationQueue(newNotificationQueue)
            setNotificationModalVisible(true)
        } else {
            setNotificationModalVisible(false)
        }
    }

    const readyToSleep = () => {
        setReadyToSleep(gameID, username).then(data => {
            validateResponse(data)
        })
    }

    const validateResponse = (data) => {
        if (data.type == "ERROR") {
            console.log("Validation error!", `Error ${data.content.code}: ${data.content.error}!`)
            setNotificationQueue(q => [...q, `Error ${data.content.code}: ${data.content.error}!`])
            return false
        }
        return true
    }

    const logout = () => {
        if(stompClient !== null && stompClient !== undefined){
            stompClient.unsubscribe();
            stompClient.send(`/app/game/users/loMessageUtil.emptyMessage().without/${gameID}`,{},JSON.stringify({sender: username, type: 'DISCONNECT'}))
            navigation.navigate("Join");
        }
    }

    return (
        <View style={rootStyle.container}>
            <View style={styles.cards} >
                <View style={styles.card}>
                    <Image style={styles.cardImage} source={{uri: 'data:image/jpeg;base64,' + roles.active.sprite}}/>
                    <Text style={styles.cardText}>{roles.active.name.replace("_", " ")}</Text>
                </View>
                <View style={styles.card}>
                    <Image style={styles.cardImage} source={{uri: 'data:image/jpeg;base64,' + roles.passive.sprite}}/>
                    <Text style={styles.cardText}>{roles.passive.name.replace("_", " ")}</Text>
                </View>
            </View>

            <View style={{flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '2%', marginBottom: 0}}>
                {(day && summary.silenced !== username && summary.hagged !== username) 
                    ? <Chat gameId={gameID} data={dayChat} height={'95%'} sender={username}/>
                    : <Text/>
                }
                <View style={styles.info}>
                    <View>
                        <Text style={rootStyle.text}>{(dayChat.cycle !== null) ? `Day: ${dayChat.cycle}` : ""}</Text>
                        <Text style={rootStyle.text}>{(players.length != 0) ? `Remaining players: ${players}` : ""}</Text>
                    </View>
                    {(day && summary.hagged !== username) 
                        ? <Vote gameID={gameID} voter={username} data={votes.day} targetCount={1}/>
                        : <Text/>
                    }
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button visible={sleepBtnVisible} style={{...rootStyle.button, ...{ width: '70%' }}} onPress={() => {
                            readyToSleep()
                            setSleepBtnVisible(false)
                        }}>Sleep</Button>
                        {(!sleepBtnVisible && day) ? <ActivityIndicator size={Dimensions.get('window').width / 5} color="#69237d"/> : <Text/>}
                        <Button style={{...rootStyle.button, ...{ width: '17%', aspectRatio: 1}}} onPress={logout}><FontAwesomeIcon icon={faSignOutAlt} color="#ff0000" size={30}/></Button>
                    </View>
                </View>
            </View>


            <Modal
                style={rootStyle.modal} 
                visible={notificationModalVisible} 
                onTouchOutside={() => {
                    showNextNotification();
                }}
                modalAnimation={new ScaleAnimation()}>
                    <ModalContent>
                        <Text style={rootStyle.smallDisabledText}>{notificationModalContent}</Text>
                    </ModalContent>
            </Modal>

            <MessageModal gameID={gameID} messageQueue={messageQueue}/>
            
            <MultipleWakeModal 
                username={username}
                gameID={gameID} 
                data={multipleWakeModalContent}
                visible={multipleWakeModalVisible}
            />

            <BottomModal
                visible={questionModalVisible}
                width={1}
                onTouchOutside={() => {
                    set;
                }}
            >
                <ModalContent style={rootStyle.bottomModal}>
                    <Text style={rootStyle.text}>{questionModalContent.question}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Button 
                            style={{...rootStyle.button, ...{flex: 1}}} 
                            onPress={() => {
                                answer(gameID, username, (questionModalContent.active) ? roles.active.name : roles.passive.name, true).then(data => {
                                    validateResponse(data)
                                })
                                setQuestionModalVisible(false)
                            }}>
                                YES
                        </Button>
                        <Button 
                            style={{...rootStyle.button, ...{flex: 1}}} 
                            onPress={() => {
                                answer(gameID, username, (questionModalContent.active) ? roles.active.name : roles.passive.name, false).then(data => {
                                    validateResponse(data)
                                })
                                setQuestionModalVisible(false)
                            }}>
                                NO
                        </Button>
                    </View>
                </ModalContent>
            </BottomModal>

        </View>
    )

}

export default ActiveGame;

const styles = {
    cards: {
       display:'flex',
       position: 'relative',
       flexDirection: 'row',
       justifyContent: 'space-evenly',
       alignItems: 'center',
       height: '38%',
       borderBottomColor: 'white',
       borderBottomWidth: 1,
       paddingBottom: 10,
    },
    card: {
        aspectRatio: 0.7,
        maxWidth: '40%',
        height: '84%',
        shadowColor: 'white',
        shadowRadius: 20,
        textAlign: 'center'
    },
    cardImage: {
        width: '100%',
        height: '98%',
        borderRadius: 10,
        margin: '2%'
    },
    cardText: {
        fontSize: Dimensions.get('window').width / 20, 
        color: 'white', 
        textAlign: 'center',
        position: 'relative'
    },
    titles: {
        display:'flex',
        position:'relative',
        flexDirection:'row',
        marginBottom:'auto',
        justifyContent:'space-between',
        alignItems:'center',
        height:'10%',
        backgroundColor:'red'
    },
    modal: {
        height:"70%",
        backgroundColor:'white',
        borderRadius:15
    },
    target: {
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
    },
    list: {
        flex: 1
    },
    info: {
        width: Dimensions.get('window').width / 1.2,
        position: 'relative',
        height: '94%',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
}
