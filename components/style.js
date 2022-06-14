import { StyleSheet, Dimensions } from 'react-native';

const titleFontSize = Dimensions.get('window').width / 12
const textFontSize = Dimensions.get('window').height / 45
const smallTextFontSize = Dimensions.get('window').width / 30

const bg = "#2f173d"
const text_btn = "#9d0aff"
const small_btn = "#dcb8f5"
const disabled_btn = "#4e2866"
const modalBg = "#572b70"

const rootStyle = StyleSheet.create({
    container:{
        display:'flex',
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        padding: 10,
        backgroundColor: bg
    },
    link:{
        width:'100%',
        alignItems: 'center',
    },
    title:{
        color:"white",
        fontSize: titleFontSize,
        fontWeight: 'bold',
        textAlign:'center',
        marginBottom:'auto',
        marginTop:"5%",
        padding:30,
        fontFamily:'sans-serif-thin',
        position:'relative'
        
    },
    text:{
        fontSize: textFontSize,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        margin:"2%",
        color:"white",
        fontFamily:'sans-serif-thin',
    },
    centeredText:{
        fontSize: textFontSize,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        margin:"2%",
        color:"white",
        fontFamily:'sans-serif-thin',
        textAlign:"center",
    },
    smallText:{
        textTransform: 'uppercase',
        fontSize: smallTextFontSize,
        color: 'white',
        textAlign:"center"
    },
    disabledText:{
        fontSize: textFontSize,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        margin:"2%",
        color:"#777",
        fontFamily:'sans-serif-thin',
    },
    smallDisabledText:{
        fontSize: smallTextFontSize,
        fontWeight: 'bold',
        margin:"2%",
        color:"#777",
        textAlign:"center"
    },
    button:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: "2%",
        borderRadius:35,
        backgroundColor:text_btn,
        elevation:4,
        margin:"2%",
        marginTop:"3%"
    },
    smallButton:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        borderRadius:10,
        backgroundColor:small_btn,
        marginLeft:'20%',
        marginRight:'20%',
        marginVertical: 5
    },
    disabledButton:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: "2%",
        borderRadius:35,
        backgroundColor:disabled_btn,
        margin:"2%",
        marginTop:"3%"
    },
    modal:{
        zIndex:1000
    },
    input: {
        fontSize: 24,
        textAlign:'center',
        padding: '3%',
        margin: 10,
        marginBottom: 0,
        borderWidth: 1,
        borderRadius:35,
        borderColor: '#999',
        fontStyle: 'italic',
        color:'white'
    },
    bottomModal:{
        backgroundColor:modalBg,
        flexDirection:'column',
        justifyContent:'center',
    }
});

export default rootStyle;