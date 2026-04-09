// Contacts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import io from 'socket.io-client';

const socket = io.connect('http://localhost:3000');

function Contacts({ onSelectContact, onCreateGroupChat }) {
    // State variables to manage the list of contacts and new contact input
    const [contacts, setContacts] = useState([]);
    const [newContactName, setNewContactName] = useState("");
    const [newContactEmail, setNewContactEmail] = useState("");

    // useEffect hook to fetch contacts from the server when the component mounts
    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        // Listen for the 'new_contact' event
        socket.on('new_contact', (contact) => {
            setContacts((prevContacts) => [...prevContacts, contact]);
        });

        // Cleanup the event listener on component unmount
        return () => socket.off('new_contact');
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/contacts');
            setContacts(response.data);
        } catch (error) {
            console.error('Error fetching contacts:', error.message);
        }
    };

    const addContact = async () => {
        if (newContactName !== "" && newContactEmail !== "") {
            try {
                const response = await axios.post('http://localhost:3000/contacts', { name: newContactName, email: newContactEmail });
                setContacts([...contacts, response.data]);
                setNewContactName("");
                setNewContactEmail("");
                // Notify the server about the new contact
                socket.emit('new_contact', response.data);
            } catch (error) {
                console.error('Error adding contact:', error.message);
            }
        }
        else {
            alert("Please fill in both name and email");
        }
    };

    return (
        <div>
            
            <input
                type="text"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)} // Update the new contact name state on input change
                placeholder="Add new contact name"
            />
            <input
                type="email"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)} // Update the new contact email state on input change
                placeholder="Add new contact email"
            />
            <button onClick={addContact}>Add</button> {/* Call addContact function on button click */}
            <ul>
                {contacts.map((contact, index) => (
                    <li key={index}>
                        <button onClick={() => onSelectContact(contact)}>{contact.name}</button>
                        <button onClick={() => onCreateGroupChat(contact)}>Start Group Chat</button>
                    </li> 
                ))} {/* Render the list of contacts */}
            </ul>
        </div>
    );
}

export default Contacts;
