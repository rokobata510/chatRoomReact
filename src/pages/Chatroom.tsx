import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as StompJs from "@stomp/stompjs";
import {IFrame, IMessage} from "@stomp/stompjs";

function ChatRoom() {
    let { UUID } = useParams();
    const [authenticated, setAuthenticated] = useState(localStorage.getItem("token")!=null);
    const [username, setUsername] = useState(localStorage.getItem("user"))
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState("");
    const [senderName, setSenderName] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [stompClient, setStompClient] = useState<StompJs.Client | null>(null);

    useEffect(() => {
            const client = new StompJs.Client({
                brokerURL: "ws://87.97.11.38:8080/greeting",
                connectHeaders: {
                    Authorization: "Bearer "+ localStorage.getItem("token"),
                    User: username??"null"
                },
                onConnect: function (frame:IFrame) {
                    console.log("Connected: " + frame);
                    setConnected(true);
                    client.subscribe(`/topic/room/${UUID}`, function (message: IMessage) {
                        showGreeting(message.body);
                    });
                    client.subscribe("/user/queue/errors", function (error: IMessage) {
                        console.log(error);
                    });
                },
                onWebSocketError: function (event:IFrame) {
                    console.error(event);
                },
                onStompError: function (event:IFrame) {
                    console.error(event);
                },
                debug: (str: string) => console.log(str),
            });
            setStompClient(client);

            return () => {
                if (client) {
                    client.deactivate();
                    setConnected(false);
                    console.log("Disconnected");
                }
            };

    }, [UUID, authenticated]);

    function activate() {
        if (stompClient) {
            console.log(stompClient)
            stompClient.activate();

        } else {
            console.error("stompClient is null");
        }
    }

    function deactivate() {
        if (stompClient && stompClient.connected) {
            stompClient.deactivate();
            setConnected(false);
            console.log("Disconnected");
        } else {
            console.error("WebSocket is not connected");
        }
    }

    function sendName() {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/app/room/${UUID}`,

                body: JSON.stringify({
                    content: `${message}`,
                    sender: senderName,
                    room: UUID
                }),
            });
            setMessage("");
        } else {
            console.error("WebSocket is not connected");
        }
    }

    function showGreeting(message: string) {
        setMessages((prevMessages) => [...prevMessages, message]);
    }

    function copyToClipboard() {
        const url = window.location.href;
        const tempInput = document.createElement("input");
        tempInput.style.position = "absolute";
        tempInput.style.left = "-9999px";
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        console.log("URL copied to clipboard");
    }



    return (
        <div>
            <h1>Chatroom</h1>
            <p>UUID: {UUID}</p>
            <form onSubmit={(event) => event.preventDefault()}>
                <label>
                    WebSocket connection:
                    <button onClick={activate} disabled={connected}>
                        Connect
                    </button>
                    <button onClick={deactivate} disabled={!connected}>
                        Disconnect
                    </button>
                </label>
            </form>
            <form onSubmit={(event) => event.preventDefault()}>
                <label>
                    What is your message?
                    <input
                        type="text"
                        placeholder="Your message here..."
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                    />
                </label>
                <label>
                    Enter your display name:
                    <input
                        type="text"
                        placeholder="Display name..."
                        value={senderName}
                        onChange={(event) => setSenderName(event.target.value)}
                    />
                </label>
                <button onClick={sendName}>Send</button>
            </form>
            <button onClick={copyToClipboard}>Copy URL</button>
            <div>
                <h3>Messages</h3>
                <h4>Sender: {senderName}, Room: {UUID}</h4>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ChatRoom;
