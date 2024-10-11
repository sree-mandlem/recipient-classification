import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, InputGroup , Badge } from 'react-bootstrap';
import "./CheckRatesforMailingTheme.css";
import {useAppContext} from "../AppContext";

interface FormData {
    emails: string[];
    mailingName: string;
    profileCategory?: string | null;
    mailingGroupId: string;
}

interface ResultData {
    emails: {
        [category: string]: Array<{
            email: string;
            categoryRate: number;
            commonRate: number;
        }>;
    };
}

const CheckRatesforMailingTheme: React.FC = () => {
    const { mailingGroupId } = useAppContext(); // Access mailingGroupId from context
    const [error, setError] = useState<string | null>(null); // State to handle errors
    const [loading, setLoading] = useState<boolean>(false); // State to handle loading
    const [resultData, setResultData] = useState<ResultData | null>(null);

    const [formData, setFormData] = useState<FormData>({
        emails: [],
        mailingName: '',
        profileCategory: '',
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
            profileCategory: formData.profileCategory || null, // Can be nullable
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

    const renderEngagementText = (email: string, entry: any, aiCategory: string) => {
        if (entry) {
            return `${email} - ${aiCategory} category opening rate ${entry.categoryRate} (patron), overall opening rate ${entry.commonRate} (patron)`;
        } else {
            return `${email} - not found`;
        }
    };

    const renderResults = () => {
        if (!resultData) return null;

        // Assume "Holidays" is the AI-defined category (could be dynamic in future)
        const aiCategory = "Holidays";

        // Extract all emails for each category
        const patronsEmails = resultData.emails.patrons || [];
        const casualsEmails = resultData.emails.casuals || [];
        const disengagedEmails = resultData.emails.disengaged || [];
        const naEmails = resultData.emails.na || [];
        const noEmails = resultData.emails.no || [];

        return (
            <div>
                <h3>Result</h3>
                <h4>Category defined by AI: {aiCategory}</h4>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Engagement</th>
                    </tr>
                    </thead>
                    <tbody>
                    {emails.map((email, index) => {
                        const patronEntry = patronsEmails.find(item => item.email === email);
                        const casualEntry = casualsEmails.find(item => item.email === email);
                        const disengagedEntry = disengagedEmails.find(item => item.email === email);
                        const naEntry = naEmails.find(item => item.email === email);
                        const noEntry = noEmails.find(item => item.email === email);

                        let engagementText = "";
                        if (patronEntry) {
                            engagementText = renderEngagementText(email, patronEntry, aiCategory);
                        } else if (casualEntry) {
                            engagementText = renderEngagementText(email, casualEntry, aiCategory);
                        } else if (disengagedEntry) {
                            engagementText = renderEngagementText(email, disengagedEntry, aiCategory);
                        } else if (naEntry) {
                            engagementText = `${email} - not found for category ${aiCategory}, overall opening rate ${naEntry.commonRate} (patron)`;
                        } else if (noEntry) {
                            engagementText = `${email} - not found`;
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
                        <Form.Group controlId="profileCategory" className="form-group">
                            <Form.Control
                                type="text"
                                id="profileCategory"
                                value={formData.profileCategory || ''}
                                onFocus={() => handleFocus('profileCategory')}
                                onBlur={() => handleBlur('profileCategory')}
                                onChange={(e) => setFormData({ ...formData, profileCategory: e.target.value })}
                                placeholder={''}
                            />
                            <Form.Label htmlFor="profileCategory" className={isFocused['profileCategory'] ? 'focused' : ''}>Profile Category</Form.Label>
                        </Form.Group>
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
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>

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
