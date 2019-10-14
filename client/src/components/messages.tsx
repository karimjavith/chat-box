import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import { Button, Comment, Form, Header, Message, Container, Segment } from 'semantic-ui-react';

const socket = io('http://localhost:3002');

const CommentGroup = styled(Comment.Group)`
    margin: 0 auto !important;
    padding: 1rem;
    height: 100%;
`;

const CommentContainer = styled(Container)`
    display: table !important;
    height: 100%;
    width: 100% !important;
`;
const CommentSegment = styled(Segment)`
    display: table-cell;
    vertical-align: bottom;
`;

const MessageComment = styled(Comment)`
    margin-bottom: 2rem !important;
`;

const MessageForm = styled(Form)`
    margin: 5rem 0;
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
    const sendMessage = (message: string) => {
        setstate({
            ...state,
            chat: [...state.chat, { message, period: new Date().toLocaleDateString() }],
            message: '',
        });
        socket.emit('chat message', { message: message, period: new Date().toLocaleDateString() });
    };
    const handleChange = (event: any) => setstate({ ...state, message: event.currentTarget.value });
    return (
        <CommentGroup>
            <Header as="h3" dividing>
                Comments
            </Header>
            {state.chat && state.chat.length === 0 && (
                <Message header={<span>No messages.</span>} />
            )}
            <CommentContainer>
                <CommentSegment>
                    {state.chat &&
                        state.chat.length > 0 &&
                        state.chat.map((item: Chat) => (
                            <MessageComment key={item.message}>
                                <Comment.Avatar src="https://icon-library.net/images/my-profile-icon-png/my-profile-icon-png-3.jpg" />
                                <Comment.Content>
                                    <Comment.Author as="a">User</Comment.Author>
                                    <Comment.Metadata>
                                        <div>{item.period}</div>
                                    </Comment.Metadata>
                                    <Comment.Text>{item.message}</Comment.Text>
                                </Comment.Content>
                            </MessageComment>
                        ))}

                    <MessageForm reply>
                        <Form.TextArea value={state.message} onChange={handleChange} />
                        <Button
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
