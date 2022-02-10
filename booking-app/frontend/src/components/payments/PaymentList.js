import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

function PaymentList() {
    const history = useHistory();

    const handleClick = () => {
        history.push("/main");
    }

    const [booking, setBooking] = useState([]);
    const [paymentStatistics, setPaymentStatistics] = useState({
        amountPaid: "",
        amountReceived: "",
        totalAmount: ""
    });

    async function sendPaymentListRequest() {
        try {
            const response = await fetch("http://localhost:3001/api/payment-list", {
                method: "GET",
                headers: { token: localStorage.jwtToken }
            });
            const pay = await response.json();
            setBooking(pay);
        } catch (error) {
            console.log(error.message)
        }
    }

    async function sendPaymentStatisticsRequest() {
        try {
            const response = await fetch("http://localhost:3001/api/payment-statistics", {
                method: "GET",
                headers: { token: localStorage.jwtToken }
            });
            const payments = await response.json();
            console.log(payments)
            setPaymentStatistics(payments);
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        sendPaymentListRequest();
        sendPaymentStatisticsRequest();
    }, []);

    return (
        <div>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6 offset-md-3 border p-4 shadow bg-light">
                        <div className="col-12">
                            <h2 className="fw-normal text-secondary fs-4 text-uppercase mb-4">
                                Payment statistics</h2>
                        </div>
                        <form >
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <h6>The number of payments made: {booking.length}</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6>The amount paid: {paymentStatistics.amountPaid}$</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6>The total amount of money received: {paymentStatistics.totalAmount}$</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6>The amount received: {paymentStatistics.amountReceived}$</h6>
                                </div>
                                <div className="col-12 mt-5">
                                    <button className="btn btn-outline-secondary float-end me-2"
                                        onClick={handleClick}>Back</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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
                            <th scope="col">Amount</th>
                            <th scope="col">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {booking.map((pay) => {
                            return <tr key={pay.id}
                                className={pay.cashing === "true" ? "table-success" : "table-danger"}>
                                <th scope="row">{pay.id}</th>
                                <td>{pay.email}</td>
                                <td>{pay.firstname}</td>
                                <td>{pay.lastname}</td>
                                <td>{pay.phonenumber}</td>
                                <td>{new Date(pay.date).toLocaleDateString()}</td>
                                <td>{pay.amount}$</td>
                                <td>{pay.message}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PaymentList;
