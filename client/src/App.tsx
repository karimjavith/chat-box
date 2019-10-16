import React from 'react';

import { Container } from 'semantic-ui-react';
import styled from 'styled-components';

import 'semantic-ui-less/semantic.less';
import Messages from './components/messages';

function App() {
    const AppContainer = styled(Container)`
        padding: 1rem;
        background-image: url(https://i.pinimg.com/originals/0d/1d/91/0d1d914691b6c540e82133b67e44d746.jpg);
        background-size: auto;
    `;
    return (
        <AppContainer fluid>
            <Messages />
        </AppContainer>
    );
}

export default App;
