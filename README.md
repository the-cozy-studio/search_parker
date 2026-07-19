# Search Parker & Rescue Portal

This document keeps track of the architecture and Python scripts we have built for the Search Parker project to help our conversation remember what we have already built.

## Website Overview

The Search Parker portal is a web application designed to coordinate volunteer search coverage on a map. 
- **Tech Stack**: Built with Vanilla JS, HTML, CSS, and Leaflet.js for mapping. It uses Netlify functions and Netlify Blobs to sync local team searches.
- **Map Features**: Displays the two known sightings (Day Home & CCTV camera), a projected cone of travel, a high-probability search radius (5.0 km), and a maximum physical limit boundary (10.0 km). 
- **Data Architecture**: The public search coverage data is tracked in 20-meter grid cells and is synced from the public source of truth (`searchparker.org`). Users can also mark grid cells live directly on this map, which saves to our local Netlify blob backend.

## Python Scripts

### `query_supabase.py`
**Purpose**: Fetches the live searched areas grid data snapshot directly from the source of truth (`searchparker.org`'s Supabase database).
**Output**: Saves the snapshot into `project/data/search_coverage.json`. The frontend (`map.js`) is wired to use this local snapshot file as its data source, allowing us to control the map's state and last synced time.
**Usage**: `python query_supabase.py`

### `distance.py`
**Purpose**: Calculates the direct straight-line distance, actual road walking distance, and estimated travel speeds between the two known sightings (Day Home and CCTV). 
**Usage**: `python distance.py`

### `geocode.py`
**Purpose**: Takes a plain text address and returns latitude and longitude coordinates by querying the OpenStreetMap Nominatim API.
**Usage**: `python geocode.py`
