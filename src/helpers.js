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

  function createRoomId(user1, user2){
    let arr = [];
    if (user1.localeCompare(user2) < 0)
    {
      arr.push(user1);
      arr.push(user2);
    }
    else
    {
      arr.push(user2);
      arr.push(user1);
    }
    return arr.join('_');
  }
  

  export {millisecondsToHuman, createRoomId};