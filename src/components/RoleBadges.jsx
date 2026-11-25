/** Shows a staff member's roles as badges, primary role first and highlighted. */
function RoleBadges({ roles, primaryRole, roleOptions }) {
    if (roles.length === 0) return <span className="text-body-secondary">None</span>;

    const label = role => roleOptions.find(o => o.value === role)?.label ?? role;
    const sorted = [...roles].sort((a, b) => (a === primaryRole ? -1 : b === primaryRole ? 1 : 0));

    return (
        <div className="d-flex flex-wrap gap-1">
            {sorted.map(role => (
                <span key={role}
                      className={`badge ${role === primaryRole ? 'text-bg-primary' : 'text-bg-light border'}`}
                      title={role === primaryRole ? 'Primary role' : undefined}>
                    {label(role)}
                </span>
            ))}
        </div>
    )
}

export default RoleBadges
