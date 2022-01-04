import React from 'react';
import { Text, Pressable } from 'react-native';
import rootStyle from "../style.js"

const Button = (props) => {
    const disabled = (props.disabled !== null) ? props.disabled : false
    const onPress = props.onPress
    const text = props.children
    const visible = (props.visible !== undefined) ? props.visible : true

    let resolvedStyle = props.style
    if (resolvedStyle == null) {
        if (disabled) {
            resolvedStyle = rootStyle.disabledButton
        } else {
            resolvedStyle = rootStyle.button
        }
    }

    return (
        <>
            {(visible)
                ?   
                    <Pressable disabled={disabled} style={resolvedStyle} onPress={onPress}>
                        <Text style={(disabled) ? rootStyle.disabledText : rootStyle.text }>{text}</Text>
                    </Pressable>
                : 
                    <Text/>
            }
        </>
        
    )
}
export default Button