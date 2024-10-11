import React, { useState } from 'react';
import { Row, Col, Nav, Tab } from 'react-bootstrap';
import SearchByEmail from './SearchByEmail';
import CheckRatesforMailingTheme from './CheckRatesforMailingTheme';
import { useAppContext } from '../AppContext'; // Import the context to access mailingGroupId
import "./Navigation.css";

const Navigation: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('tab1');
    const { mailingGroupId } = useAppContext(); // Access mailingGroupId from context

    return (
        <Row className="nav-section">
            <Col>
                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k!)}>
                    <div className="d-flex justify-content-between align-items-center">
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="tab1">Search by Email</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="tab2">Check rates for mailing theme</Nav.Link>
                            </Nav.Item>
                        </Nav>

                        {/* Profile Section (right aligned) */}
                        <div className="profile-info">
                            <span>Mailing Group ID: {mailingGroupId || "12345"}</span>
                        </div>
                    </div>
                    <Tab.Content>
                        <Tab.Pane eventKey="tab1">
                            <SearchByEmail/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="tab2">
                            <CheckRatesforMailingTheme/>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Col>
        </Row>
    );
};

export default Navigation;
