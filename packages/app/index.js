import React from 'react';
import ReactDOM from 'react-dom';

import styled from '@emotion/styled';
import { ThemeProvider } from 'emotion-theming';

const theme = {
  primaryColor: 'blue',
};

const StyledDiv = styled.div(props => ({
  backgroundColor: props.theme.primaryColor || 'red'
}));

const App = () => (
  React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(StyledDiv, {}, 'The background of this div should be blue.')
  )
);

ReactDOM.render(React.createElement(App), document.getElementById('root'));
