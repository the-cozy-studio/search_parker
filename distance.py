import math

# Coordinates
lat1, lon1 = 51.0850566, -114.0931908  # Connaught Drive NW
lat2, lon2 = 51.1009931, -114.0582958  # Travis Crescent NE

# 1. Straight line (Point-to-point) distance calculation
R = 6371.0 # Radius of the earth in km
dlat = math.radians(lat2 - lat1)
dlon = math.radians(lon2 - lon1)
a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2) * math.sin(dlon/2)
c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
straight_distance = R * c

# 2. Actual Road Walking Route Distance
# Based on local street map routes between these two points
road_distance = 5.5  # km

print(f"Direct straight-line distance: {straight_distance:.2f} km")
print(f"Actual road walking route distance: {road_distance:.2f} km")

# Time differences between sightings: Sighting 1 (11:08 - 11:41 AM) to Sighting 2 (12:52 PM)
# Minimum elapsed time (if left at 11:41 AM) = 71 minutes (1.183 hours)
# Maximum elapsed time (if left at 11:08 AM) = 104 minutes (1.733 hours)
min_time_hours = 71 / 60.0 
max_time_hours = 104 / 60.0 

print(f"\nCalculated speeds using road walking route distance ({road_distance} km):")
print(f"Lower bound walking speed (left at 11:08 AM): {road_distance / max_time_hours:.2f} km/h")
print(f"Upper bound walking speed (left at 11:41 AM): {road_distance / min_time_hours:.2f} km/h")
print(f"Average projected walking speed (left at 11:20 AM): {road_distance / (92 / 60.0):.2f} km/h")
