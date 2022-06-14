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
    const messageIndex = useRef(0)

    const [visible, setVisible] = useState(false)
    const [canCancel, setCanCancel] = useState(false)
    const [content, setContent] = useState("")
    const [targetList, setTargetList] = useState([])
    const [targetCount, setTargetCount] = useState(0)
    const [awokenRole, setAwokenRole] = useState("")
    const [target, setTarget] = useState(["", ""])
    const [targetBtnVisible, setTargetBtnVisible] = useState(false)

    const gameID = props.gameID

    useEffect(() => {

        if ((!visible && messageQueue.length > messageIndex.current+1) || messageQueue.length == 1) {
            showNextMessage()
        }
    }, [messageQueue])

    useEffect(() => {
    }, [visible])

    const renderByType = () => {
        if (targetCount == 0) {
            return (
                <Text/>
            )
        } else {
            return (
                <View style={{flexDirection: 'column', minHeight: 300}}>
                    <FlatList style={styles.list} keyExtractor={(item, index) => index.toString()} data={targetList} renderItem={({item, index}) => 
                        <Pressable onPress={() => markTarget(item)} style={styles.target}>
                            <Text style={rootStyle.text}> {item} </Text>
                            {(target.includes(item)) ? <FontAwesomeIcon icon={faCheckSquare} color="#ff0000" size={30}/> : <Text></Text>}
                        </Pressable>
                    }/>
                </View>
            )
        } 
    }

    const showNextMessage = () => {
        if (messageQueue.length > 1) {
            messageIndex.current += 1;
        }
        setContent(messageQueue[messageIndex.current].message);
        setCanCancel(messageQueue[messageIndex.current].canCancelTurn)
        setTargetList(messageQueue[messageIndex.current].targetList);
        setTargetCount(messageQueue[messageIndex.current].targetCount);
        setAwokenRole(messageQueue[messageIndex.current].awokenRole)
        setTargetBtnVisible(messageQueue[messageIndex.current].targetCount == 0)
        setVisible(true)
    }

    const modalAction = () => {
        if (targetList.length > 0) {
            if (targetCount == 1) {
                if (target[0] === undefined || target[0] === "") {
                    alert("Please select a target!")
                    return
                }
            } else if (targetCount == 2) {
                if ((target[0] === undefined || target[0] === "") && (target[1] === undefined || target[1] === "")) {
                    alert("Please select 2 targets!")
                    return
                }
            } 
        }

        if (messageQueue.length > messageIndex.current+1) {
            showNextMessage()
        } else {
            setVisible(false)
        }

        if (targetList.length > 0) {
            const parsedTargets = (targetCount > 1) ? target[0] + "_" + target[1] : target[0];
            setTargetRequest(awokenRole, gameID, parsedTargets).then(data => {
                validateResponse(data)
                setTarget([])
            })
        } else {
            wokenUp(gameID, awokenRole).then(data => {
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

    const markTarget = (targetName) => {
        if (messageQueue.length == 0) 
            return

        setTargetBtnVisible(true)
        let newTarget = [...target]
        if (newTarget.includes(targetName)) {
            let index = newTarget.indexOf(targetName)
            newTarget[index] = ""
        } else {
            if (newTarget[0] === "" || newTarget[0] === undefined) {
                newTarget[0] = targetName
            } else {
                if (targetCount > 1) {
                    newTarget[1] = targetName
                } else {
                    newTarget[0] = targetName
                }
                
            }
        }
        if (targetList.length > 0) {
            if (targetCount == 1) {
                if (newTarget[0] === undefined || newTarget[0] === "") {
                    setTargetBtnVisible(false)
                }
            } else if (targetCount == 2) {
                if (newTarget[0] === undefined || newTarget[0] === "" || newTarget[1] === undefined || newTarget[1] === "") {
                    setTargetBtnVisible(false)
                }
            }
        }

        if (awokenRole === 'WITCH') {
            setTargetBtnVisible(true)
        }

        setTarget(newTarget)
    }

    return  (
        <BottomModal visible={visible} width={1}>
            <ModalContent style={rootStyle.bottomModal}>
                <Text style={{...rootStyle.centeredText, ...{fontSize:30}}}>- {awokenRole.replace("_", " ")} -</Text>
                {(targetCount > 0)
                    ?
                        <View style={styles.targetLabels}>
                            <View style={styles.targetLabel}>
                                {(awokenRole === 'WITCH') ? <Text style={rootStyle.smallDisabledText}>HEAL</Text> : <Text style={rootStyle.smallDisabledText}>TARGET 1</Text>}
                                <Text style={rootStyle.centeredText}>{target[0]}</Text>
                            </View>
                            {(targetCount > 1)
                                ?  <View style={styles.targetLabel}>
                                        {(awokenRole === 'WITCH') ? <Text style={rootStyle.smallDisabledText}>KILL</Text> : <Text style={rootStyle.smallDisabledText}>TARGET 2</Text>}
                                        <Text style={rootStyle.centeredText}>{target[1]}</Text>
                                    </View>
                                : <></>
                            }
                            
                        </View>
                    : <Text/>
                }   
                <Text style={rootStyle.centeredText}>{content}</Text>
                {renderByType()}
                <Button visible={targetBtnVisible} onPress={modalAction}>{(targetList.length == 0) ? "OK" : "TARGET"}</Button>
                <Button visible={(targetCount != 0) && canCancel} onPress={() => {
                    wokenUp(gameID, awokenRole).then(data => {
                        validateResponse(data)
                    })

                    if (messageQueue.length > messageIndex.current+1) {
                        showNextMessage()
                    } else {
                        setVisible(false)
                    }
                }}>CANCEL TARGET</Button>
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
        padding: 5,
        margin: 2,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 3,
        alignItems: 'center',
        backgroundColor: "#9d0aff",
    },
    list: {
        borderRadius: 5,
        backgroundColor: '#1c0e24',
        margin: 2,
        padding: 2,
        height:100
    },
    targetLabels: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        background: 'red'
    },
    targetLabel: {
        display: 'flex',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 1,
        flex: 1,
        maxWidth: '40%',
        backgroundColor: '#1c0e24',
    }
}