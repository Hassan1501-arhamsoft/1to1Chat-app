import SearchBar from "../components/SearchBar";
import UserList from "../components/UserList";
import useUsers from "../hooks/useUsers";

// eslint-disable-next-line react-hooks/rules-of-hooks
function UsersPage(){

    const {
        users,
        handleSearch
    } = useUsers();


    return (
        <div>
            <SearchBar
                onSearch={handleSearch}
            />
            <UserList
                users={users}
            />
        </div>
    )
}


export default UsersPage;