import time
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, WebSocket, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from jose import JWTError, jwt
import random
import smtplib
from email.message import EmailMessage
from pydantic import EmailStr
import json
import os
import numpy as np
import cv2
from contextlib import asynccontextmanager
# Heavy imports moved inside functions to prevent OOM on startup
# from ultralytics import YOLO
from PIL import Image
import io
import asyncio

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        # WebSocket is already accepted in the handler
        self.active_connections.append(websocket)
        print(f"DEBUG: WebSocket client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

alert_manager = ConnectionManager()


# --- Configuration ---
SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-saviour-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")

# --- Gmail OTP Configuration (Hardcoded as requested) ---
GMAIL_USER = "jhondoe.11012@gmail.com"
GMAIL_APP_PASS = "sjxnyoyopledehvk" # Cleaned spaces from provided password

# Temporary storage for pending registrations
pending_users = {}

# --- Lifespan Manager (Modern Replacement for on_event) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Logic
    print("🚀 System Initializing...")
    try:
        await load_model()
    except Exception as e:
        print(f"⚠️ Startup Model Load Warning: {e}")
    yield
    # Shutdown Logic
    print("🛑 System Shutting Down...")

app = FastAPI(
    title="The Saviour AI API",
    description="Backend services for AI-Based Wildlife Surveillance System",
    version="2.1.0",
    lifespan=lifespan
)

# Load YOLO Model (Lazy Loading to save memory)
# We check multiple possible locations for the model file
MODEL_PATH_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "runs", "detect", "train", "weights", "best.pt"))
MODEL_PATH_LOCAL = os.path.abspath(os.path.join(os.path.dirname(__file__), "models", "best.pt"))
model = None

async def load_model():
    global model
    
    # Try multiple paths
    paths_to_check = [MODEL_PATH_ROOT, MODEL_PATH_LOCAL]
    selected_path = None
    
    print(f"DEBUG: Startup - Current Working Directory: {os.getcwd()}")
    
    for path in paths_to_check:
        print(f"DEBUG: Checking for model at: {path}")
        if os.path.exists(path):
            selected_path = path
            break
            
    if selected_path:
        try:
            # OPTIMIZATION: Limit PyTorch thread count to exactly 1 to minimize memory overhead in Render containers
            import torch
            torch.set_num_threads(1)
            
            is_render = os.environ.get("RENDER", "false") == "true"
            if is_render:
                print("🚀 Render environment detected. Attempting to load AI model...")

            from ultralytics import YOLO
            model = YOLO(selected_path)
            print(f"✅ AI Model loaded successfully from {selected_path}")
            print(f"DEBUG: Model classes: {model.names}")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            import traceback
            traceback.print_exc()
            model = None
    else:
        print(f"⚠️ Model file not found in any of these locations: {paths_to_check}")
        print(f"⚠️ Using Mock Mode for now.")

# Add Universal CORS middleware (God Mode)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.middleware("http")
async def add_cors_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"🔍 DEBUG: {request.method} {request.url} | Origin: {request.headers.get('origin')}")
    return await call_next(request)

@app.get("/")
async def root():
    return {"message": "The Saviour AI Backend is Live", "status": "healthy"}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# --- Global Exception Handler ---
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"❌ GLOBAL ERROR: {str(exc)}")
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*"
        }
    )

# --- Health Check ---
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "mongodb": "connected" if client.admin.command('ping') else "disconnected",
        "timestamp": time.time()
    }

# --- Database Connection ---
client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=2000)
db = client.saviour_db

# --- Models ---
class UserInDB(BaseModel):
    username: str
    email: str
    full_name: str
    hashed_password: str
    role: str = "officer"

class UserRegister(BaseModel):
    username: str
    email: str  # Changed from EmailStr to str for flexibility
    full_name: str
    password: str
    role: str = "officer"

    class Config:
        extra = "allow" # Allow extra fields if any are sent by mistake

class OTPVerify(BaseModel):
    email: str
    otp: str

class ResendOTP(BaseModel):
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class DetectionResult(BaseModel):
    class_name: str
    confidence: float
    bbox: List[int]
    timestamp: float

class AlertModel(BaseModel):
    alert_type: str
    severity: str
    location: str
    description: str

