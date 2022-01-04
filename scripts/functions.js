import host from './host.js';

async function fetchGames() {
    let res = await fetch(`${host}/base/game/all`)
    let data = await res.json()
    return data
}

async function lobbyLogin(username, gameID) {
    let res = await fetch(`${host}/base/user/login`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(
            {
                content:{
                    gameId: gameID,
                    username: username
                }
            }
        )
    })
    let data = await res.json()
    return data
}

async function deleteGameRequest(gameID) {
    let res = await fetch(`${host}/base/game/${gameID}/delete/`, {
        method: "DELETE"
    });
    let data = await res.json();
    return data
}

async function createGameRequest(players) {
    let res = await fetch(`${host}/base/game/create`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            content:{
                players: players
            }
        })
    });
    let data = await res.json()
    return data
}

async function readyRequest(username, gameID) {
    let res = await fetch(`${host}/lobby/user/ready/`,{
        method: "PUT", 
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            content:{
                username: username,
                gameId: gameID
            }
        })
    })
    let data = res.json()
    return data
}

async function loggedIn(username, gameID) {
    let res = await fetch(`${host}/game/user/loggedIn`,{
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(
            {
                content: {
                    username: username,
                    gameId: gameID
                }
            }
        )
    })
    let data = await res.json()
    return data
}

async function setTargetRequest(roleName, gameID, targetName) {
    let res = await fetch(`${host}/game/target`,{
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(
            {
                content: {
                    roleName: roleName,
                    gameId: gameID,
                    targetName: targetName
                }
            }
        )
    })
    let data = res.json()
    return data
}

async function setReadyToSleep(gameID, username) {
    let res = await fetch(`${host}/game/sleep`,{
        method: "PUT", 
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(
            {
                content: {
                    gameId: gameID,
                    username: username
                }
            }
        )
    })
    let data = res.json()
    return data
}

async function sendChatMessage(gameID, chatID, username, message) {
    let res = await fetch(`${host}/game/chat`,{
        method: "PUT", 
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(
            {
                content: {
                    gameId: gameID,
                    chatId: chatID,
                    username: username,
                    message:message
                }
            }
        )
    })
    let data = res.json()
    return data
}

async function answer(gameID, username, roleName, a) {
    let res = await fetch(`${host}/game/setAnswer`,{
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(
            {
                content: {
                    gameId: gameID,
                    roleName: roleName,
                    username: username,
                    answer:a
                }
            }
        )
    })
    let data = res.json()
    return data
}

async function wokenUp(gameID) {
    let res = await fetch(`${host}/game/wokenUp`,{
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(
            {
                content: {
                    gameId: gameID
                }
            }
        )
    })
    let data = res.json()
    return data
}

async function sendVote(gameID, voteID, voter, votee) {
    console.log(votee)
    let res = await fetch(`${host}/game/vote`,{
        method: "PUT", 
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(
            {
                content: {
                    gameId: gameID,
                    voteId: voteID,
                    voter: voter,
                    votee: votee
                }
            }
        )
    })
    let data = res.json()
    return data
}


export { fetchGames, deleteGameRequest, lobbyLogin, createGameRequest, 
        readyRequest, loggedIn, setTargetRequest, setReadyToSleep, sendChatMessage, 
        answer, wokenUp, sendVote }