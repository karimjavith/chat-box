import React from 'react';

import { Container } from 'semantic-ui-react';
import styled from 'styled-components';

import 'semantic-ui-css/semantic.min.css';
import Messages from './components/messages';

function App() {
    const AppContainer = styled(Container)`
        margin: 1rem;
        padding: 1rem;
        height: calc(100vh);
    `;
    return (
        <AppContainer fluid>
            <Messages />
        </AppContainer>
    );
}

export default App;
