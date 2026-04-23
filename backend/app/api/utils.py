from sqlalchemy.orm import Session

from app.models.entities import AuditLog


def write_audit_log(
    db: Session,
    *,
    actor: str,
    action: str,
    entity: str,
    entity_id: str | None = None,
    details: str | None = None,
):
    """Write one record into centralized audit log."""
    db.add(
        AuditLog(
            actor=actor,
            action=action,
            entity=entity,
            entity_id=entity_id,
            details=details,
        )
    )
