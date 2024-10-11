import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './Header.css'; // Assuming you have the relevant CSS in this file

const Header: React.FC = () => {
    return (
        <Row className="header">
            <Col>
                <header className="custom-header">
                    <div className="header-content">
                        {/* Left Section */}
                        <div className="header-left">
                            <div className="icon-box">
                                <div className="icon"></div>
                            </div>
                            <div className="text-content">
                                <h1>Hackathon</h1>
                                <h1>Recipient Classification</h1>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="divider"></div>

                        {/* Right Section */}
                        <div className="header-right">
                            <h1>Demo</h1>
                        </div>
                    </div>
                </header>
            </Col>
        </Row>
    );
};

export default Header;
