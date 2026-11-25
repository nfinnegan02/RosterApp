import { useState } from 'react'
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from '../auth/AuthContext.jsx'

const MIN_LENGTH = 8;

/** Shown after sign-in when the account still has a temporary password. Can't be dismissed. */
function ChangePasswordModal() {
    const { user, changePassword, logout } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Please fill in all three fields.');
            return;
        }
        if (newPassword.length < MIN_LENGTH) {
            setError(`New password must be at least ${MIN_LENGTH} characters.`);
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        setSubmitting(true);
        try {
            await changePassword(currentPassword, newPassword);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        // backdrop="static" + keyboard={false}: can't be closed until the password is changed
        <Modal show centered backdrop="static" keyboard={false}>
            <Form onSubmit={handleSubmit} noValidate>
                <Modal.Header>
                    <Modal.Title>Set a new password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-body-secondary">
                        Welcome, {user.first_name}. You signed in with a temporary password,
                        so please choose your own before continuing.
                    </p>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3" controlId="currentPassword">
                        <Form.Label>Current (temporary) password</Form.Label>
                        <Form.Control type="password" autoComplete="current-password" autoFocus required
                                      value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="newPassword">
                        <Form.Label>New password</Form.Label>
                        <Form.Control type="password" autoComplete="new-password" required minLength={MIN_LENGTH}
                                      aria-describedby="newPasswordHelp"
                                      value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        <Form.Text id="newPasswordHelp">At least {MIN_LENGTH} characters.</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="confirmPassword">
                        <Form.Label>Confirm new password</Form.Label>
                        <Form.Control type="password" autoComplete="new-password" required
                                      value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button variant="link" className="px-0" onClick={logout} disabled={submitting}>
                        Sign out
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? <Spinner size="sm" /> : 'Save password'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ChangePasswordModal
