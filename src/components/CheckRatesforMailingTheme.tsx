import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import "./CheckRatesforMailingTheme.css";
import {useAppContext} from "../AppContext";

interface FormData {
    emails: string[];
    mailingName: string;
    mailingGroupId: string;
}

interface ResultData {
    mailingCategory: string;
    emails: Array<{
        email: string;
        categoryRate: number;
        commonRate: number;
        engagementType: String
    }>;
}

const CheckRatesforMailingTheme: React.FC = () => {
    const { mailingGroupId } = useAppContext(); // Access mailingGroupId from context
    const [error, setError] = useState<string | null>(null); // State to handle errors
    const [loading, setLoading] = useState<boolean>(false); // State to handle loading
    const [resultData, setResultData] = useState<ResultData | null>(null);

    const [formData, setFormData] = useState<FormData>({
        emails: [],
        mailingName: '',
        mailingGroupId: ''
    });

    const [emailInput, setEmailInput] = useState<string>('');
    const [emails, setEmails] = useState<string[]>([]);

    const [isFocused, setIsFocused] = useState<{ [key: string]: boolean }>({});

    const handleFocus = (field: string) => {
        setIsFocused({ ...isFocused, [field]: true });
    };

    const handleBlur = (field: string) => {
        setIsFocused({ ...isFocused, [field]: false });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmails(emailInput
            .split(/[,;\n]+/)
            .map((email) => email.trim())
            .filter((email) => email !== '')
        );

        // Prepare the request body
        const requestBody: FormData = {
            emails: emails,
            mailingName: formData.mailingName,
            mailingGroupId: mailingGroupId || "12345" // From context
        };

        setError(null); // Clear previous errors
        setLoading(true); // Show loading state

        try {
            const response = await fetch('http://localhost:8080/api/engagement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody), // Send request body as JSON
            });

            if (!response.ok) {
                throw new Error('Failed to fetch the engagement rates');
            }

            const data: ResultData = await response.json(); // Parse response as JSON
            setResultData(data); // Store the result in state
        } catch (error: any) {
            setError(error.message || 'Something went wrong');
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    const renderEngagementText = (email: string, entry: any, mailingCategory: string) => {
        if (entry.categoryRate === 0) {
            return `For this category the user has no prior engagement to categorize, but has a overall rate ${entry.commonRate}`;
        } else {
            return `For the category [${mailingCategory}] the user is categorized as a [${entry.engagementType}] with specific category rate ${entry.categoryRate} and overall rate ${entry.commonRate}`;
        }
    };

    const renderResults = () => {
        if (!resultData) return null;

        // Assume "Holidays" is the AI-defined category (could be dynamic in future)
        const mailingCategory = resultData.mailingCategory;

        return (
            <div>
                <h3>Result</h3>
                <h4>Category defined by AI: {mailingCategory}</h4>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Engagement</th>
                    </tr>
                    </thead>
                    <tbody>
                    {emails.map((email, index) => {
                        const entry = resultData.emails.find(item => item.email === email);

                        let engagementText;
                        if (entry) {
                            engagementText = renderEngagementText(email, entry, mailingCategory);
                        } else {
                            engagementText = `Email not found`;
                        }

                        return (
                            <tr key={index}>
                                <td>{email}</td>
                                <td>{engagementText}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </div>
        );
    };

    return (
        <Container fluid className="form-container">
            {/* Form Section */}
            <Row className="form-section">
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="mailingName" className="form-group">
                            <Form.Control
                                type="text"
                                id="mailingName"
                                value={formData.mailingName}
                                onFocus={() => handleFocus('mailingName')}
                                onBlur={() => handleBlur('mailingName')}
                                onChange={(e) => setFormData({ ...formData, mailingName: e.target.value })}
                                placeholder={''}
                            />
                            <Form.Label htmlFor="mailingName" className={isFocused['mailingName'] ? 'focused' : ''}>Mailing Name</Form.Label>
                        </Form.Group>
                        <Form.Group controlId="emails" className="form-group">
                            <Form.Control
                                as="textarea"
                                rows={5} // Set the number of rows for the textarea
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder={''}
                            />
                            <Form.Label>Emails</Form.Label>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {loading? 'Loading...' : 'Submit'}
                        </Button>
                    </Form>
                </Col>
            </Row>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Results Section */}
            {resultData && (
                <Row className="my-4">
                    <Col>
                        {renderResults()}
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default CheckRatesforMailingTheme;
