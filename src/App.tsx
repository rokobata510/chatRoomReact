import React from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import ChatRoom from './pages/Chatroom';
import Login from "./pages/Login";
import PrivateRoute from "./pages/PrivateRoute";
import CreateNewRoomButton from "./components/CreateNewRoomButton";
import Index from "./pages";

//      <Router>
//                 <Routes>
//                     <Route path="/" element={<Navigate to={token ? "/newroom" : "/login"} />} />
//                     <Route path="/login" element={<Login/>}/>
//                     <Route path="/chatroom" element={
//                         <PrivateRoute>
//                             <ChatRoom/>
//                         </PrivateRoute>
//                     }/>
//                     <Route path="/newroom" element={
//                         <PrivateRoute>
//                             <CreateNewRoomButton/>
//                         </PrivateRoute>
//                     }/>
//                 </Routes>
//             </Router>
function App() {
    const token = localStorage.getItem('token');

    return (
        <div>
            <p>:)</p>
        </div>
    );
}

export default App;
