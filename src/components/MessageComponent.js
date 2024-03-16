import React from 'react';
import '../stylesheets/messageStyle.css';
import {millisecondsToHuman} from '../helpers'

function MessageComponent({message, sourceUserId}){
    return(
        <div>
            <div>
                {message.content} <br />
            </div>
            <div>
            </div>
            <div>
               {millisecondsToHuman(message.time)}
            </div>
        </div>
    );
}

export default MessageComponent;