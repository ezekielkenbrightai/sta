from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    role: str
    organization_id: str | None = None
    organization_name: str | None = None
    organization_type: str | None = None
    country_id: str | None = None
    country_name: str | None = None
    country_code: str | None = None
    country_flag_emoji: str | None = None
    is_active: bool
    modules: list[str] = []

    model_config = {"from_attributes": True}


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
