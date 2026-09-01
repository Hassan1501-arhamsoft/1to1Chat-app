import SearchBar from "../components/SearchBar";
import UserList from "../components/UserList";
import useUsers from "../hooks/useUsers";
import '../styles/UsersPage.css'
// eslint-disable-next-line react-hooks/rules-of-hooks
function UsersPage(){

    const {
        users,
        handleSearch
    } = useUsers();


    return (
        <div className="users-page">
            <div className="users-container">

                <h2 className="users-title">
                    Users
                </h2>

                <div className="users-search">
                    <SearchBar
                        onSearch={handleSearch}
                    />
                </div>

                <div className="users-list">
                    <UserList
                        users={users}
                    />
                </div>

            </div>
        </div>
    )
}


export default UsersPage;