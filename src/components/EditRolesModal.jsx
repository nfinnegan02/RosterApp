import { useState } from 'react'
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { apiJson } from '../api.js'
import RolePicker from './RolePicker.jsx'

/** Change which job roles a staff member can work. Render with a `key` so it resets per person. */
function EditRolesModal({ staff, onClose, onSaved, roleOptions }) {
    const [selection, setSelection] = useState({ roles: staff.roles, primary_role: staff.primary_role });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const updated = await apiJson(`/api/staff/${staff.staff_id}/roles`, { method: 'PUT', body: selection });
            onSaved(updated);
        } catch (err) {
            setError(err.message);
            setSaving(false);
        }
    }

    return (
        <Modal show onHide={onClose} centered backdrop={saving ? 'static' : true}>
            <Form onSubmit={handleSubmit} noValidate>
                <Modal.Header closeButton={!saving}>
                    <Modal.Title>Roles for {staff.first_name} {staff.last_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <RolePicker idPrefix="edit-role" roleOptions={roleOptions} value={selection} onChange={setSelection} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onClose} disabled={saving}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? <Spinner size="sm" /> : 'Save roles'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default EditRolesModal
