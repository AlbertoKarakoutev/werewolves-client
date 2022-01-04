import React, { useEffect } from 'react';
import {useState, useRef} from 'react';
import { FlatList, View, Text, Pressable, Image, Dimensions } from 'react-native';

import { BottomModal, ModalContent } from 'react-native-modals';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons'

import rootStyle from "../style.js"
import Button from '../objects/Button.js'
import { setTargetRequest, wokenUp } from '../../scripts/functions.js'

const MessageModal = (props) => {

    const messageQueue = props.messageQueue

    const [visible, setVisible] = useState(false)
    const [content, setContent] = useState("")
    const [target, setTarget] = useState(["", ""])

    const gameID = props.gameID
    const awokenRole = props.awokenRole
    const targetList = props.targetList
    const targetCount = props.targetCount

    const messageIndex = useRef(0)

    useEffect(() => {
        showNextMessage()

    }, [messageQueue])

    const renderByType = () => {

        const list = (number) => {
            return (
                <View style={{flexDirection: 'column', flex: 1, height: 200}}>
                    <Text style={rootStyle.smallText}>Target {number+1}</Text>
                    <FlatList style={styles.list} keyExtractor={(item, index) => index.toString()} data={targetList} renderItem={({item, index}) => 
                        <Pressable onPress={() => markTarget(item, number)} style={styles.target}>
                            <Text style={rootStyle.text}> {item} </Text>
                            {(target[number].includes(item)) ? <FontAwesomeIcon icon={faCheckSquare} color="#ff0000" size={40}/> : <Text></Text>}
                        </Pressable>
                    }/>
                </View>
            )
        }
        
        if (targetCount == 0) {
            return (
                <Text/>
            )
        } else if (targetCount === 1) {
            return (
                <View style={{flexDirection: 'row', display: 'flex'}}>
                    {list(0)}
                </View>
            )
        } else if (targetCount === 2) {
            return (
                <View style={{flexDirection: 'row', display: 'flex'}}>
                    {list(0)}
                    {list(1)}
                </View>
            )
        }
    }

    const showNextMessage = () => {
        if (messageQueue.length > messageIndex.current) {
            setContent(messageQueue[messageIndex.current]);
            messageIndex.current += 1;
            setVisible(true)
        } else {
            setVisible(false)
        }
    }

    const modalAction = () => {
        showNextMessage()
        if (targetList.length != 0) {
            const parsedTargets = (targetCount > 1) ? target[0] + "_" + target[1] : target[0];
            setTargetRequest(awokenRole, gameID, parsedTargets).then(data => {
                validateResponse(data)
            })
        } 
    }

    const validateResponse = (data) => {
        if (data.type == "ERROR") {
            console.log("Validation error: " + data.content.error)
            return false
        }
        return true
    }

    const markTarget = (targetName, targetPosition) => {
        let newTarget;
        if (targetPosition == 0) {
            if (target[1] !== targetName) {
                newTarget = [targetName, target[1]]
            } else {
                newTarget = [targetName, ""]
            }
        } else {
            if (target[0] !== targetName) {
                newTarget = [target[0], targetName]
            } else {
                newTarget = ["", targetName]
            }
        }

        setTarget(newTarget)
    }

    return  (
        <BottomModal visible={visible} width={1}>
            <ModalContent style={rootStyle.bottomModal}>
                <Text style={rootStyle.centeredText}>{content}</Text>
                {renderByType()}
                <Button onPress={modalAction}>{(targetList.length == 0) ? "OK" : "SEND"}</Button>
            </ModalContent>
        </BottomModal>
    )
}

export default MessageModal;

const styles = {
    target: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: "#9d0aff",
        borderColor:'white',
        borderWidth:1,
        borderTopWidth: 0,
    },
    list: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: '#1c0e24',
        margin: 2,
        padding: 2,
        height:100
    },
}