import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap'

function LoginModal() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        setSubmitting(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }
    return (
        // Stops the modal from closing when clicking outside
        <Modal show centered backdrop="static" keyboard={false}> 
            <Form onSubmit={handleSubmit} noValidate>
                <Modal.Header>
                    <Modal.Title>Sign In to RosterApp</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>} 
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" autoComplete="current-password" required value={email} onChange={e => setEmail(e.target.value)} />
                        <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
                        <Form.Control.Feedback type="invalid">Please enter your password.</Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" className="w-100" disabled={submitting}>
                        {submitting ? <Spinner size="sm" /> : 'Sign in'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default LoginModal