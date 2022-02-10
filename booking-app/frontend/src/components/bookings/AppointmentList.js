import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';

function AppointmentList() {
    const history = useHistory();

    const handleClick = () => {
        history.push("/main");
    }

    const [booking, setBooking] = useState([]);

    async function sendBookingListRequest() {
        try {
            const response = await fetch("http://localhost:3001/api/appointment-list", {
                method: "GET",
                headers: { token: localStorage.jwtToken }
            });
            const appointment = await response.json();
            setBooking(appointment);
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        sendBookingListRequest();
    }, []);

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    async function deleteBooking(id) {
        try {
            const body = { id };
            const response = await fetch("http://localhost:3001/api/deletebooking", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', token: localStorage.jwtToken },
                body: JSON.stringify(body)
            }).then(toast.success('The appointment has been successfully deleted!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })).then(await timeout(2000)).then(window.location.reload(false));
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div>
            <button className="btn btn-danger my-4 mx-4" onClick={handleClick}>Back</button>
            <div className="container table-responsive py-5">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Email</th>
                            <th scope="col">First name</th>
                            <th scope="col">Last name</th>
                            <th scope="col">Phone number</th>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                            <th scope="col">Message</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {booking.map(appointment => {
                            return <tr key={appointment.id}>
                                <th scope="row">{appointment.id}</th>
                                <td>{appointment.email}</td>
                                <td>{appointment.firstname}</td>
                                <td>{appointment.lastname}</td>
                                <td>{appointment.phonenumber}</td>
                                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.message}</td>
                                <td><button type="button" className="btn btn-danger"
                                    onClick={() => deleteBooking(appointment.id)}>Cancel</button></td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <ToastContainer />
            </div>
        </div>
    );
}

export default AppointmentList;
