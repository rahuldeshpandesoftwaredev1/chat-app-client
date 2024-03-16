import React, { useId } from 'react';
import { useEffect, useState } from 'react';
import { getUsers, getMessages } from './client';
import io from 'socket.io-client';
import {millisecondsToHuman, createRoomId} from './helpers.js';
import AvailableUserList from './components/AvailableUserList.js';
import MessageWindowComponent from './components/MessageWindow.js';

const socket = io.connect('http://localhost:3001');

socket.on('connect', () => {
  console.log(`Id at client side = ${socket.id}`);
});

function App() {
  const [showMessageWindow, setShowMessageWindow] = useState(false)
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

  const handleUserClick = (targetUserClicked) => {
//    const messageData = getMessages('', '');     
    console.log(`clicked user = ${targetUserClicked}`);
    console.log(targetUserClicked.UserId);
    joinRoom(targetUserClicked.UserId);
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
      socket.emit('join_room_finish', {roomId: data.roomId, userId: userId, roomSourceUserId: data.sourceUserId});
    });

  }

  const joinRoom = (targetUserId) => {
    let newRoomId = createRoomId(userId, targetUserId);
    console.log('join ropom of id = ' + newRoomId);
    setRoomId(newRoomId);
    socket.emit('join_room_start', {roomId: newRoomId, sourceUserId: userId, targetUserId: targetUserId});
    console.log(`Waiut on join_room_successful_${newRoomId}_${userId} to finish for who started..`);
    socket.on(`join_room_successful_${newRoomId}_${userId}`, (data) => {
      console.log('the chat room has been created successfully = which I initiated..');
      getMessages((data) => {
        setMessages(data);
      });
    });
  }

  useEffect(() => {
    loadDataFromServer();
  });

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
      <div id = 'available-users'>s
        <AvailableUserList
            userList = {users}
            onClick = {handleUserClick}
          />
      </div>
      <div id = 'select-user-id'>
        <p>Select your id</p>
        <input type = 'text' onChange = {(e) => setUserId(e.target.value)} />        
        Selected user id: {userId}
      </div>
      <button onClick = {finalizeUserId}>Finalize User Id</button>
      <div id = 'start-chat'>
        <input type = 'text' id = 'messageInput' onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send Message</button>
      </div>
      <div id = 'message-window'>
        {showMessageWindow} ? 
            <MessageWindowComponent
              sourceUserId={userId}
              messages={allMessages}
                />
      </div>
      <div id = 'all-messages'>
        <ul>       
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
