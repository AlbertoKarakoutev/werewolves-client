import React, { useEffect } from 'react';
import {useState} from 'react';
import { View, Text, Dimensions } from 'react-native';

import { BottomModal, ModalContent } from 'react-native-modals';

import rootStyle from "../style.js"
import Chat from './Chat.js';
import Vote from './Vote.js'

const MultipleWakeModal = (props) => {

    const username = props.username
    const gameID = props.gameID
    const data = props.data
    const visible = props.visible

    useEffect(() => {

    }, [data, visible])

    const renderTitle = () => {
        if (data == undefined)
            return "undefined"
        if (data.chat.type === "ww") {
            return "Werewolves"
        } else {
            return "Vampires"
        }
    }

    return  (
        <BottomModal visible={visible} width={1} height={Dimensions.get('window').height / 1.1}>
            <ModalContent style={styles.modal}>
                {(Object.keys(data).length !== 0)
                    ? <View style={{flex: 1}}>
                        <Text style={{...rootStyle.centeredText, ...{fontSize:30}}}>- {renderTitle()} -</Text>
                        <Text style={{...rootStyle.centeredText, ...{fontSize: 10}}}>Team: {(data.team === undefined) ? " " : data.team.join(", ")}</Text>
                        <Text style={{...rootStyle.centeredText, ...{fontSize: 10}}}>Voter: {data.voter}</Text>
                        {(data.voter === username) 
                            ? <Vote voter={username} data={data.vote} gameID={gameID} targetCount={data.targetCount}/>
                            : <Text/>
                        }
                        <Chat sender={username} data={data.chat} gameId={gameID}/>
                    </View>
                    : <Text/>}
            </ModalContent>
        </BottomModal>
    )
}

export default MultipleWakeModal;

const styles = {
    modal:{
        backgroundColor: "#572b70",
        flexDirection:'column',
        justifyContent:'center',
        height: Dimensions.get('window').height / 1.1
    },
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