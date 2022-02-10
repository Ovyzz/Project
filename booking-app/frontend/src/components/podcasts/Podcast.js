import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';

function Podcast() {
    const history = useHistory();

    const handleClick = () => {
        history.push("/main");
    }

    const [podcast, setPodcast] = useState({
        title: "",
        url: "",
        type: "public"
    });

    const { title, url, type } = podcast;

    function changePodcastData(e) {
        setPodcast({ ...podcast, [e.target.name]: e.target.value });
    }

    async function sendPodcastRequest(e) {
        e.preventDefault();
        try {
            const body = { title, url, type };
            const response = await fetch("http://localhost:3001/api/addpodcast", {
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
                toast.success('The podcast has been successfully added!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setPodcast({
                    title: "",
                    url: "",
                    type: "public"
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
                        <h3 className="fw-normal text-secondary fs-4 text-uppercase mb-4">Post a new podcast</h3>
                    </div>
                    <form onSubmit={sendPodcastRequest}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <input type="text" className="form-control" placeholder="Url For Podcast"
                                    name="url" value={url} onChange={(e) => changePodcastData(e)} />
                            </div>
                            <div className="col-md-6">
                                <input type="text" className="form-control" placeholder="Title For Podcast"
                                    name="title" value={title} onChange={(e) => changePodcastData(e)} />
                            </div>
                            <div className="col-12">
                                <select className="form-select" name="type" value={type} onChange={(e) => changePodcastData(e)}>
                                    <option value="public">Public</option>
                                    <option value="subscribe">Subscribe Only</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                            <div className="col-12 mt-5">
                                <button className="btn btn-primary float-end">Post the new podcast</button>
                                <button className="btn btn-outline-secondary float-end me-2"
                                    onClick={handleClick}>Cancel</button>
                            </div>
                            <ToastContainer />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Podcast;
