import { useState } from 'react'
import { Modal, Button, Alert, Spinner } from 'react-bootstrap'
import { apiJson } from '../api.js'

/** Confirms deactivating or reactivating a staff member. */
function StaffStatusModal({ staff, onClose, onSaved }) {
    const deactivating = staff.is_active;
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    async function confirm() {
        setError('');
        setSaving(true);
        try {
            const updated = await apiJson(`/api/staff/${staff.staff_id}/status`, {
                method: 'PATCH',
                body: { is_active: !deactivating },
            });
            onSaved(updated);
        } catch (err) {
            setError(err.message);
            setSaving(false);
        }
    }

    const name = `${staff.first_name} ${staff.last_name}`;

    return (
        <Modal show onHide={onClose} centered backdrop={saving ? 'static' : true}>
            <Modal.Header closeButton={!saving}>
                <Modal.Title>{deactivating ? `Deactivate ${name}?` : `Reactivate ${name}?`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {deactivating ? (
                    <p className="mb-0">
                        They'll be signed out straight away and won't be able to sign in or be given new shifts.
                        Their past shifts and history are kept, and you can reactivate them at any time.
                    </p>
                ) : (
                    <p className="mb-0">They'll be able to sign in again with their existing password.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onClose} disabled={saving}>Cancel</Button>
                <Button variant={deactivating ? 'danger' : 'primary'} onClick={confirm} disabled={saving}>
                    {saving ? <Spinner size="sm" /> : deactivating ? 'Deactivate' : 'Reactivate'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default StaffStatusModal
