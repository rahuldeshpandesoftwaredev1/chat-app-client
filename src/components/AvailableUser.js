import React, { useId } from 'react';
import { useEffect, useState } from 'react';
import {getUsers} from '../client';

function AvailableUser({userInfo, onClick}){
    return(
        <p onClick={(e) => onClick(userInfo)}>
            {userInfo.FirstName} {userInfo.LastName}
            <br />
        </p>
    );
}

export default AvailableUser;
