import React from 'react';
import AvailableUser from './AvailableUser';

function AvailableUserList ({userList, onClick}){
    return(
       <>
        {
            userList.map(availableUser => 
            {
                return <AvailableUser
                    key = {availableUser.UserId}
                    userInfo = {availableUser}
                    onClick = {onClick}
                />
            })
        } 
       </>
    );
}

export default AvailableUserList;