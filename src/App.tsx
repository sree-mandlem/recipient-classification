import React from 'react';
import './App.css';
import {Container} from 'react-bootstrap';
import {AppProvider} from './AppContext'; // Import the provider
import Header from "./components/Header";
import Navigation from "./components/Navigation";

const App: React.FC = () => {

    return (
        <AppProvider>
            <Container fluid className="app-container">
                <Header/>
                <Navigation/>
            </Container>
        </AppProvider>
    );
};

export default App;
