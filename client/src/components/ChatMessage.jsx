import React from "react";

const ChatMessage = ({message}) => {
    return(
        <div className="chat-message">
            <p>{message}</p>
        </div>
    )
};

export default ChatMessage;