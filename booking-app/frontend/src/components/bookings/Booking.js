import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';

function Booking() {
    const history = useHistory();

    const handleClick = () => {
        history.push("/main");
    }

    const [booking, setBooking] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        date: "",
        time: "",
        message: ""
    });

    const { firstName, lastName, phoneNumber, email, date, time, message } = booking;

    function changeBookingData(e) {
        setBooking({ ...booking, [e.target.name]: e.target.value });
    }

    async function sendBookingRequest(e) {
        e.preventDefault();
        try {
            const body = { firstName, lastName, phoneNumber, email, date, time, message };
            const response = await fetch("http://localhost:3001/api/addbooking", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', token: localStorage.jwtToken },
                body: JSON.stringify(body)
            });
            const status = await response.json();
            if (status === false) {
                toast.error('Try again, complete all fields or select another date!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.success('The appointment was successfully recorded!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setBooking({
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
                    email: "",
                    date: "",
                    time: "",
                    message: ""
                });
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3 border p-4 shadow bg-light">
                    <div className="col-12">
                        <h2 className="fw-normal text-secondary fs-4 text-uppercase mb-4">
                            Appointment Bookings</h2>
                    </div>
                    <form onSubmit={sendBookingRequest}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <input type="text" className="form-control"
                                    placeholder="First Name" name="firstName" value={firstName}
                                    onChange={(e) => changeBookingData(e)} />
                            </div>
                            <div className="col-md-6">
                                <input type="text" className="form-control"
                                    placeholder="Last Name" name="lastName" value={lastName}
                                    onChange={(e) => changeBookingData(e)} />
                            </div>
                            <div className="col-md-6">
                                <input type="tel" className="form-control"
                                    placeholder="Phone Number" name="phoneNumber" value={phoneNumber}
                                    onChange={(e) => changeBookingData(e)} />
                            </div>
                            <div className="col-md-6">
                                <input type="email" className="form-control"
                                    placeholder="Enter Email" name="email" value={email}
                                    onChange={(e) => changeBookingData(e)} />
                            </div>
                            <div className="col-md-6">
                                <input type="date" className="form-control"
                                    placeholder="Enter Date" name="date" value={date}
                                    onChange={(e) => changeBookingData(e)} />
                            </div>
                            <div className="col-md-6">
                                <input type="time" className="form-control"
                                    placeholder="Enter Email" name="time" value={time}
                                    onChange={(e) => changeBookingData(e)} />
                            </div>
                            <div className="col-12">
                                <textarea className="form-control"
                                    placeholder="Message" name="message" value={message}
                                    onChange={(e) => changeBookingData(e)}></textarea>
                            </div>
                            <div className="col-12 mt-5">
                                <button className="btn btn-primary float-end">Make Appointment</button>
                                <button className="btn btn-outline-secondary float-end me-2"
                                    onClick={handleClick}>Cancel</button>
                            </div>
                        </div>
                    </form>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}

export default Booking;
