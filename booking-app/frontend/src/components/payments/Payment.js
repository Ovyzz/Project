import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';

function Payment() {
    const history = useHistory();

    const handleClick = () => {
        history.push("/main");
    }

    const [payment, setPayment] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        date: "",
        amount: "",
        cashing: false,
        message: ""
    });

    const { firstName, lastName, phoneNumber, email, date, amount, cashing, message } = payment;

    function changePaymentData(e) {
        setPayment({ ...payment, [e.target.name]: e.target.value });
    }

    async function sendPaymentRequest(e) {
        e.preventDefault();
        try {
            const body = { firstName, lastName, phoneNumber, email, date, amount, cashing, message };
            const response = await fetch("http://localhost:3001/api/addpayment", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', token: localStorage.jwtToken },
                body: JSON.stringify(body)
            });
            const status = await response.json();
            if (status === false) {
                toast.error('Try again, complete all fields!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.success('Payment was made successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setPayment({
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
                    email: "",
                    date: "",
                    amount: "",
                    cashing: false,
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
                            Payment</h2>
                    </div>
                    <form onSubmit={sendPaymentRequest}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <input type="text" className="form-control"
                                    placeholder="First Name" name="firstName" value={firstName}
                                    onChange={(e) => changePaymentData(e)} />
                            </div>
                            <div className="col-md-6">
                                <input type="text" className="form-control"
                                    placeholder="Last Name" name="lastName" value={lastName}
                                    onChange={(e) => changePaymentData(e)} />
                            </div>
                            <div className="col-md-6">
                                <input type="tel" className="form-control"
                                    placeholder="Phone Number" name="phoneNumber" value={phoneNumber}
                                    onChange={(e) => changePaymentData(e)} />
                            </div>
                            <div className="col-md-6">
                                <input type="email" className="form-control"
                                    placeholder="Enter Email" name="email" value={email}
                                    onChange={(e) => changePaymentData(e)} />
                            </div>
                            <div className="col-md-6">
                                <input type="date" className="form-control"
                                    placeholder="Enter Date" name="date" value={date}
                                    onChange={(e) => changePaymentData(e)} />
                            </div>
                            <div className="col-md-6">
                                <input type="text" className="form-control"
                                    placeholder="Amount" name="amount" value={amount}
                                    onChange={(e) => changePaymentData(e)} />
                            </div>
                            <div className="form-check col-md-6">
                                <input className="form-check-input" type="checkbox" checked={payment.cashing}
                                    onChange={(e) => setPayment({ ...payment, cashing: e.target.checked })} />
                                <label className="form-check-label">
                                    Cashing
                                </label>
                            </div>
                            <div className="col-12">
                                <textarea className="form-control"
                                    placeholder="Message" name="message" value={message}
                                    onChange={(e) => changePaymentData(e)}></textarea>
                            </div>
                            <div className="col-12 mt-5">
                                <button className="btn btn-primary float-end">Making a payment</button>
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

export default Payment;
