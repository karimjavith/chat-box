import React, { useState, useEffect, useLayoutEffect } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import { Button, Comment, Form, Container, Segment, List, Image } from 'semantic-ui-react';
import cp from 'child_process';
import os from 'os';

const getUsername = () => {
    switch (process.platform) {
        case 'win32':
            return process.env.COMPUTERNAME;
        case 'darwin':
            return cp
                .execSync('scutil --get ComputerName')
                .toString()
                .trim();
        default:
            return os.hostname();
    }
};

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
const HeaderSegment = styled(Segment)`
    max-width: 650px !important;
    margin: 0 auto !important;
    border-radius: 0 !important;
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
    userName: string;
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
            chat: [
                ...state.chat,
                { message, period: new Date().toLocaleString(), userName: getUsername() },
            ],
            message: '',
        });
        socket.emit('chat message', {
            message: message,
            period: new Date().toLocaleString(),
            userName: getUsername(),
        });
    };
    const handleChange = (event: any) => setstate({ ...state, message: event.currentTarget.value });
    return (
        <>
            <HeaderSegment>
                <List relaxed="very">
                    <List.Item as="a">
                        <Image
                            avatar
                            src="https://icon-library.net/images/my-profile-icon-png/my-profile-icon-png-3.jpg"
                        />
                        <List.Content>
                            <List.Header>{getUsername().toUpperCase()}</List.Header>
                            <List.Description>
                                {socket.connected && 'online'}
                                {socket.disconnected && 'offline'}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                </List>
            </HeaderSegment>
            <CommentGroup>
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
                                        <Comment.Author as="a">
                                            {item.userName || 'Anonymous'}
                                        </Comment.Author>
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
                                disabled={!state.message || socket.disconnected}
                                onClick={() => {
                                    sendMessage(state.message);
                                }}
                            />
                        </MessageForm>
                    </CommentSegment>
                </CommentContainer>
            </CommentGroup>
        </>
    );
};

export default Messages;