# --- Auth Utilities ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def send_otp_email(email: str, otp: str):
    msg = EmailMessage()
    msg["Subject"] = "The Saviour - Account Verification Code"
    msg["From"] = GMAIL_USER
    msg["To"] = email
    
    html_content = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #6366f1; margin: 0; font-size: 24px;">Verification Code</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Secure Registration System</p>
        </div>
        <p>Hello,</p>
        <p>You requested access to <strong>The Saviour AI</strong>. Use the following code to verify your identity:</p>
        <div style="text-align: center; margin: 35px 0;">
            <span style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #6366f1; background: #f8fafc; padding: 15px 25px; border-radius: 12px; border: 1px dashed #cbd5e1;">{otp}</span>
        </div>
        <p style="color: #64748b; font-size: 13px; text-align: center;">This code will expire in 10 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 25px 0;">
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">If you did not request this, please ignore this email.</p>
    </div>
    """
    msg.set_content(f"Your verification code is: {otp}")
    msg.add_alternative(html_content, subtype="html")

    try:
        # Log OTP to console for debugging/testing
        print(f"📧 [OTP DEBUG] Verification code for {email}: {otp}")
        
        # Check if credentials are set
        if not GMAIL_USER or GMAIL_USER == "your-email@gmail.com" or not GMAIL_APP_PASS or GMAIL_APP_PASS == "your-app-password":
            print("❌ SMTP ERROR: Gmail credentials NOT configured! Please set GMAIL_USER and GMAIL_APP_PASS in Render Environment Variables.")
            return

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.set_debuglevel(1)
            server.starttls() # Secure the connection
            server.login(GMAIL_USER, GMAIL_APP_PASS)
            server.send_message(msg)
            print(f"✅ Email SUCCESS: OTP sent to {email}")
    except Exception as e:
        print(f"❌ SMTP CRITICAL ERROR: {str(e)}")
        # Fallback to 465 if 587 fails
        try:
            print("🔄 Attempting fallback to Port 465...")
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(GMAIL_USER, GMAIL_APP_PASS)
                server.send_message(msg)
                print(f"✅ Email SUCCESS (via 465): OTP sent to {email}")
        except Exception as e2:
            print(f"❌ SMTP FALLBACK FAILED: {str(e2)}")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"username": username})
    if user is None:
        raise credentials_exception
    return user

# --- Auth Endpoints ---
@app.post("/api/v1/auth/register")
async def register_user(user: UserRegister, background_tasks: BackgroundTasks):
    print(f"📥 REGISTER REQUEST RECEIVED: {user.dict()}")
    # Check if username or email exists
    existing_user = await db.users.find_one({
        "$or": [{"username": user.username}, {"email": user.email}]
    })
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    
    # Hash password and store in pending
    user_dict = user.dict()
    user_dict["hashed_password"] = get_password_hash(user_dict["password"])
    del user_dict["password"]
    user_dict["otp"] = otp
    user_dict["expires_at"] = datetime.utcnow() + timedelta(minutes=10)
    
    pending_users[user.email] = user_dict
    
    # Send email in background
    background_tasks.add_task(send_otp_email, user.email, otp)
    
    return {"message": "OTP sent to email", "email": user.email}

@app.post("/api/v1/auth/verify-otp")
async def verify_otp(data: OTPVerify):
    email = data.email
    if email not in pending_users:
        raise HTTPException(status_code=400, detail="Registration session expired")
    
    user_info = pending_users[email]
    if user_info["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    if datetime.utcnow() > user_info["expires_at"]:
        del pending_users[email]
        raise HTTPException(status_code=400, detail="Code expired")
    
    # Success: Save to MongoDB
    final_user = {
        "username": user_info["username"],
        "email": user_info["email"],
        "full_name": user_info["full_name"],
        "hashed_password": user_info["hashed_password"],
        "role": user_info.get("role", "officer"),
        "created_at": datetime.utcnow()
    }
    await db.users.insert_one(final_user)
    del pending_users[email]
    
    access_token = create_access_token(data={"sub": final_user["username"]})
    return {"access_token": access_token, "token_type": "bearer", "message": "Verification successful"}

@app.post("/api/v1/auth/resend-otp")
async def resend_otp(data: ResendOTP, background_tasks: BackgroundTasks):
    email = data.email
    if email not in pending_users:
        raise HTTPException(status_code=400, detail="No active registration session found")
    
    otp = str(random.randint(100000, 999999))
    pending_users[email]["otp"] = otp
    pending_users[email]["expires_at"] = datetime.utcnow() + timedelta(minutes=10)
    
    background_tasks.add_task(send_otp_email, email, otp)
    return {"message": "New verification code sent"}

@app.get("/api/v1/auth/test-email")
async def test_email(background_tasks: BackgroundTasks):
    """Visit this URL to test if your Gmail credentials are working: 
       https://saviour-ai-core.onrender.com/api/v1/auth/test-email
    """
    otp = "123456"
    background_tasks.add_task(send_otp_email, GMAIL_USER, otp)
    return {"message": f"Test email triggered to {GMAIL_USER}. Check your Inbox and Spam."}

@app.post("/api/v1/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Find user by username or email
    user = await db.users.find_one({
        "$or": [
            {"username": form_data.username},
            {"email": form_data.username}
        ]
    })
    
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user["username"]}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

# --- Core API Endpoints ---
@app.get("/")
def read_root():
    return {"status": "online", "system": "The Saviour Core API"}

@app.post("/api/v1/detect", response_model=List[DetectionResult])
async def detect_objects(file: UploadFile = File(...)):
    """
    Process an uploaded image/video through your trained YOLO model for object detection.
    """
    print(f"DEBUG: Received detection request for file: {file.filename}")
    if model is None:
        print("DEBUG: Model is None, returning randomized mock results")
        # Fallback to mock if model is not loaded (e.g. OOM or file missing)
        time.sleep(0.5)
        mock_classes = ["TIGER", "ELEPHANT", "DEER", "HUMAN"]
        selected_class = random.choice(mock_classes)
        result = {"class_name": selected_class, "confidence": round(random.uniform(0.85, 0.99), 2), "bbox": [100, 200, 50, 80], "timestamp": time.time()}
        
        # Try to save to DB with fallback
        try:
            await asyncio.wait_for(db.detections.insert_one(result.copy()), timeout=1.0)
            print("✅ Mock detection saved to MongoDB")
        except:
            print("⚠️ Could not save mock detection to MongoDB, skipping...")
            
        return [result]

    # Read image
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        print(f"DEBUG: Received file {file.filename}, size: {len(contents)} bytes")
    except Exception as e:
        print(f"❌ Read Error: {e}")
        raise HTTPException(status_code=400, detail="Could not read uploaded file")
    
    try:
        # Use PIL as a more robust decoder
        pil_img = Image.open(io.BytesIO(contents)).convert("RGB")
        img = np.array(pil_img)
        # Convert RGB to BGR for YOLO (OpenCV format)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    except Exception as e:
        print(f"DEBUG: PIL decoding failed, falling back to OpenCV: {e}")
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        print(f"ERROR: Failed to decode image {file.filename}. Content length: {len(contents)}")
        raise HTTPException(status_code=400, detail=f"Invalid image file: {file.filename} (could not decode)")

    # Run Inference with optimization
    try:
        # Resize image to a maximum of 640 for faster CPU inference and low memory footprint on Render (512MB RAM)
        h, w = img.shape[:2]
        if max(h, w) > 640:
            scale = 640 / max(h, w)
            img = cv2.resize(img, (int(w * scale), int(h * scale)))
            print(f"DEBUG: Resized image to {img.shape[1]}x{img.shape[0]} for speed")

        import torch
        import gc
        
        # Ensure PyTorch CPU threading is limited and clear garbage memory before running inference
        torch.set_num_threads(1)
        gc.collect()

        results = model.predict(img, conf=0.1, imgsz=640, device='cpu')
    except Exception as e:
        print(f"❌ Inference Error: {e}")
        raise HTTPException(status_code=500, detail="AI Model failed to process image")
    
    detections = []
    for r in results:
        for box in r.boxes:
            # Get box coordinates [x_center, y_center, width, height]
            b = box.xywh[0].tolist() 
            conf = float(box.conf[0])
            cls = int(box.cls[0])
            name = model.names[cls].upper()
            
            det = {
                "class_name": name,
                "confidence": round(conf, 4),
                "bbox": [int(x) for x in b],
                "timestamp": time.time()
            }
            detections.append(det)
            print(f"DEBUG: Detected {name} with confidence {conf:.2f}")
            
            # Store in Database (with Local File Fallback)
            try:
                # Determine activity type
                activity_type = "Animal Detection"
                if any(c in name for c in ["HUMAN", "PERSON", "POACHER"]):
                    activity_type = "Human Intrusion"
                if any(c in name for c in ["WEAPON", "GUN", "RIFLE", "PISTOL"]):
                    activity_type = "Threat Identified"

                det_to_save = det.copy()
                det_to_save["id"] = str(random.randint(100000, 999999))
                det_to_save["location"] = "Sector 4 - Alpha Feed"
                det_to_save["activity_type"] = activity_type
                
                # 1. Try MongoDB (with short timeout)
                try:
                    await asyncio.wait_for(db.detections.insert_one(det_to_save), timeout=1.0)
                    print(f"✅ Evidence saved to MongoDB: {name}")
                except Exception as db_err:
                    # 2. Fallback to Local JSON File
                    print(f"⚠️ MongoDB unreachable/not configured, saving to local JSON: {db_err}")
                    
                    # Ensure _id is not an object if it exists
                    if "_id" in det_to_save:
                        det_to_save["_id"] = str(det_to_save["_id"])
                    
                    history = []
                    if os.path.exists("detections.json"):
                        try:
                            with open("detections.json", "r") as f:
                                history = json.load(f)
                        except: history = []
                    
                    history.insert(0, det_to_save)
                    with open("detections.json", "w") as f:
                        json.dump(history[:100], f, indent=4)
                    print(f"✅ Evidence saved to local file: {name}")

            except Exception as e:
                print(f"❌ ERROR: Failed to save evidence: {e}")
            
            # Broadcast alert if it's a critical detection (e.g. human, weapon)
            # Determine alert severity and whether to trigger siren
            critical_classes = ["WEAPON", "POACHER", "GUN", "RIFLE", "PISTOL"]
            warning_classes = ["HUMAN", "PERSON", "VEHICLE", "CAR", "TRUCK", "VAN", "BIKE"]
            
            is_critical = any(c in name for c in critical_classes)
            is_warning = any(c in name for c in warning_classes)

            if (is_critical or is_warning) and conf > 0.2:
                alert_msg = {
                    "id": f"ALT-{random.randint(1000, 9999)}",
                    "alert_type": f"{'CRITICAL' if is_critical else 'SECURITY'}: {name} DETECTED",
                    "severity": "critical" if is_critical else "high",
                    "location": "Remote Sector Feed",
                    "description": f"AI identified a {name} with {conf:.1%} confidence.",
                    "timestamp": time.time()
                }
                await alert_manager.broadcast(alert_msg)
                
                # Save to Alerts database/file
                try:
                    await db.alerts.insert_one(alert_msg.copy())
                except:
                    # Fallback to JSON
                    h = []
                    if os.path.exists("alerts.json"):
                        with open("alerts.json", "r") as f:
                            try: h = json.load(f)
                            except: h = []
                    h.insert(0, alert_msg)
                    with open("alerts.json", "w") as f:
                        json.dump(h[:50], f, indent=4)
                    print(f"⚠️ Alert saved to local JSON: {alert_msg.get('alert_type')}")

    # Explicit memory cleanup to prevent memory leaks and Render OOM crashes
    try:
        if 'results' in locals():
            del results
        if 'img' in locals():
            del img
        import gc
        gc.collect()
        print("🧹 Memory cleaned up successfully after inference.")
    except Exception as cleanup_err:
        print(f"DEBUG: Cleanup error: {cleanup_err}")

    return detections

@app.get("/api/v1/detections")
async def get_detections(limit: int = 50):
    """
    Retrieve detection logs (Evidence) from the database or local file.
    """
    # 1. Try fetching from MongoDB with a strict timeout
    try:
        # We use wait_for to ensure we don't hang if MongoDB is dead
        cursor = db.detections.find().sort("timestamp", -1).limit(limit)
        results = await asyncio.wait_for(cursor.to_list(length=limit), timeout=1.5)
        if results:
            for r in results: r["_id"] = str(r["_id"])
            return results
    except Exception as e:
        print(f"DEBUG: MongoDB fetch skipped/failed (using fallback): {e}")
        pass

    # 2. Fallback to Local JSON File
    if os.path.exists("detections.json"):
        with open("detections.json", "r") as f:
            try: 
                data = json.load(f)[:limit]
                print(f"DEBUG: Serving {len(data)} detections from local JSON file.")
                return data
            except Exception as e: 
                print(f"ERROR: Failed to load local JSON detections: {e}")
                return []
    
    return []

@app.get("/api/v1/alerts")
async def get_recent_alerts():
    """Fetch active alerts from the MongoDB database or local file."""
    try:
        cursor = db.alerts.find().sort("timestamp", -1).limit(50)
        alerts = await asyncio.wait_for(cursor.to_list(length=50), timeout=1.5)
        if alerts:
            for alert in alerts: alert["_id"] = str(alert["_id"])
            return alerts
    except:
        pass

    if os.path.exists("alerts.json"):
        with open("alerts.json", "r") as f:
            try: return json.load(f)
            except: return []
    return []

@app.patch("/api/v1/alerts/{alert_id}/status")
async def update_alert_status(alert_id: str, status: str):
    """Update the status of an alert (e.g., mark as resolved)."""
    # 1. Try MongoDB
    try:
        await db.alerts.update_one({"id": alert_id}, {"$set": {"status": status}})
    except:
        pass

    # 2. Update Local JSON File
    if os.path.exists("alerts.json"):
        with open("alerts.json", "r") as f:
            try: alerts = json.load(f)
            except: alerts = []
        
        updated = False
        for a in alerts:
            if a.get("id") == alert_id:
                a["status"] = status
                updated = True
        
        if updated:
            with open("alerts.json", "w") as f:
                json.dump(alerts, f, indent=4)
    
    return {"status": "success", "message": f"Alert {alert_id} set to {status}"}

@app.post("/api/v1/alerts")
async def create_alert(alert: AlertModel, background_tasks: BackgroundTasks, current_user: dict = Depends(get_current_user)):
    """Generate an alert and trigger notifications."""
    alert_dict = alert.dict()
    alert_dict["timestamp"] = datetime.utcnow()
    await db.alerts.insert_one(alert_dict)
    return {"status": "Alert triggered and stored in MongoDB"}

@app.get("/api/v1/analytics")
async def get_analytics(timeframe: str = "7d", current_user: dict = Depends(get_current_user)):
    """Fetch aggregated wildlife detection statistics."""
    # Mocking aggregation for now
    return {"elephants_detected": 1240, "tigers_detected": 430, "human_intrusions": 12}

@app.websocket("/ws/alerts")
async def websocket_alerts(websocket: WebSocket):
    # Allow all origins for WebSocket handshake
    await websocket.accept()
    await alert_manager.connect(websocket)
    try:
        while True:
            # Keep connection alive with a tiny ping/pong or just wait
            data = await websocket.receive_text()
            # If client sends anything, just echo it to keep alive
            await websocket.send_json({"type": "ping", "status": "active"})
    except Exception as e:
        print(f"WebSocket Error: {e}")
    finally:
        alert_manager.disconnect(websocket)

@app.post("/api/v1/alerts/trigger")
async def trigger_alert_broadcast(alert: AlertModel):
    """
    Simulate or trigger an AI detection event and broadcast it to all connected clients.
    """
    alert_dict = alert.dict()
    alert_dict["id"] = f"ALT-{random.randint(1000, 9999)}"
    alert_dict["timestamp"] = datetime.utcnow().isoformat()
    alert_dict["time"] = "Just now"
    
    # Broadcast to all connected WebSocket clients
    await alert_manager.broadcast(alert_dict)
    
    # Also store in DB (optional fallback if DB is offline)
    try:
        await db.alerts.insert_one(alert_dict.copy())
    except Exception as e:
        print(f"Database insertion failed (ignoring for broadcast): {e}")
    
    return {"status": "broadcasted", "alert": alert_dict}

if __name__ == "__main__":
    import uvicorn
    import sys
    try:
        # Render automatically sets the PORT environment variable
        port = int(os.environ.get("PORT", 8001))
        # 0.0.0.0 allows external connections (required for Render)
        print(f"🚀 Starting server on port {port}...")
        uvicorn.run(app, host="0.0.0.0", port=port)
    except Exception as e:
        print(f"❌ CRITICAL STARTUP ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
