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

// `
//   background-color: ${props => props.theme.primaryColor}
// `;

const App = () => (
  React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(StyledDiv, {}, 'Bye')
  )
);

ReactDOM.render(React.createElement(App), document.getElementById('root'));
