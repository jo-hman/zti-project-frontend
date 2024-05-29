import {UserModel} from "./UserModel";
import styled from "styled-components";



const User = ({user}: {user: UserModel}) => {

    return (
        <ul>
            <li>{user.email}</li>
        </ul>
    )
}

export default User;