from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from ...core.database import get_db
from ...core.security import create_access_token, get_current_user, verify_password
from ...models.core import User, Organization, Country
from ...schemas.auth import LoginRequest, LoginResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


def _user_to_response(user: User) -> UserResponse:
    """Convert a User ORM model to a UserResponse schema."""
    org = user.organization
    country = org.country if org else None
    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        organization_id=org.id if org else None,
        organization_name=org.name if org else None,
        organization_type=org.type if org else None,
        country_id=country.id if country else None,
        country_name=country.name if country else None,
        country_code=country.code if country else None,
        country_flag_emoji=country.flag_emoji if country else None,
        is_active=user.is_active,
        modules=user.modules.split(",") if user.modules else [],
    )


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate user and return JWT + user info."""
    result = await db.execute(
        select(User)
        .options(joinedload(User.organization).joinedload(Organization.country))
        .where(User.email == body.email)
    )
    user = result.unique().scalar_one_or_none()

    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    token = create_access_token(data={"sub": user.id, "role": user.role})

    return LoginResponse(
        access_token=token,
        user=_user_to_response(user),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return the currently authenticated user's profile."""
    # Eagerly load organization + country
    result = await db.execute(
        select(User)
        .options(joinedload(User.organization).joinedload(Organization.country))
        .where(User.id == current_user.id)
    )
    user = result.unique().scalar_one()
    return _user_to_response(user)
