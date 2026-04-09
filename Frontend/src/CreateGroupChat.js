import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateGroupChat({ onGroupCreated }) {
  // State variables to manage group name, list of all users, selected users, new user name, and new user email
  const [groupName, setGroupName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  useEffect(() => {
    // Fetch all users to select as members when the component mounts
    axios.get('http://localhost:3000/api/users')
      .then(response => {
        setAllUsers(response.data); // Update the allUsers state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching users:', error); // Log any errors
      });
  }, []);

  // Function to handle the creation of a new group chat
  const handleCreateGroup = async () => {
    if (groupName === "" || selectedUsers.length === 0) {
      alert("Please provide a group name and select at least one member."); // Alert if no group name or members are selected
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/groupChats', {
        groupName,
        members: selectedUsers
      });
      alert('Group chat created successfully!'); // Alert on successful group creation
      onGroupCreated(response.data); // Notify parent component of the new group creation
    } catch (error) {
      console.error('Error creating group chat:', error); // Log any errors
      alert('Failed to create group chat.'); // Alert on failure to create group chat
    }
  };

  // Function to handle the selection of users
  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter(id => id !== userId); // Remove user from selected users if already selected
      } else {
        return [...prevSelectedUsers, userId]; // Add user to selected users if not already selected
      }
    });
  };

  // Function to handle adding a new user
  const handleAddNewUser = () => {
    if (newUserName === "" || newUserEmail === "") {
      alert("Please provide both name and email."); // Alert if name or email is missing
      return;
    }

    const newUser = {
      _id: new Date().getTime().toString(), // Temporary ID until saved to the server
      username: newUserName,
      email: newUserEmail
    };

    setAllUsers([...allUsers, newUser]); // Add new user to the allUsers list
    setSelectedUsers([...selectedUsers, newUser._id]); // Select the new user
    setNewUserName(""); // Clear the new user name input
    setNewUserEmail(""); // Clear the new user email input
  };

  return (
    <div className="createGroupChatContainer">
      <h2>Create Group Chat</h2>
      <input
        type="text"
        placeholder="Group Name..."
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)} // Update the group name state on input change
      />
      <div className="userSelection">
        {allUsers.map(user => (
          <div key={user._id}>
            <input
              type="checkbox"
              id={`user-${user._id}`}
              checked={selectedUsers.includes(user._id)} // Check if user is selected
              onChange={() => handleSelectUser(user._id)} // Handle user selection
            />
            <label htmlFor={`user-${user._id}`}>{user.username}</label>
          </div>
        ))}
        <h2>Add New Member</h2>
        <input
          type="text"
          placeholder="Name..."
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)} // Update the new user name state on input change
        />
        <input
          type="email"
          placeholder="Email..."
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)} // Update the new user email state on input change
        />
        <button onClick={handleAddNewUser}>Add Member</button> {/* Call handleAddNewUser on button click */}
      </div>
      <button onClick={handleCreateGroup}>Create Group Chat</button> {/* Call handleCreateGroup on button click */}
    </div>
  );
}

export default CreateGroupChat;