# Search Parker & Rescue Portal

This document outlines the architecture, features, and setup instructions for the Search Parker map portal.

## Project Purpose
The Search Parker portal is a localized mapping application designed to coordinate and plan search efforts for missing persons. It integrates real-time community search coverage data with predictive mathematical search zones.

## Website Architecture & Key Features

### 1. Technology Stack
- **Frontend**: Vanilla Javascript, HTML5, CSS3.
- **Mapping Engine**: Leaflet.js rendering OpenStreetMap tiles and satellite layers.
- **Backend/API**: Netlify Serverless Functions (`local_searches.mjs`).
- **Database**: Netlify Blobs for local team coordination, and a static JSON snapshot for public historical data.

### 2. Predictive Search Zones
The map automatically generates probability zones based on the two known sightings:
- **Red Zone (5.0 km radius)**: High Probability Search Zone centered on the last known CCTV sighting. Accounts for 75% of historical wander limits.
- **Orange Zone (10.0 km radius)**: Maximum physical limit based on fatigue and dehydration timelines.
- **Projected Path Cone (Orange Wedge)**: A 60-degree priority fan (24° to 84°) perfectly aligned with the 54° trajectory between Sighting 1 (Day Home) and Sighting 2 (CCTV).

### 3. Data Integration & Grid System
Search coverage is mapped across 20-meter square grid cells:
- **Public Coverage (Green/Yellow/Gray)**: Pulled from `searchparker.org`'s database via a Python snapshot script. Colored based on how recently the area was searched.
- **Local Team Coverage (Blue)**: Users can click directly on the map to mark a grid cell as searched. This triggers a live update to a local **Netlify Blob** store, instantly reflecting on the map for all local coordinators without polluting the public database.

### 4. Performance Optimizations
To ensure fast load times and battery efficiency on mobile devices:
- **Distance Filtering**: The application calculates the geographic center of all 133,000+ historical grid cells. Any grid cell falling outside the 10.0 km maximum search radius is strictly ignored and skipped during rendering.

## Local Development

To run the full stack locally (including the Netlify Functions and Blobs):
1. Install the Netlify CLI globally if you haven't already: `npm install -g netlify-cli`
2. Navigate into the `project/` directory.
3. Start the dev server: 
   ```bash
   netlify dev
   ```
4. The local server will emulate the backend at `http://localhost:8888`.

---

## Python Helper Scripts

These scripts are located in the root directory and act as development tools to fetch data and test logic.

### `query_supabase.py`
**Purpose**: Fetches the live searched areas grid data snapshot (all-time, 720 hours) directly from the public source of truth (`searchparker.org`'s Supabase database).
**Output**: Saves the snapshot into `project/data/search_coverage.json` which the frontend uses.
**Usage**: `python query_supabase.py`

### `distance.py`
**Purpose**: Calculates the direct straight-line distance, actual road walking distance, and estimated travel speeds between the two known sightings (Day Home and CCTV). 
**Usage**: `python distance.py`

### `geocode.py`
**Purpose**: Takes a plain text address and returns latitude and longitude coordinates by querying the OpenStreetMap Nominatim API.
**Usage**: `python geocode.py`
