import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  //create user in collection users
  const createUser = async () => {
    await addDoc(usersCollectionRef, {
      name: newName,
      age: Number(newAge),
    });
  };

  //update user in collection users
  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
  };

  //delete user in collection users
  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };

  //get user in collection users
  const getUsers = useCallback(async () => {
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [usersCollectionRef]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const renderUsers = () => {
    return users.map((user) => {
      return (
        <div>
          <h1>Name: {user.name}</h1>
          <h1>Age: {user.age}</h1>
          <button
            onClick={() => {
              updateUser(user.id, user.age);
            }}
          >
            Increase Age
          </button>
          <button
            onClick={() => {
              deleteUser(user.id);
            }}
          >
            Delete User
          </button>
        </div>
      );
    });
  };

  return (
    <div className="App">
      <input
        placeholder="Name..."
        onChange={(event) => {
          setNewName(event.target.value);
        }}
      />
      <input
        type="number"
        placeholder="Age..."
        onChange={(event) => {
          setNewAge(event.target.value);
        }}
      />

      <button onClick={createUser}> Create User</button>
      {renderUsers()}
    </div>
  );
}

export default App;
