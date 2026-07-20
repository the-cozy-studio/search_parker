# Search Parker & Rescue Portal

This document outlines the architecture, features, and setup instructions for the Search Parker map portal.

## Project Purpose
The Search Parker portal is a localized mapping application designed to coordinate and plan search efforts for missing persons. It integrates real-time community search coverage data with predictive mathematical search zones.

## Website Architecture & Key Features

### 1. Technology Stack
- **Frontend**: Vanilla Javascript, HTML5, CSS3.
- **Mapping Engine**: Leaflet.js rendering OpenStreetMap tiles and satellite layers.
- **Hosting**: GitHub Pages (Static Site).
- **Automation**: GitHub Actions runs `query_supabase.py` hourly to fetch the latest data and triggers the GitHub Pages deployment automatically.

### 2. Predictive Search Zones
The map automatically generates probability zones based on the two known sightings:
- **Red Zone (5.0 km radius)**: High Probability Search Zone centered on the last known CCTV sighting. Accounts for 75% of historical wander limits.
- **Orange Zone (10.0 km radius)**: Maximum physical limit based on fatigue and dehydration timelines.
- **Projected Path Cone (Orange Wedge)**: A 60-degree priority fan (24° to 84°) perfectly aligned with the 54° trajectory between Sighting 1 (Day Home) and Sighting 2 (CCTV).

### 3. Data Integration & Grid System
Search coverage is mapped across 20-meter square grid cells:
- **Public Coverage (Green/Yellow/Gray)**: Pulled dynamically from `searchparker.org`'s database via a Python snapshot script. Colored based on how recently the area was searched.
- **Automated Sync**: A GitHub Action runs every hour to fetch the newest data from the city's database. It extracts the live API keys via Regex, downloads the latest records, embeds the exact `sync_time` into the JSON, and instantly deploys the updated data to GitHub Pages. The website UI automatically reads this exact embedded timestamp and updates the "Last Synced" panel to display the precise minute the data was pulled.

### 4. Performance Optimizations
To ensure fast load times and battery efficiency on mobile devices:
- **Distance Filtering**: The application calculates the geographic center of all 133,000+ historical grid cells. Any grid cell falling outside the 10.0 km maximum search radius is strictly ignored and skipped during rendering.

## Local Development

To run the frontend locally:
1. Navigate into the root directory.
2. Start a simple Python HTTP server: 
   ```bash
   python -m http.server 8000 -d project
   ```
3. Open `http://localhost:8000` in your browser.

---

## Python Helper Scripts

These scripts are located in the root directory and act as development tools to fetch data and test logic.

### `query_supabase.py`
**Purpose**: Automates fetching the live searched areas directly from the `searchparker.org` public database. It dynamically scrapes `searchparker.org` to extract the live Supabase URL and API Keys using Regex, making it resilient to key rotations.
**Output**: Saves the snapshot into `project/data/search_coverage.json` and embeds the exact `sync_time` timestamp into the file for the frontend to display.
**Usage**: `python query_supabase.py` (Runs automatically every hour via GitHub Actions).

### `distance.py`
**Purpose**: Calculates the direct straight-line distance, actual road walking distance, and estimated travel speeds between the two known sightings (Day Home and CCTV). 
**Usage**: `python distance.py`

### `geocode.py`
**Purpose**: Takes a plain text address and returns latitude and longitude coordinates by querying the OpenStreetMap Nominatim API.
**Usage**: `python geocode.py`
