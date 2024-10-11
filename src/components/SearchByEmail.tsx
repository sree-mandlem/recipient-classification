import React, {useState} from 'react';
import {Container, Row, Col, Form, Button, InputGroup, Table, Card} from 'react-bootstrap';
import './SearchByEmail.css';
import {useAppContext} from "../AppContext";


interface SearchResult {
    email: string;
    commonRate: number;
    categories: {
        categoryName: string;
        rate: number;
    }[];
}

const SearchByEmail: React.FC = () => {
    const [email, setEmail] = useState<string>(''); // Email input state
    const [result, setResult] = useState<SearchResult | null>(null); // State to store search result
    const [error, setError] = useState<string | null>(null); // State to handle error messages
    const [loading, setLoading] = useState<boolean>(false); // State to show loading status
    const {mailingGroupId} = useAppContext() || "12345"; // Get the mailingGroupId from context

    const handleSearch = async () => {
        if (!email) { // Should you check for mailingGroupId
            setError('Please provide an email');
            return;
        }

        setError(null);
        setLoading(true); // Set loading to true when starting the request

        try {
            const response = await fetch(`http://localhost:8080/api/${mailingGroupId || "12345"}/engagement/${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch the engagement data');
            }

            const data: SearchResult = await response.json(); // Expecting the API response to match the structure

            setResult(data); // Set the result in state
        } catch (error: any) {
            setError(error.message || 'Something went wrong');
        } finally {
            setLoading(false); // Set loading to false after the request is done
        }
    };

    const [isFocused, setIsFocused] = useState<{ [key: string]: boolean }>({});

    const handleFocus = (field: string) => {
        setIsFocused({...isFocused, [field]: true});
    };

    const handleBlur = (field: string) => {
        setIsFocused({...isFocused, [field]: false});
    };

    return (
        <Container fluid className="search-container">
            {/* Search Section */}
            <Row className="search-section align-items-center">
                <Col>
                    <Form className="d-flex justify-content-center">
                        <Form.Group controlId="email" className="form-group d-flex">
                            <InputGroup>
                                <Form.Control
                                    type="email"
                                    id="email"
                                    value={email}
                                    onFocus={() => handleFocus('emails')}
                                    onBlur={() => handleBlur('emails')}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={''}
                                />
                                <Form.Label htmlFor="email" className={isFocused['emails'] ? 'focused' : ''}>Enter email
                                    to search</Form.Label>
                                <Button variant="primary" onClick={handleSearch}>
                                    {loading? 'Searching...' : 'Search'}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {result && (
                <Card className="mt-4">
                    <Card.Header as="h5">Search Result for {result.email}</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <strong>Common Rate:</strong> {result.commonRate}
                        </Card.Text>

                        <h6>Categories:</h6>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Rate</th>
                            </tr>
                            </thead>
                            <tbody>
                            {result.categories.map((category, index) => (
                                <tr key={index}>
                                    <td>{category.categoryName}</td>
                                    <td>{category.rate}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default SearchByEmail;
