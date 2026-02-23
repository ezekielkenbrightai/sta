"""
Database seed script — populates initial data for development.

Usage:
  python -m app.seed

Creates: countries, organizations, users (one per role), sample HS codes, currencies.
"""
import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .core.database import engine, async_session, Base
from .core.security import hash_password
from .models.core import Country, Organization, User
from .models.trade import HSCode
from .models.payment import Currency


async def seed():
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Check if already seeded
        result = await db.execute(select(Country).limit(1))
        if result.scalar_one_or_none():
            print("Database already seeded. Skipping.")
            return

        # ── Countries ────────────────────────────────────────────────
        countries = [
            Country(id="c-ken", name="Kenya", code="KEN", currency_code="KES", currency_symbol="KSh", flag_emoji="🇰🇪"),
            Country(id="c-nga", name="Nigeria", code="NGA", currency_code="NGN", currency_symbol="₦", flag_emoji="🇳🇬"),
            Country(id="c-zaf", name="South Africa", code="ZAF", currency_code="ZAR", currency_symbol="R", flag_emoji="🇿🇦"),
            Country(id="c-tza", name="Tanzania", code="TZA", currency_code="TZS", currency_symbol="TSh", flag_emoji="🇹🇿"),
            Country(id="c-uga", name="Uganda", code="UGA", currency_code="UGX", currency_symbol="USh", flag_emoji="🇺🇬"),
            Country(id="c-rwa", name="Rwanda", code="RWA", currency_code="RWF", currency_symbol="RF", flag_emoji="🇷🇼"),
            Country(id="c-gha", name="Ghana", code="GHA", currency_code="GHS", currency_symbol="GH₵", flag_emoji="🇬🇭"),
            Country(id="c-egy", name="Egypt", code="EGY", currency_code="EGP", currency_symbol="E£", flag_emoji="🇪🇬"),
            Country(id="c-eth", name="Ethiopia", code="ETH", currency_code="ETB", currency_symbol="Br", flag_emoji="🇪🇹"),
        ]
        db.add_all(countries)

        # ── Organizations ────────────────────────────────────────────
        orgs = [
            Organization(id="o-kra", name="Kenya Revenue Authority", type="government", country_id="c-ken"),
            Organization(id="o-kcb", name="KCB Bank", type="bank", country_id="c-ken"),
            Organization(id="o-nex", name="Nairobi Exports Ltd", type="trader", country_id="c-ken"),
            Organization(id="o-klg", name="Kenya Logistics Co", type="logistics", country_id="c-ken"),
            Organization(id="o-kpa", name="Kenya Ports Authority", type="customs", country_id="c-ken"),
            Organization(id="o-jub", name="Jubilee Insurance", type="insurance", country_id="c-ken"),
            Organization(id="o-frs", name="FIRS Nigeria", type="government", country_id="c-nga"),
            Organization(id="o-gtb", name="GTBank", type="bank", country_id="c-nga"),
            Organization(id="o-lag", name="Lagos Trading Co", type="trader", country_id="c-nga"),
            Organization(id="o-afcfta", name="AfCFTA Secretariat", type="government", country_id="c-gha"),
        ]
        db.add_all(orgs)

        # ── Users (one per role for testing) ─────────────────────────
        password = hash_password("password123")
        users = [
            User(
                id="u-super", email="admin@sta.africa", first_name="Platform", last_name="Admin",
                role="super_admin", hashed_password=password,
                modules="trade,tax,payments,ledger,supply_chain,customs,insurance,analytics,stablecoins,admin,afcfta",
            ),
            User(
                id="u-govt", email="govt@kra.go.ke", first_name="Jane", last_name="Mwangi",
                role="govt_admin", organization_id="o-kra", hashed_password=password,
                modules="trade,tax,payments,ledger,supply_chain,customs,insurance,analytics,stablecoins,afcfta",
            ),
            User(
                id="u-analyst", email="analyst@kra.go.ke", first_name="David", last_name="Ochieng",
                role="govt_analyst", organization_id="o-kra", hashed_password=password,
                modules="trade,tax,analytics",
            ),
            User(
                id="u-bank", email="officer@kcb.co.ke", first_name="Sarah", last_name="Kamau",
                role="bank_officer", organization_id="o-kcb", hashed_password=password,
                modules="payments,ledger",
            ),
            User(
                id="u-trader", email="trader@nairobiexports.co.ke", first_name="John", last_name="Kipchoge",
                role="trader", organization_id="o-nex", hashed_password=password,
                modules="trade,tax,payments,ledger,supply_chain,insurance,stablecoins",
            ),
            User(
                id="u-logistics", email="ops@kenyalogistics.co.ke", first_name="Grace", last_name="Wanjiku",
                role="logistics_officer", organization_id="o-klg", hashed_password=password,
                modules="supply_chain",
            ),
            User(
                id="u-customs", email="officer@kpa.go.ke", first_name="Peter", last_name="Njoroge",
                role="customs_officer", organization_id="o-kpa", hashed_password=password,
                modules="trade,customs",
            ),
            User(
                id="u-insurance", email="agent@jubilee.co.ke", first_name="Mary", last_name="Akinyi",
                role="insurance_agent", organization_id="o-jub", hashed_password=password,
                modules="insurance",
            ),
            User(
                id="u-auditor", email="auditor@deloitte.com", first_name="James", last_name="Maina",
                role="auditor", hashed_password=password,
                modules="trade,tax,payments,ledger,supply_chain,customs,insurance,analytics",
            ),
            User(
                id="u-afcfta", email="afcfta@au.int", first_name="Wamkele", last_name="Mene",
                role="afcfta_admin", organization_id="o-afcfta", hashed_password=password,
                modules="trade,tax,analytics,customs,afcfta",
            ),
        ]
        db.add_all(users)

        # ── Currencies ───────────────────────────────────────────────
        currencies = [
            Currency(code="KES", name="Kenyan Shilling", symbol="KSh", is_african=True),
            Currency(code="NGN", name="Nigerian Naira", symbol="₦", is_african=True),
            Currency(code="ZAR", name="South African Rand", symbol="R", is_african=True),
            Currency(code="TZS", name="Tanzanian Shilling", symbol="TSh", is_african=True),
            Currency(code="UGX", name="Ugandan Shilling", symbol="USh", is_african=True),
            Currency(code="RWF", name="Rwandan Franc", symbol="RF", is_african=True),
            Currency(code="GHS", name="Ghanaian Cedi", symbol="GH₵", is_african=True),
            Currency(code="EGP", name="Egyptian Pound", symbol="E£", is_african=True),
            Currency(code="ETB", name="Ethiopian Birr", symbol="Br", is_african=True),
            Currency(code="USD", name="US Dollar", symbol="$", is_african=False),
            Currency(code="EUR", name="Euro", symbol="€", is_african=False),
            Currency(code="GBP", name="British Pound", symbol="£", is_african=False),
        ]
        db.add_all(currencies)

        # ── Sample HS Codes ──────────────────────────────────────────
        hs_codes = [
            HSCode(code="0901.11", description="Coffee, not roasted, not decaffeinated", duty_rate=25.0, chapter=9, section="II"),
            HSCode(code="0902.10", description="Green tea (not fermented)", duty_rate=25.0, chapter=9, section="II"),
            HSCode(code="1701.13", description="Raw cane sugar", duty_rate=100.0, chapter=17, section="IV"),
            HSCode(code="2523.29", description="Portland cement", duty_rate=35.0, chapter=25, section="V"),
            HSCode(code="3004.90", description="Medicaments, packaged for retail", duty_rate=0.0, chapter=30, section="VI"),
            HSCode(code="6109.10", description="T-shirts, cotton", duty_rate=35.0, chapter=61, section="XI"),
            HSCode(code="7108.12", description="Gold, non-monetary, semi-manufactured", duty_rate=0.0, chapter=71, section="XIV"),
            HSCode(code="8471.30", description="Portable digital computers (laptops)", duty_rate=0.0, chapter=84, section="XVI"),
            HSCode(code="8703.23", description="Motor vehicles, 1500-3000cc", duty_rate=25.0, chapter=87, section="XVII"),
            HSCode(code="2710.12", description="Light petroleum oils (petrol/gasoline)", duty_rate=0.0, chapter=27, section="V"),
        ]
        db.add_all(hs_codes)

        await db.commit()
        print("Database seeded successfully!")
        print(f"  - {len(countries)} countries")
        print(f"  - {len(orgs)} organizations")
        print(f"  - {len(users)} users (password: password123)")
        print(f"  - {len(currencies)} currencies")
        print(f"  - {len(hs_codes)} HS codes")


if __name__ == "__main__":
    asyncio.run(seed())
