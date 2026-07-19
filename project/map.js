// Coordinates
const dayHomeCoords = [51.0850566, -114.0931908];
const cctvCoords = [51.1009931, -114.0582958];

// Supabase API config to load live searched grids
const supabaseUrl = "https://ozoselvlkrnlalvehobf.supabase.co/rest/v1/rpc/get_search_cell_status_snapshot";
const supabaseAnonKey = "sb_publishable_sd9ej6H1-2pGQP11l4vDAQ__JG0rWkr";

// Grid anchors matching searchparker.org
const Ey = 51.085;
const f0 = -114.095;
const Ay = 111320;
const p0 = Ay * Math.cos(Ey * Math.PI / 180);


// Speed Calculation:
// - Day Home to CCTV Walking Route Distance (on roads): ~5.5 km
// - Time Elapsed: 1.533 hours (92 mins)
// - Real Road-Walking Speed: 3.6 km/h
const walkingSpeed = 3.6; 

// Displacement Search Radii (Straight-line search zones):
// 1. High Probability Search Zone: 5.0 km radius (Displacement)
const highRadius = 5000; 
// 2. Medium Probability Limit: 10.0 km radius (Maximum displacement considering dehydration/fatigue limit)
const medRadius = 10000; 

// Initialize Map with Satellite Hybrid as default view
const map = L.map('map', {
    zoomSnap: 0.5
}).setView(cctvCoords, 12);

// Base Map Layers
const satelliteHybrid = L.layerGroup([
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        minZoom: 9,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        minZoom: 9,
        attribution: 'Labels &copy; Esri &mdash; Street references overlay'
    })
]);

const darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    minZoom: 9,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 9,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

satelliteHybrid.addTo(map);

// Add Base Map Layer Control
const baseMaps = {
    "🛰️ Satellite Hybrid": satelliteHybrid,
    "🌑 Dark Mode Map": darkMap,
    "🗺️ Standard Street Map": streetMap
};
L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

// Markers
const dayHomeMarker = L.circleMarker(dayHomeCoords, {
    radius: 9,
    fillColor: '#3b82f6',
    color: '#ffffff',
    weight: 2,
    fillOpacity: 0.8
});

dayHomeMarker.bindPopup(`
    <div class="map-popup-content blue">
        <h4>Day Home (Last Seen)</h4>
        <p><strong>Time:</strong> July 16, 11:20 AM</p>
        <span>Coordinates: ${dayHomeCoords[0].toFixed(5)}, ${dayHomeCoords[1].toFixed(5)}</span>
    </div>
`);

const cctvMarker = L.circleMarker(cctvCoords, {
    radius: 9,
    fillColor: '#ef4444',
    color: '#ffffff',
    weight: 2,
    fillOpacity: 0.8
});

cctvMarker.bindPopup(`
    <div class="map-popup-content">
        <h4>CCTV Sighting</h4>
        <p><strong>Time:</strong> July 16, 12:52 PM</p>
        <span>Coordinates: ${cctvCoords[0].toFixed(5)}, ${cctvCoords[1].toFixed(5)}</span>
    </div>
`);

// Travel Vector (Direction)
const vectorLine = L.polyline([dayHomeCoords, cctvCoords], {
    color: '#f59e0b',
    weight: 3,
    dashArray: '5, 10',
    opacity: 0.8
});

// Group the landmarks & travel vector path into a single layer
const sightingsLayer = L.layerGroup([dayHomeMarker, cctvMarker, vectorLine]).addTo(map);

// Helper function to create a travel cone/sector polygon
function getSectorPolygon(center, startAngle, endAngle, radiusKm) {
    const lat = center[0];
    const lon = center[1];
    const points = [center];
    const earthRadius = 6371; // km
    
    for (let angle = startAngle; angle <= endAngle; angle += 5) {
        const angleRad = (angle * Math.PI) / 180;
        const bearingRad = Math.PI / 2 - angleRad;
        const dLat = (radiusKm / earthRadius) * Math.cos(bearingRad);
        const dLon = (radiusKm / earthRadius) * Math.sin(bearingRad) / Math.cos((lat * Math.PI) / 180);
        points.push([lat + (dLat * 180) / Math.PI, lon + (dLon * 180) / Math.PI]);
    }
    
    return points;
}

