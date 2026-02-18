from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class MenuItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    description: str
    price: float
    image_url: Optional[str] = None
    is_veg: bool = True
    is_popular: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MenuItemCreate(BaseModel):
    name: str
    category: str
    description: str
    price: float
    image_url: Optional[str] = None
    is_veg: bool = True
    is_popular: bool = False


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str


@api_router.get("/")
async def root():
    return {"message": "Welcome to Taam Jham API"}


@api_router.get("/menu", response_model=List[MenuItem])
async def get_menu(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    
    menu_items = await db.menu_items.find(query, {"_id": 0}).to_list(1000)
    
    for item in menu_items:
        if isinstance(item.get('created_at'), str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    
    return menu_items


@api_router.post("/menu", response_model=MenuItem)
async def create_menu_item(item: MenuItemCreate):
    menu_item = MenuItem(**item.model_dump())
    doc = menu_item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.menu_items.insert_one(doc)
    return menu_item


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(message: ContactMessageCreate):
    contact_msg = ContactMessage(**message.model_dump())
    doc = contact_msg.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contact_messages.insert_one(doc)
    return contact_msg


@api_router.get("/menu/categories")
async def get_categories():
    return {
        "categories": [
            {"id": "north-indian", "name": "North Indian", "icon": "🍛"},
            {"id": "italian", "name": "Italian", "icon": "🍝"},
            {"id": "indo-chinese", "name": "Indo-Chinese", "icon": "🥢"},
            {"id": "fast-food", "name": "Fast Food", "icon": "🍔"},
            {"id": "beverages", "name": "Beverages", "icon": "🍹"}
        ]
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_db():
    menu_items = [
        {"id": str(uuid.uuid4()), "name": "Butter Chicken", "category": "north-indian", "description": "Tender chicken in rich tomato-based creamy curry", "price": 380, "image_url": "https://images.pexels.com/photos/34159113/pexels-photo-34159113.jpeg", "is_veg": False, "is_popular": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Dal Makhani", "category": "north-indian", "description": "Black lentils slow-cooked with butter and cream", "price": 280, "image_url": "https://images.pexels.com/photos/5737398/pexels-photo-5737398.jpeg", "is_veg": True, "is_popular": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Tandoori Roti", "category": "north-indian", "description": "Whole wheat flatbread baked in tandoor", "price": 40, "image_url": "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg", "is_veg": True, "is_popular": False, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Paneer Tikka Masala", "category": "north-indian", "description": "Grilled cottage cheese in spiced tomato gravy", "price": 320, "image_url": "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg", "is_veg": True, "is_popular": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Margherita Pizza", "category": "italian", "description": "Classic pizza with fresh mozzarella, basil & tomato", "price": 420, "image_url": "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg", "is_veg": True, "is_popular": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Fettuccine Alfredo", "category": "italian", "description": "Creamy parmesan pasta with herbs", "price": 380, "image_url": "https://images.pexels.com/photos/33455847/pexels-photo-33455847.jpeg", "is_veg": True, "is_popular": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Penne Arrabiata", "category": "italian", "description": "Spicy tomato-based pasta with garlic", "price": 340, "image_url": "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg", "is_veg": True, "is_popular": False, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Tiramisu", "category": "italian", "description": "Classic Italian coffee-flavored dessert", "price": 220, "image_url": "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg", "is_veg": True, "is_popular": False, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Hakka Noodles", "category": "indo-chinese", "description": "Stir-fried noodles with vegetables and sauces", "price": 240, "image_url": "https://images.pexels.com/photos/1395319/pexels-photo-1395319.jpeg", "is_veg": True, "is_popular": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Manchurian Dry", "category": "indo-chinese", "description": "Crispy vegetable balls tossed in spicy sauce", "price": 280, "image_url": "https://images.pexels.com/photos/8478026/pexels-photo-8478026.jpeg", "is_veg": True, "is_popular": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Spring Rolls", "category": "indo-chinese", "description": "Crispy rolls filled with mixed vegetables", "price": 180, "image_url": "https://images.pexels.com/photos/2613037/pexels-photo-2613037.jpeg", "is_veg": True, "is_popular": False, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Chilli Paneer", "category": "indo-chinese", "description": "Spicy cottage cheese with bell peppers", "price": 300, "image_url": "https://images.pexels.com/photos/8535168/pexels-photo-8535168.jpeg", "is_veg": True, "is_popular": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Classic Burger", "category": "fast-food", "description": "Juicy beef patty with cheese, lettuce & tomato", "price": 280, "image_url": "https://images.pexels.com/photos/14935009/pexels-photo-14935009.jpeg", "is_veg": False, "is_popular": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Loaded Fries", "category": "fast-food", "description": "Crispy fries topped with cheese and sauces", "price": 180, "image_url": "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg", "is_veg": True, "is_popular": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Chicken Wings", "category": "fast-food", "description": "Spicy glazed chicken wings", "price": 320, "image_url": "https://images.pexels.com/photos/3218467/pexels-photo-3218467.jpeg", "is_veg": False, "is_popular": False, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Veg Sandwich", "category": "fast-food", "description": "Grilled sandwich with fresh vegetables", "price": 140, "image_url": "https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg", "is_veg": True, "is_popular": False, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Mango Lassi", "category": "beverages", "description": "Traditional yogurt drink with mango", "price": 120, "image_url": "https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg", "is_veg": True, "is_popular": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Mojito", "category": "beverages", "description": "Refreshing mint and lime mocktail", "price": 150, "image_url": "https://images.pexels.com/photos/227906/pexels-photo-227906.jpeg", "is_veg": True, "is_popular": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Cold Coffee", "category": "beverages", "description": "Chilled coffee with ice cream", "price": 140, "image_url": "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg", "is_veg": True, "is_popular": False, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Fresh Lime Soda", "category": "beverages", "description": "Sparkling lime water with a tangy twist", "price": 80, "image_url": "https://images.pexels.com/photos/1233319/pexels-photo-1233319.jpeg", "is_veg": True, "is_popular": False, "created_at": datetime.now(timezone.utc).isoformat()}
    ]
    
    existing_count = await db.menu_items.count_documents({})
    if existing_count == 0:
        await db.menu_items.insert_many(menu_items)
        logger.info(f"Inserted {len(menu_items)} menu items")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
