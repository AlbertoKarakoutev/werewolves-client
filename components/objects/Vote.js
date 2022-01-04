import React, { useEffect } from 'react';
import { useState } from 'react';
import { FlatList, View, Text, Pressable, Dimensions } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckSquare, faCircle } from '@fortawesome/free-solid-svg-icons'

import rootStyle from "../style.js"
import Button from '../objects/Button.js'
import { sendVote } from '../../scripts/functions.js'

const Vote = ( props ) => {

    const data = props.data
    const gameID = props.gameID
    const voter = props.voter
    const targetCount = props.targetCount

    const [selected, setSelected] = useState(["", ""])
    const [btnVisible, setBtnVisible] = useState(false)

    useEffect(() => {

    }, [btnVisible, selected])

    const markSelected = (selectedName, selectedPosition) => {
        setBtnVisible(true)
        let newSelected;
        if (selectedPosition == 0) {
            if (selected[1] !== selectedName) {
                newSelected = [selectedName, selected[1]]
            } else {
                newSelected = [selectedName, ""]
            }
        } else {
            if (selected[0] !== selectedName) {
                newSelected = [selected[0], selectedName]
            } else {
                newSelected = ["", selectedName]
            }
        }

        setSelected(newTarget)
    }

    const renderDots = (numberOfDots) => {
        const dots = Array(numberOfDots)
        dots.fill(<FontAwesomeIcon icon={faCircle} color="#0000ff" size={20}/>)
        return dots
    }

    const renderElement = (name, elementNumber) => {
        return (
            <Pressable onPress={() => markSelected(name, elementNumber)} style={styles.selected}>
                <View>
                    <Text style={rootStyle.smallText}> {name} </Text>
                    {(data.type != "LYNCH")
                        ? renderDots(data.ballot[name])
                        : (<Text/>)
                    }
                </View>
                {(selected[elementNumber].includes(name)) ? <FontAwesomeIcon icon={faCheckSquare} color="#ff0000" size={20}/> : <Text></Text>}
            </Pressable>
        )
    }

    const renderByCount = () => {

        const list = (number) => {
            return (
                <View style={{flexDirection: 'column', flex: 1, height: 200}}>
                    <Text style={rootStyle.smallText}>Target {number+1}</Text>
                    <FlatList keyExtractor={(item, index) => index.toString()} style={styles.list} data={data.votees} renderItem={({item, index}) => 
                        {renderElement(item, number)}
                    }/>
                </View>
            )
        }
        
        if (targetCount === 1) {
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

    const parseAndSend = () => {
        if (targetCount > 1) {
            if (selected[1] === "") {
                alert("Please select 2 targets!")
                return
            }
            sendVote(gameID, data.id, voter, selected[0] + "_" + selected[1])
        } else {
            sendVote(gameID, data.id, voter, selected[0])
        }
    }

    return (
        <View style={styles.voteTab}>
            <Text style={rootStyle.smallText}>Cast your vote</Text>
            {renderByCount()}
            <Button visible={btnVisible} style={rootStyle.smallButton} onPress={() => {
                // setBtnVisible(false)
                parseAndSend()
            }}>SEND</Button>
        </View>
    )

}

export default Vote;

const styles = {
    voteTab: {
        flexDirection: 'column',
        height: '30%',
        width: '96%',
        backgroundColor: '#1c0e24',
        borderRadius:5,
        margin: '2%'
    },
    selected: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        padding: 2,
        margin: 2,
        alignItems: 'center',
        backgroundColor: "#9d0aff",
        borderBottomColor:'white',
        borderBottomWidth:1,
        borderTopColor:'white',
        borderTopWidth:0.5,
    },
    list: {
        flex: 1
    },
}