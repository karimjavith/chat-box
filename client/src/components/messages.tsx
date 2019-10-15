import React, { useState, useEffect, useLayoutEffect } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import { Button, Comment, Form, Header, Container, Segment } from 'semantic-ui-react';

const socket = io('http://localhost:3002');

const CommentGroup = styled(Comment.Group)`
    margin: 0 auto !important;
    padding: 1rem;
    border: 1px solid #fff;
    height: 100%;
    overflow: auto;
`;

const CommentContainer = styled(Container)`
    display: table !important;
    height: 100%;
    width: 100% !important;
`;
const CommentHeader = styled(Header)`
    color: #fff;
`;
const CommentSegment = styled(Segment)`
    display: table-cell;
    vertical-align: bottom;
    background: transparent !important;
`;

const MessageComment = styled(Comment)`
    margin-bottom: 2rem !important;
    background-color: #f5f5f5 !important;
    border-radius: 3rem !important;
    padding: 1rem !important;
    width: calc(100% - 120px);
`;
const MessageText = styled(Comment.Text)`
    white-space: pre-line;
`;
const MessageForm = styled(Form)`
    margin: 5rem 0;
`;
const MessageButton = styled(Button)`
    background-color: #000 !important;
`;
type Chat = {
    message: string;
    period: string;
};
type MessageState = {
    message: string;
    chat: Chat[];
};
const initialState: MessageState = {
    message: null,
    chat: [],
};
const Messages = () => {
    const [state, setstate] = useState(initialState);
    useEffect(() => {
        fetch('/api/chat')
            .then(response => response.json())
            .then(data => {
                setstate({ ...state, chat: data });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useLayoutEffect(() => {
        const inputText = document.getElementById('input-text');
        inputText && inputText.focus();
        return inputText && inputText.scrollIntoView({ behavior: 'smooth' });
    });
    const sendMessage = (message: string) => {
        setstate({
            ...state,
            chat: [...state.chat, { message, period: new Date().toLocaleString() }],
            message: '',
        });
        socket.emit('chat message', { message: message, period: new Date().toLocaleString() });
    };
    const handleChange = (event: any) => setstate({ ...state, message: event.currentTarget.value });
    return (
        <CommentGroup>
            <CommentHeader as="h3" dividing>
                Comments
            </CommentHeader>
            <CommentContainer>
                <CommentSegment>
                    {state.chat &&
                        state.chat.length > 0 &&
                        state.chat.map((item: Chat, index: number) => (
                            <MessageComment
                                key={item.message}
                                style={{ float: index % 2 === 0 ? 'right' : 'left' }}
                            >
                                <Comment.Avatar src="https://icon-library.net/images/my-profile-icon-png/my-profile-icon-png-3.jpg" />
                                <Comment.Content>
                                    <Comment.Author as="a">User</Comment.Author>
                                    <Comment.Metadata>
                                        <div>{item.period}</div>
                                    </Comment.Metadata>
                                    <MessageText>{item.message}</MessageText>
                                </Comment.Content>
                            </MessageComment>
                        ))}

                    <MessageForm reply>
                        <Form.TextArea
                            id="input-text"
                            value={state.message}
                            onChange={handleChange}
                        />
                        <MessageButton
                            floated="right"
                            animated="fade"
                            content="Send message"
                            labelPosition="right"
                            icon="edit"
                            primary
                            disabled={!state.message}
                            onClick={() => {
                                sendMessage(state.message);
                            }}
                        />
                    </MessageForm>
                </CommentSegment>
            </CommentContainer>
        </CommentGroup>
    );
};

export default Messages;
