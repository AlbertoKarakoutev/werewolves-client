import React from 'react';
import { Text, View, ScrollView, Dimensions } from 'react-native';
import rootStyle from "../style.js"

const HowTo = () => {

    return (
        <View style={rootStyle.container}>
            <Text h1 style={rootStyle.title}>How To Play</Text>
            <ScrollView>
                <Text style={{fontSize: Dimensions.get('window').width / 20, color: 'white', textAlign: 'left'}}>
                    Ultimate Werewolf is a card game designed by Ted Alspach and published by Bézier Games.
                    It is based on the social deduction game, Werewolf, which is Andrew Plotkin's reinvention of Dimitry Davidoff's 1987 game, Mafia.
                    The Werewolf game appeared in many forms before Bézier Games published Ultimate Werewolf in 2008.
                    Ultimate Werewolf can be played with 5 to 75 players of all ages.
                    Each player has an agenda: as a villager, hunt down the werewolves; as a werewolf, convince the other villagers that you are innocent, while secretly attacking those same villagers each night. 
                    A third major team working to kill off all others are the Vampires, who must kill both werewolves and villagers to win, and other neutral roles are available, each vying to achieve their own goals. 
                    Dozens of special roles are available to help both the villagers and the werewolves achieve their goals.
                    The game has 12 unique roles being a set of sixteen fully illustrated cards, a moderator score pad to keep track of games, and a comprehensive game guide. 
                </Text>
            </ScrollView>
        </View>
    )
}

export default HowTo