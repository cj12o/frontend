import React, { useMemo } from 'react'

import WebSocketContextProvider from './WebSocketProvider'
import Room from "./Room"
import { useParams } from 'react-router-dom'

const RoomWrapper = () => {
    const {id}=useParams()
    const provider=useMemo(()=>
        (
            <WebSocketContextProvider id={id}>
                <Room/>
            </WebSocketContextProvider>
        ),[id])
    return id?provider:null
}

export default RoomWrapper