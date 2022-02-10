import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

function PodcastList() {
    const history = useHistory();

    const handleClick = () => {
        history.push("/main");
    }

    const [podcast, setPodcast] = useState([]);

    async function sendPodcastListRequest() {
        try {
            const response = await fetch("http://localhost:3001/api/podcast-list", {
                method: "GET",
                headers: { token: localStorage.jwtToken }
            });
            const posts = await response.json();
            setPodcast(posts);
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        sendPodcastListRequest();
    }, []);


    return (
        <div className="container mx-auto mt-4" >
            <div className="e-tabs mb-3 px-3">
                <ul className="nav nav-tabs">
                    <li className="nav-item"><button className="btn btn-outline-secondary float-end me-2"
                        onClick={handleClick}>Back</button></li>           
                </ul>
            </div>
            <div className="row">
                {podcast.map((post) => {
                    return <div className="col-md-4">
                        <div className="card mb-4 border border-1 border-danger" style={{ width: '18rem' }}>
                            <iframe title="My Daily Marathon Tracker" className="card-img-top"
                                src={post.url}>
                            </iframe>
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{post.name}</h6>
                                <p className="card-text">{new Date(post.createat).toLocaleString()}</p>

                                <a href={post.url} className="btn btn-secondary active"
                                    role="button" >Link</a>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    );
}

export default PodcastList;