// 1. Predicted Cone (Northeast Direction) - Bearing roughly 35° to 95° from CCTV extending 10km (Medium Limit)
const conePoints = getSectorPolygon(cctvCoords, 35, 95, 10.0);
const travelCone = L.polygon(conePoints, {
    color: '#f59e0b',
    fillColor: '#f59e0b',
    fillOpacity: 0.45,
    weight: 3.5,
    dashArray: '4, 6'
}).addTo(map);

// 2. High Probability Search Zone (5.0 km Radius around CCTV)
const highZone = L.circle(cctvCoords, {
    radius: highRadius,
    color: '#ef4444',
    fillColor: '#ef4444',
    fillOpacity: 0.22,
    weight: 3.5
}).addTo(map);

// 3. Medium Probability Search Zone (10.0 km Radius around CCTV)
const medZone = L.circle(cctvCoords, {
    radius: medRadius,
    color: '#f59e0b',
    fillColor: '#f59e0b',
    fillOpacity: 0.06,
    weight: 3.0,
    dashArray: '6, 6'
}).addTo(map);


// Layer group for community searched cells
const communitySearchedLayer = L.layerGroup().addTo(map);

// Fetch and draw live searched grid cells from Supabase
async function loadCommunitySearchedAreas() {
    try {
        const response = await fetch(supabaseUrl, {
            method: "POST",
            headers: {
                "apikey": supabaseAnonKey,
                "Authorization": `Bearer ${supabaseAnonKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ p_window_hours: 6 })
        });
        
        if (!response.ok) {
            console.error("Failed to fetch search cell snapshot:", response.statusText);
            return;
        }

        const data = await response.json();
        
        data.forEach(record => {
            // record format: [cell_id, report_count, last_searched_at_timestamp]
            const cellId = record[0];
            const parts = cellId.split(':');
            if (parts.length !== 3) return;

            const h = parseInt(parts[0].substring(1)); // grid resolution (e.g. 20)
            const x = parseInt(parts[1]);
            const y = parseInt(parts[2]);

            // Convert grid index to latitude/longitude bounds
            const latMin = Ey + (y * h) / Ay;
            const lonMin = f0 + (x * h) / p0;
            const latMax = Ey + ((y + 1) * h) / Ay;
            const lonMax = f0 + ((x + 1) * h) / p0;

            const bounds = [[latMin, lonMin], [latMax, lonMax]];
            
            // Draw rectangle over search grid cell
            const rect = L.rectangle(bounds, {
                color: '#10b981', // Emerald green
                weight: 1,
                fillColor: '#10b981',
                fillOpacity: 0.35
            });

            const date = new Date(record[2]);
            rect.bindPopup(`
                <div class="map-popup-content" style="min-width: 150px;">
                    <h4 style="color:#10b981;">✅ AREA SEARCHED</h4>
                    <p><strong>Grid Cell:</strong> ${cellId}</p>
                    <p><strong>Searches Logged:</strong> ${record[1]}</p>
                    <p><strong>Last Checked:</strong> ${date.toLocaleTimeString()} (${date.toLocaleDateString()})</p>
                </div>
            `);
            
            rect.addTo(communitySearchedLayer);
        });
        console.log(`Loaded ${data.length} community searched cells.`);
    } catch (e) {
        console.error("Error loading community search coverage:", e);
    }
}

// Set bounds to Medium Probability Zone (10.0 km) to restrict view
const bounds = medZone.getBounds();

window.addEventListener('load', () => {
    map.invalidateSize();
    map.fitBounds(bounds, { padding: [20, 20] });
    map.setMaxBounds(bounds.pad(0.05)); // Lock view inside the 10km boundary
    
    // Load the searched grid cells
    loadCommunitySearchedAreas();
});

// Layer toggles
document.getElementById('show-cone').addEventListener('change', function(e) {
    if (e.target.checked) map.addLayer(travelCone);
    else map.removeLayer(travelCone);
});

document.getElementById('show-high-zone').addEventListener('change', function(e) {
    if (e.target.checked) map.addLayer(highZone);
    else map.removeLayer(highZone);
});

document.getElementById('show-med-zone').addEventListener('change', function(e) {
    if (e.target.checked) map.addLayer(medZone);
    else map.removeLayer(medZone);
});

document.getElementById('show-community-searched').addEventListener('change', function(e) {
    if (e.target.checked) map.addLayer(communitySearchedLayer);
    else map.removeLayer(communitySearchedLayer);
});

document.getElementById('show-sightings').addEventListener('change', function (e) {
    if (e.target.checked) map.addLayer(sightingsLayer);
    else map.removeLayer(sightingsLayer);
});
