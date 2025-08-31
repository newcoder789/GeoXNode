# predict_glof.py — quick heuristic GLOF risk endpoint
import requests
import math
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from statistics import mean

app = FastAPI()

# ---------- helpers ----------
def fetch_weather_open_meteo(lat, lon):
    # Get hourly precip and temp for last 3 days
    url = ("https://api.open-meteo.com/v1/forecast?"
           f"latitude={lat}&longitude={lon}&hourly=temperature_2m,precipitation&timezone=UTC&past_days=7")
    r = requests.get(url, timeout=20)
    r.raise_for_status()
    return r.json()

def fetch_elevation(lat, lon):
    # Open-Elevation API
    url = f"https://api.open-elevation.com/api/v1/lookup?locations={lat},{lon}"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    data = r.json()
    return data['results'][0]['elevation']

def estimate_slope_from_elevation(lat, lon, delta=0.001):
    # sample four nearby points to estimate rise/run
    e1 = fetch_elevation(lat+delta, lon)
    e2 = fetch_elevation(lat-delta, lon)
    e3 = fetch_elevation(lat, lon+delta)
    e4 = fetch_elevation(lat, lon-delta)
    elevs = [e1,e2,e3,e4]
    slope = max(abs(e1-e2), abs(e3-e4)) / (delta*111000)  # approx divide by meters per deg ~111km
    return slope, mean(elevs)

# ---------- rule-based risk function ----------
def compute_risk(features):
    score = 0
    # precipitation thresholds (mm)
    if features['precip_48h'] > 100 or features['precip_7d'] > 200:
        score += 2
    if features['area_change_pct'] >= 30:
        score += 2
    if features['slope'] > 0.15:  # steep slope (m/m)
        score += 1
    if features['elevation_mean'] < 3000:  # lower elevation generally more downstream exposure
        score += 1
    if features['temp_anomaly'] > 2.0:
        score += 1
    if score >= 4:
        return "High", score
    if score >= 2:
        return "Medium", score
    return "Low", score

# ---------- API model ----------
class PredictRequest(BaseModel):
    lat: float
    lon: float
    area_change_pct: float = 0.0  # % change over historical baseline (if unknown pass 0)

@app.post("/predict")
def predict(req: PredictRequest):
    lat, lon = req.lat, req.lon
    # fetch weather
    w = fetch_weather_open_meteo(lat, lon)
    # parse precipitation and temp arrays
    try:
        precip = w['hourly']['precipitation']  # mm per hour
        temps = w['hourly']['temperature_2m']
    except KeyError:
        return {"error":"weather data missing"}
    # compute 48h precip and 7d sum (last 7*24 entries)
    precip_48h = sum(map(float, precip[-48:]))
    precip_7d = sum(map(float, precip[-168:]))
    temp_recent = mean(map(float, temps[-24:]))
    temp_week = mean(map(float, temps[-168:]))
    temp_anom = temp_recent - temp_week

    slope, elev_mean = estimate_slope_from_elevation(lat, lon)
    features = {
        "precip_48h": precip_48h,
        "precip_7d": precip_7d,
        "temp_recent": temp_recent,
        "temp_week": temp_week,
        "temp_anomaly": temp_anom,
        "slope": slope,
        "elevation_mean": elev_mean,
        "area_change_pct": req.area_change_pct
    }
    risk, score = compute_risk(features)
    return {"risk":risk, "score":score, "features":features}

# ---------- run server ----------
if __name__ == "__main__":
    uvicorn.run("predict_glof:app", host="0.0.0.0", port=8000, reload=False)
