import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ gender: [], domain: [], availability: [] });
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        searchTerm: searchTerm,
        gender: filters.gender.join(','),
        domain: filters.domain.join(','),
        availability: filters.availability.join(',')
      });
  
      const response = await axios.get(`http://localhost:5000/api/users?${params}`);
      setUsers(response.data.results);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (event, filterType) => {
    const { value, checked } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: checked ? [...prevFilters[filterType], value] : prevFilters[filterType].filter(f => f !== value),
    }));
    setCurrentPage(1);
  };

  const addToTeam = (user) => {
    if (!selectedUsers.some(u => u.domain === user.domain) && !selectedUsers.some(u => u.availability === user.availability)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeUserFromTeam = (user) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
  };

  const TeamDetails = () => (
    <div>
      <h3 className="text-lg font-bold mb-2">Team Details</h3>
      <ul>
        {selectedUsers.map(user => (
          <li key={user.id}>{user.name} - {user.domain} - {user.availability} <button onClick={() => removeUserFromTeam(user)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button></li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">User Management</h1>
      <input type="text" placeholder="Search by Name" value={searchTerm} onChange={handleSearch} className="border border-gray-300 rounded px-4 py-2 mb-4 w-full" />
      <div className="mb-4">
        <label className="mr-4">
          <input type="checkbox" onChange={(e) => handleFilterChange(e, 'gender')} value="male" className="mr-2" />
          Male
        </label>
        <label className="mr-4">
          <input type="checkbox" onChange={(e) => handleFilterChange(e, 'gender')} value="female" className="mr-2" />
          Female
        </label>
        {/* Add more filter options here */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users?.map(user => (
          <div key={user.id} className="border rounded p-4">
            <h3 className="text-lg font-bold mb-2">{user.first_name + ' ' + user.last_name}</h3>
            <p>{user.domain}</p>
            <p>{user.gender}</p>
            <p>{user.available}</p>
            <button onClick={() => addToTeam(user)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Add to Team</button>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} paginate={setCurrentPage} />
      {selectedUsers.length > 0 && <TeamDetails />}
    </div>
  );
};

const Pagination = ({ currentPage, paginate }) => {
  const handleNextPage = () => {
    paginate(currentPage + 1);
  };

  const handlePrevPage = () => {
    paginate(currentPage - 1);
  };

  return (
    <nav className="mt-4">
      <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded mr-2">Prev</button>
      <button onClick={handleNextPage} className="px-4 py-2 bg-gray-200 rounded">Next</button>
    </nav>
  );
};

export default App;
