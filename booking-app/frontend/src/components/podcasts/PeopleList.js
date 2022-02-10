import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

function PeopleList() {
    const history = useHistory();

    const handleClick = () => {
        history.push("/main");
    }

    const [userList, setUserList] = useState([]);
    const [foundUsers, setFoundUsers] = useState([]);

    async function sendUserListRequest() {
        try {
            const response = await fetch("http://localhost:3001/api/getusers", {
                method: "GET",
                headers: { token: localStorage.jwtToken }
            });
            const users = await response.json();
            setUserList(users);
            setFoundUsers(users);
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        sendUserListRequest();
    }, []);


    async function unsubscribe(id) {
        try {
            const body = { id };
            const response = await fetch("http://localhost:3001/api/unsubscribe", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', token: localStorage.jwtToken },
                body: JSON.stringify(body)
            }).then(window.location.reload(false));
        } catch (error) {
            console.log(error.message)
        }
    }

    async function subscribe(email) {
        try {
            const body = { email };
            const response = await fetch("http://localhost:3001/api/subscribe", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', token: localStorage.jwtToken },
                body: JSON.stringify(body)
            }).then(window.location.reload(false));
        } catch (error) {
            console.log(error.message)
        }
    }

    function filteredList(e) {
        const searchString = e.target.value.toLowerCase();
        const userFilteredList = [];
        setUserList(foundUsers);
        if (searchString !== '') {
            for (let i = 0; i < userList.length; ++i) {
                if (userList[i].firstname.toLowerCase().includes(searchString) ||
                    userList[i].lastname.toLowerCase().includes(searchString)) {
                    userFilteredList.push(userList[i]);
                }
            }
            setUserList(userFilteredList);
        }
    }

    return (
        <div>
            <div className="container">
                <div className="row flex-lg-nowrap">
                    <div className="col">
                        <div className="e-tabs mb-3 px-3">
                            <ul className="nav nav-tabs">
                                <li className="nav-item"><p
                                    className="nav-link active">Users</p></li>
                            </ul>
                        </div>
                        <div className="row flex-lg-nowrap">
                            <div className="col mb-3">
                                <div className="e-panel card">
                                    <div className="card-body">
                                        <div className="card-title">
                                            <h2 className="fw-normal text-secondary fs-4 text-uppercase mb-4">
                                                List of all users</h2>
                                        </div>
                                        <div className="e-table">
                                            <div className="table-responsive table-lg mt-3">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>First Name</th>
                                                            <th>Last Name</th>
                                                            <th>Subscribe</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {userList.map((user) => {
                                                            return <tr key={user.email}>
                                                                <td className="text-nowrap align-middle">{user.firstname}</td>
                                                                <td className="text-nowrap align-middle">{user.lastname}</td>
                                                                <td className="text-center"><button type="button" className="btn btn-danger"
                                                                    onClick={() => user.subscriptionStatus === true ? unsubscribe(user.idSubscription) : subscribe(user.email)}>
                                                                    {user.subscriptionStatus ? "Unsubscribe" : "Subscribe"}</button></td>
                                                            </tr>
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-3 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="text-center px-xl-3">
                                            <button className="btn btn-outline-secondary"
                                                onClick={handleClick}>Back</button>
                                        </div>
                                        <hr className="my-3" />
                                        <div>
                                            <div className="form-group">
                                                <label>Search by Name:</label>
                                                <input className="form-control w-100" type="text"
                                                    placeholder="Name" onChange={(e) => filteredList(e)} />
                                            </div>
                                        </div>
                                        <hr className="my-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PeopleList;
