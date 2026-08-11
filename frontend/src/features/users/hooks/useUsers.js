import { useEffect, useState } from "react";

import {
  getUsers,
  searchUsers,
} from "../services/user.service";

function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load all users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUsers();

      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const handleSearch = async (search) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await searchUsers(search);

      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    loadUsers,
    handleSearch,
  };
}

export default useUsers;