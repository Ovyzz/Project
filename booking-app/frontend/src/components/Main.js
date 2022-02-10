import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';

function Main() {
    const [userData, setUserData] = useState({
        name: "",
        peopleRegistered: "",
        publishedPodcast: "",
        subscribers: "",
        payments: "",
        totalPodcasts: "",
        totalBookings: ""
    });

    const { name, peopleRegistered, publishedPodcast, subscribers, payments, totalPodcasts, totalBookings } = userData;

    async function sendGetUserDataRequest() {
        try {
            const response = await fetch("http://localhost:3001/api/getuserdata", {
                method: "GET",
                headers: { token: localStorage.jwtToken }
            });
            const username = await response.json();
            setUserData(username);
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        sendGetUserDataRequest();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6 offset-md-3 border p-4 shadow bg-light">
                        <div className="col-12">
                            <h2 className="fw-normal text-secondary fs-4 text-uppercase mb-4">
                                HI {name}</h2>
                        </div>
                        <form >
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <h6>People registered: {peopleRegistered}</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6> The number of payments made: {payments}</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6>Published podcast: {publishedPodcast}</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6>Total number of podcasts: {totalPodcasts}</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6>Subscribers: {subscribers}</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6>The number of bookings made: {totalBookings}</h6>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main
