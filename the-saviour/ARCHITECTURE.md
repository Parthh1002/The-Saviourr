# THE SAVIOUR - System Architecture

This document defines the production-ready architecture for THE SAVIOUR, an enterprise-grade AI-based wildlife surveillance platform.

## Technology Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, Lucide Icons, Recharts, Leaflet.
- **Backend**: FastAPI (Python 3.12+), Uvicorn, WebSockets.
- **Database**: MongoDB Atlas (Motor Asyncio).
- **AI/ML Core**: PyTorch, YOLOv8 (Ultralytics), OpenCV.
- **Caching**: Redis (for real-time alert aggregations).

## Google Colab Training Integration Workflow

1. **Dataset Preparation**: Images of poachers, weapons, tigers, elephants are annotated and structured in YOLO format.
2. **Colab Training**:
   - Train `yolov8s.pt` or `yolov8m.pt` on Google Colab using a T4 or A100 GPU.
   - Example Command: `!yolo task=detect mode=train model=yolov8s.pt data=dataset.yaml epochs=100 imgsz=640`
3. **Weight Export**: Export the trained model to `best.pt`.
4. **Backend Integration**: Move `best.pt` into the FastAPI backend (`backend/models/best.pt`).
5. **Inference Pipeline**:
   - FastAPI loads the model on startup (`model = YOLO('models/best.pt')`).
   - The `/api/v1/detect` endpoint accepts video streams or chunks.
   - OpenCV processes frames: `results = model(frame)`.
   - Bounding boxes and confidence scores are serialized to JSON and sent via WebSocket to the frontend.

## API Architecture

### Authentication
- `POST /api/v1/auth/login` -> Returns JWT token.
- `POST /api/v1/auth/logout` -> Invalidates session.

### AI Inference
- `POST /api/v1/analyze/video` -> Accepts chunks, returns job ID.
- `GET /api/v1/analyze/status/{job_id}` -> Returns processing percentage.
- `WS /ws/live-feed/{camera_id}` -> Streams YOLO bounding boxes over video frames.

### Database & Alerts
- `GET /api/v1/alerts/critical` -> Returns ongoing intrusions.
- `POST /api/v1/alerts/dispatch` -> Triggers notification channels.

## Deployment Strategy
1. **Frontend**: Deployed on Vercel (`vercel.json` configured for Next.js App Router).
2. **Backend**: Containerized via Docker (`Dockerfile` running `uvicorn`). Deployed on Render or AWS ECS with GPU instances.
3. **Database**: MongoDB Atlas Serverless Cluster.
