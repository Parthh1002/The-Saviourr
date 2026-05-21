# Database Architecture - The Saviour Platform

The system is designed to be database-agnostic at the application layer, allowing for either **MongoDB** (NoSQL, better for rapid iteration and high-throughput logs) or **MySQL/PostgreSQL** (Relational, better for structured transactional data).

Below is the proposed schema structure (represented as collections for MongoDB or Tables for SQL).

## 1. Users (Roles: Admin, Ranger, Analyst)
- `id` (UUID / ObjectId)
- `email` (String, unique)
- `password_hash` (String)
- `full_name` (String)
- `role` (Enum: ADMIN, RANGER, OFFICER)
- `assigned_zone` (String/Ref)
- `created_at` (Timestamp)
- `last_login` (Timestamp)

## 2. Camera Feeds (Edge Nodes)
- `camera_id` (String, unique: e.g., "CAM-042")
- `status` (Enum: ONLINE, OFFLINE, MAINTENANCE)
- `location_coords` (GeoJSON / Lat,Lng)
- `zone_id` (String/Ref)
- `battery_level` (Integer: 0-100)
- `last_ping` (Timestamp)
- `model_version` (String: e.g., "YOLOv8-Saviour-v2")

## 3. Detection Logs (High Throughput)
- `log_id` (UUID)
- `camera_id` (String/Ref)
- `timestamp` (Timestamp)
- `class_label` (String: "tiger", "human", "vehicle", "weapon")
- `confidence_score` (Float: 0.0 - 1.0)
- `bounding_box` (Array: [x, y, w, h])
- `image_reference` (String/URL to Cloud Storage like S3)
- `processed_time_ms` (Integer)

## 4. Alerts
- `alert_id` (UUID)
- `severity` (Enum: CRITICAL, HIGH, MEDIUM, LOW)
- `type` (Enum: INTRUSION, WEAPON, SOS, SYSTEM_FAILURE)
- `camera_id` (String/Ref)
- `timestamp` (Timestamp)
- `description` (String)
- `status` (Enum: UNRESOLVED, INVESTIGATING, RESOLVED, FALSE_ALARM)
- `assigned_to` (User Ref)

## 5. Forest Zones
- `zone_id` (UUID)
- `zone_name` (String)
- `boundary_polygon` (GeoJSON Polygon)
- `risk_level` (Enum: LOW, MODERATE, HIGH)
- `assigned_officer` (User Ref)

## 6. Animal Records / Tracking
- `record_id` (UUID)
- `species` (String)
- `last_seen` (Timestamp)
- `last_camera_id` (String/Ref)
- `tracking_collar_id` (Optional String)
- `health_status` (String)

## Architecture Considerations
- **High-Volume Telemetry**: Detection logs should be partitioned by date or zone if using SQL. In MongoDB, consider Time Series collections for metrics.
- **Media Storage**: Store actual inference frames (images/videos) in an S3-compatible object store, saving only the URI in the database.
- **Caching**: Use Redis for real-time aggregation (e.g., "active alerts in the last 15 minutes") and WebSocket state management.
