import { Form } from 'react-bootstrap'

/**
 * Checkboxes for job roles, plus a "primary" choice once 2+ are ticked.
 * value: { roles: string[], primary_role: string | null }
 * roleOptions: [{ value, label }] from GET /api/roles
 */
function RolePicker({ value, onChange, roleOptions, idPrefix = 'role' }) {
    const { roles, primary_role } = value;

    function toggle(role) {
        const next = roles.includes(role) ? roles.filter(r => r !== role) : [...roles, role];
        // Keep the primary valid: drop it if unticked, default to the first ticked role
        const primary = next.includes(primary_role) ? primary_role : (next[0] ?? null);
        onChange({ roles: next, primary_role: primary });
    }

    return (
        <fieldset>
            <legend className="form-label fs-6 mb-2">Job roles</legend>
            <div className="row row-cols-1 row-cols-sm-2 g-2">
                {roleOptions.map(option => (
                    <div className="col" key={option.value}>
                        <Form.Check
                            type="checkbox"
                            id={`${idPrefix}-${option.value}`}
                            label={option.label}
                            checked={roles.includes(option.value)}
                            onChange={() => toggle(option.value)}
                        />
                    </div>
                ))}
            </div>

            {roles.length > 1 && (
                <Form.Group className="mt-3" controlId={`${idPrefix}-primary`}>
                    <Form.Label>Primary role</Form.Label>
                    <Form.Select
                        value={primary_role ?? ''}
                        onChange={e => onChange({ roles, primary_role: e.target.value })}
                    >
                        {roles.map(role => (
                            <option key={role} value={role}>
                                {roleOptions.find(o => o.value === role)?.label ?? role}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            )}
            {roles.length === 0 && (
                <Form.Text>No roles selected: they can't be assigned to shifts until they have one.</Form.Text>
            )}
        </fieldset>
    )
}

export default RolePicker
