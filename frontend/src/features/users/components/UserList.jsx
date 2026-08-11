import UserCard from "./UserCard";

import "../styles/UserList.css";


function UserList({users}) {


    return (

        <div className="user-list">

            {
                users.map((user)=>(
                    <UserCard
                        key={user._id}
                        user={user}
                    />
                ))
            }

        </div>

    )

}


export default UserList;