import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateNewRoomButton(props: any) {
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();
    let UUID = "";

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    function getUUID() {
        fetch("http://87.97.11.38:8080/random-id")
            .then((response) => response.text())
            .then((body) => {
                console.log("body: " + body);
                UUID = body.toString();
                console.log("UUID: " + UUID);
                navigate("/chatroom/" + UUID);
            });
    }

    return (
        <div>
            <p>Token: {token}</p>
            <button onClick={getUUID}>
                Create New Room then redirect to it
            </button>
        </div>
    );
}

export default CreateNewRoomButton;
