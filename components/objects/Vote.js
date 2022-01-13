import React, { useEffect } from 'react';
import { useState } from 'react';
import { FlatList, View, Text, Pressable, Dimensions } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare, faCircle } from '@fortawesome/free-solid-svg-icons'

import rootStyle from "../style.js"
import Button from '../objects/Button.js'
import { sendVote } from '../../scripts/functions.js'

const Vote = ( props ) => {

    const data = (props.data.votees === undefined) ? {votees: []} : props.data
    const gameID = props.gameID
    const voter = props.voter
    const targetCount = props.targetCount

    const [selected, setSelected] = useState(["", ""])
    const [btnVisible, setBtnVisible] = useState(false)

    useEffect(() => {

    }, [btnVisible, selected])


    const markSelected = (selectedName, selectedPosition) => {

        setBtnVisible(true)
        let newSelected = [...selected]
        if (newSelected.includes(selectedName)) {
            let index = newSelected.indexOf(selectedName)
            newSelected.splice(index, 1)
        } else {
            if (newSelected[0] === "" || newSelected[0] === undefined) {
                newSelected[0] = selectedName
            } else {
                if (targetCount > 1) {
                    newSelected[1] = selectedName
                } else {
                    newSelected[0] = selectedName
                }
                
            }
        }
        if (targetCount == 1) {
            if (newSelected[0] === undefined || newSelected[0] === "") {
                setBtnVisible(false)
            }
        } else if (targetCount == 2) {
            if (newSelected[0] === undefined || newSelected[0] === "" || newSelected[1] === undefined || newSelected[1] === "") {
                setBtnVisible(false)
            }
        } 
        
        setSelected(newSelected)
    }

    const renderElements = () => {
        let elements = []
        data.votees.forEach(votee => {
            let index = data.votees.indexOf(votee)
            elements.push(
                <Pressable key={index} onPress={() => markSelected(votee, index)} style={styles.selected}>
                    <Text style={styles.text}> {votee} </Text>
                    {(selected.includes(votee)) ? <FontAwesomeIcon icon={faCheckSquare} color="#ff0000" size={20}/> : <Text></Text>}
                </Pressable>
            )
        })
        return elements;
    }

    const parseAndSend = () => {
        if (targetCount > 1) {
            sendVote(gameID, data.id, voter, selected[0] + "_" + selected[1])
        } else {
            sendVote(gameID, data.id, voter, selected[0])
        }
    }

    return (
        <>
            {(data.type != 'lynch')
                ?
                    <View style={styles.targetLabels}>
                        <View style={styles.targetLabel}>
                            <Text style={rootStyle.smallDisabledText}>TARGET 1</Text>
                            <Text style={rootStyle.centeredText}>{selected[0]}</Text>
                        </View>
                        {(targetCount > 1)
                            ?  <View style={styles.targetLabel}>
                                    <Text style={rootStyle.smallDisabledText}>TARGET 2</Text>
                                    <Text style={rootStyle.centeredText}>{selected[1]}</Text>
                                </View>
                            : <></>
                        }
                        
                    </View>
                : <Text/>
            }   
            <View style={styles.voteTab}>
                <Text style={rootStyle.smallText}>Cast your vote</Text>
                <View style={styles.voteList}>
                    {renderElements()}
                </View>
                <Button visible={btnVisible} style={rootStyle.smallButton} onPress={() => {
                    if (data.type === 'lynch') {
                        setBtnVisible(false)
                    }
                    parseAndSend()
                }}>SEND</Button>
            </View>
        </>
    )

}

export default Vote;

const styles = {
    voteTab: {
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: '#1c0e24',
        borderRadius:5,
        margin: '2%'
    },
    voteList: {
        flex: 1,
        height: '100%',
    },
    selected: {
        flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 5,
        height: '10%',
        minHeight: 20,
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: "#9d0aff",
        borderBottomColor:'white',
        borderBottomWidth: 5,
    },
    list: {
        flex: 1
    },
    text: {
        fontSize: Dimensions.get('window').height / 40, 
        color: 'white',
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