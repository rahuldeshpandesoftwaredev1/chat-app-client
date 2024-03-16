import React, { useId } from 'react';
import { useEffect, useState } from 'react';
import {getUsers} from './client';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

socket.on('connect', () => {
  console.log(`Id at client side = ${socket.id}`);
});

function millisecondsToHuman(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor(ms / 1000 / 60 / 60);

  const humanized = [
    pad(hours.toString(), 2),
    pad(minutes.toString(), 2),
    pad(seconds.toString(), 2),
  ].join(':');

  return humanized;
}

function pad(numberString, size) {
  let padded = numberString;
  while (padded.length < size) padded = `0${padded}`;
  return padded;
}

function App() {

  const [message, setMessage] = useState('');
  const [allMessages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState(0);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');

  const loadDataFromServer = () => {
    getUsers((data) => {
      setUsers(data);
    })
  }
  const sendMessage = () => {
    console.log('sending a message = ' + message);
    const messageId = "id" + Math.random().toString(16).slice(2)
    const data = {content: message, roomId: roomId, from: userId, messageId: messageId, timestamp: Date.now()};
    socket.emit('send_message', data);
    setMessages([...allMessages, data]);
  }

  const finalizeUserId = () => {
    console.log(`Finalizing user id = ${userId}`);    
    console.log(`listen gon please_join_room_${userId}`);

    socket.on(`please_join_room_${userId}`, (data) => {
      console.log('please join room on cient side received...');
      setRoomId(data.roomId);
      socket.emit('join_room_finish', {roomId: data.roomId, userId: userId});
    });
  }

  const joinRoom = (targetUserId) => {
    const sourceUserId = userId;
    let arr = [];

    if (sourceUserId.localeCompare(targetUserId) < 0)
    {
      arr.push(sourceUserId);
      arr.push(targetUserId);
    }
    else
    {
      arr.push(targetUserId);
      arr.push(sourceUserId);
    }

    let newRoomId = arr.join('_');
    console.log('join ropom of id = ' + newRoomId);
    setRoomId(newRoomId);
    socket.emit('join_room_start', {roomId: newRoomId, sourceUserId: userId, targetUserId: targetUserId});
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log('received the message..' + data.content);
        setMessage(data.content);
        console.log('setting messages.., prev count = ' + allMessages.length);
        setMessages([...allMessages, data]);
    });
  },[socket, message, allMessages]);

  return (
    <div className="App">
      hello from UI

      <div id = 'select-user-id'>
        <p>Select your id</p>
        <input type = 'text' onChange = {(e) => setUserId(e.target.value)} />        
        Selected user id: {userId}
      </div>
      <button onClick = {finalizeUserId}>Finalize User Id</button>
      <button onClick = {loadDataFromServer}>Load the user data.</button>
      <div>
        <ul>
          {users.map(user => <li key = {user.UserId} onClick = {(e) => {
            console.log(e.target.innerText);
            joinRoom(user.UserId);
          }}>
            {user.FirstName} {user.LastName} {user.UserId}
            </li>
            )}
        </ul>
      </div>
      <div id = 'start-chat'>
        <input type = 'text' id = 'messageInput' onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send Message</button>
      </div>
      <div id = 'all-messages'>
        Here are all the messages:
        <ul>
        {console.log('message count = ' + allMessages.length)}
        { 
          (
          allMessages.map((myMessage) => {
          const person = myMessage.from == userId ? "You" : "Him";
          const time = millisecondsToHuman(myMessage.timestamp);
          let divStyle = myMessage.from == userId ? "3px solid blue" : "3px solid green";
          return (
            <li id = {myMessage.messageId} style = {{border: divStyle}}>
              CONTENT =  {myMessage.content}
              Person = {person}
              Time = {time}
            </li>
          )
          }))
         
        }
          </ul>
      </div>
    </div>
  );
}

export default App;
