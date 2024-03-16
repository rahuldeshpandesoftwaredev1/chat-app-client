import React from 'react';
import MessageComponent from './MessageComponent';

function MessageWindow({sourceUserId, messages}){
    return(
        <>
        {
            messages.map((message) => {
                return (
                    <MessageComponent
                        sourceUserId = {sourceUserId}
                        key = {message.id}
                        message = {message}
                    />
                )
            })
        }
        </>
    )
}

export default MessageWindow;