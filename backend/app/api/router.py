"""Main API router assembled from domain-specific files."""

from fastapi import APIRouter

from app.api.core_routes import router as core_router
from app.api.operations_routes import router as operations_router
from app.api.reports_admin_routes import router as reports_admin_router

router = APIRouter()
router.include_router(core_router)
router.include_router(operations_router)
router.include_router(reports_admin_router)
