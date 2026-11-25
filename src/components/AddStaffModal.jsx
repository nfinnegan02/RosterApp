import { useState } from 'react'
import { Modal, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap'
import { apiJson } from '../api.js'
import RolePicker from './RolePicker.jsx'

const EMPTY_FORM = { first_name: '', last_name: '', email: '', access_level: 'staff', roles: [], primary_role: null };

/**
 * Lets a manager create a staff account. The server generates a temporary
 * password, which is shown once so the manager can pass it on.
 */
function AddStaffModal({ show, onClose, onCreated, roleOptions }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [created, setCreated] = useState(null); // { staff, temporaryPassword }
    const [copied, setCopied] = useState(false);

    function update(field) {
        return e => setForm({ ...form, [field]: e.target.value });
    }

    function handleClose() {
        setForm(EMPTY_FORM);
        setError('');
        setCreated(null);
        setCopied(false);
        onClose();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
            setError('Please fill in first name, last name and email.');
            return;
        }

        setSubmitting(true);
        try {
            const result = await apiJson('/api/staff', { method: 'POST', body: form });
            setCreated(result);
            onCreated?.(result.staff);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function copyPassword() {
        await navigator.clipboard.writeText(created.temporaryPassword);
        setCopied(true);
    }

    return (
        <Modal show={show} onHide={handleClose} centered backdrop={submitting ? 'static' : true}>
            {created ? (
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>Staff member added</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            <strong>{created.staff.first_name} {created.staff.last_name}</strong> can now sign in
                            as <strong>{created.staff.email}</strong> with this temporary password:
                        </p>
                        <InputGroup className="mb-2">
                            <Form.Control readOnly value={created.temporaryPassword}
                                          className="font-monospace" aria-label="Temporary password" />
                            <Button variant="outline-secondary" onClick={copyPassword}>
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </InputGroup>
                        <Alert variant="warning" className="mb-0">
                            This password is only shown once. They will be asked to change it when they first sign in.
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleClose}>Done</Button>
                    </Modal.Footer>
                </>
            ) : (
                <Form onSubmit={handleSubmit} noValidate>
                    <Modal.Header closeButton={!submitting}>
                        <Modal.Title>Add staff member</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <div className="row g-3">
                            <Form.Group className="col-sm-6" controlId="first_name">
                                <Form.Label>First name</Form.Label>
                                <Form.Control autoFocus required maxLength={50} autoComplete="off"
                                              value={form.first_name} onChange={update('first_name')} />
                            </Form.Group>
                            <Form.Group className="col-sm-6" controlId="last_name">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control required maxLength={50} autoComplete="off"
                                              value={form.last_name} onChange={update('last_name')} />
                            </Form.Group>
                            <Form.Group className="col-12" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" required maxLength={255} autoComplete="off"
                                              value={form.email} onChange={update('email')} />
                            </Form.Group>
                            <Form.Group className="col-12" controlId="access_level">
                                <Form.Label>Access level</Form.Label>
                                <Form.Select value={form.access_level} onChange={update('access_level')}>
                                    <option value="staff">Staff: can view the published rota</option>
                                    <option value="manager">Manager: can edit rosters and add staff</option>
                                </Form.Select>
                            </Form.Group>
                            <div className="col-12">
                                <RolePicker
                                    idPrefix="add-role"
                                    roleOptions={roleOptions}
                                    value={{ roles: form.roles, primary_role: form.primary_role }}
                                    onChange={selection => setForm({ ...form, ...selection })}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleClose} disabled={submitting}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Spinner size="sm" /> : 'Add staff member'}
                        </Button>
                    </Modal.Footer>
                </Form>
            )}
        </Modal>
    )
}

export default AddStaffModal
