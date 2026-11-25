import { useEffect, useState } from 'react'
import { Table, Button, Alert, Spinner, Badge } from 'react-bootstrap'
import { apiJson } from '../api.js'
import { useAuth } from '../auth/AuthContext.jsx'
import AddStaffModal from './AddStaffModal.jsx'
import EditRolesModal from './EditRolesModal.jsx'
import StaffStatusModal from './StaffStatusModal.jsx'
import RoleBadges from './RoleBadges.jsx'

/** Manager view of all staff: add people, edit roles, deactivate/reactivate. */
function StaffSection() {
    const { user } = useAuth();
    const [staff, setStaff] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [notice, setNotice] = useState('');

    const [showAdd, setShowAdd] = useState(false);
    const [editingRoles, setEditingRoles] = useState(null);   // staff member or null
    const [changingStatus, setChangingStatus] = useState(null);

    /** Fetches staff and the role list together; the caller stores the results. */
    function fetchStaffAndRoles() {
        return Promise.all([apiJson('/api/staff'), apiJson('/api/roles')]);
    }

    function showLoaded([staffList, roles]) {
        setStaff(staffList);
        setRoleOptions(roles);
    }

    useEffect(() => {
        fetchStaffAndRoles()
            .then(showLoaded)
            .catch(err => setLoadError(err.message))
            .finally(() => setLoading(false));
    }, []);

    function retry() {
        setLoadError('');
        setLoading(true);
        fetchStaffAndRoles()
            .then(showLoaded)
            .catch(err => setLoadError(err.message))
            .finally(() => setLoading(false));
    }

    /** Swap the updated person into the list without refetching everything. */
    function replace(updated) {
        setStaff(list => list.map(s => (s.staff_id === updated.staff_id ? updated : s)));
    }

    return (
        <section aria-labelledby="staff-heading" className="mt-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h2 id="staff-heading" className="h4 mb-0">Staff</h2>
                <Button onClick={() => setShowAdd(true)} disabled={loading || !!loadError}>Add staff member</Button>
            </div>

            {notice && <Alert variant="success" dismissible onClose={() => setNotice('')}>{notice}</Alert>}

            {loading ? (
                <div className="py-4 text-center"><Spinner /></div>
            ) : loadError ? (
                <Alert variant="danger">
                    Couldn't load staff: {loadError}{' '}
                    <Alert.Link as="button" className="btn btn-link p-0 align-baseline" onClick={retry}>
                        Try again
                    </Alert.Link>
                </Alert>
            ) : staff.length === 0 ? (
                <p className="text-body-secondary">No staff yet. Add your first staff member to get started.</p>
            ) : (
                <Table responsive hover className="align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Roles</th>
                            <th scope="col">Status</th>
                            <th scope="col"><span className="visually-hidden">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(s => {
                            const isMe = s.staff_id === user.staff_id;
                            return (
                                <tr key={s.staff_id} className={s.is_active ? undefined : 'text-body-secondary'}>
                                    <td>
                                        {s.first_name} {s.last_name}
                                        {s.access_level === 'manager' && <Badge bg="secondary" className="ms-2">Manager</Badge>}
                                        {isMe && <span className="ms-2 small text-body-secondary">(you)</span>}
                                    </td>
                                    <td>{s.email}</td>
                                    <td><RoleBadges roles={s.roles} primaryRole={s.primary_role} roleOptions={roleOptions} /></td>
                                    <td>
                                        {s.is_active
                                            ? <Badge bg="success">Active</Badge>
                                            : <Badge bg="secondary">Inactive</Badge>}
                                        {s.is_active && s.must_change_password && (
                                            <div className="small text-body-secondary">Hasn't signed in yet</div>
                                        )}
                                    </td>
                                    <td className="text-end text-nowrap">
                                        <Button size="sm" variant="outline-primary" className="me-2"
                                                onClick={() => setEditingRoles(s)}
                                                aria-label={`Edit roles for ${s.first_name} ${s.last_name}`}>
                                            Edit roles
                                        </Button>
                                        {!isMe && (
                                            <Button size="sm" variant={s.is_active ? 'outline-danger' : 'outline-success'}
                                                    onClick={() => setChangingStatus(s)}
                                                    aria-label={`${s.is_active ? 'Deactivate' : 'Reactivate'} ${s.first_name} ${s.last_name}`}>
                                                {s.is_active ? 'Deactivate' : 'Reactivate'}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}

            <AddStaffModal
                show={showAdd}
                roleOptions={roleOptions}
                onClose={() => setShowAdd(false)}
                onCreated={created => {
                    setStaff(list => [...list, created]);
                    setNotice(`Added ${created.first_name} ${created.last_name}.`);
                }}
            />

            {editingRoles && (
                <EditRolesModal
                    key={editingRoles.staff_id}
                    staff={editingRoles}
                    roleOptions={roleOptions}
                    onClose={() => setEditingRoles(null)}
                    onSaved={updated => {
                        replace(updated);
                        setEditingRoles(null);
                        setNotice(`Updated roles for ${updated.first_name} ${updated.last_name}.`);
                    }}
                />
            )}

            {changingStatus && (
                <StaffStatusModal
                    key={changingStatus.staff_id}
                    staff={changingStatus}
                    onClose={() => setChangingStatus(null)}
                    onSaved={updated => {
                        replace(updated);
                        setChangingStatus(null);
                        setNotice(`${updated.first_name} ${updated.last_name} is now ${updated.is_active ? 'active' : 'inactive'}.`);
                    }}
                />
            )}
        </section>
    )
}

export default StaffSection
