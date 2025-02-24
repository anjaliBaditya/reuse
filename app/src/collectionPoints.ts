type CollectionPoint = {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export async function getCollectionPointsNearby(
  latitude: number,
  longitude: number,
  distance: number = 5000, // distance in meters
  apiKey: string = "e41aa630dd257fe9cf136fcf07ec5394de88b980"
): Promise<CollectionPoint[]> {
  try {
    
    const url = `https://api.kierratys.info/collectionspots?lat=${latitude}&lon=${longitude}&dist=${distance}&apikey=${apiKey}`;

    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

   
    const data = await response.json();

    
    return data.collectionspots.map((spot) => ({
      id: spot.id,
      name: spot.name,
      location: {
        latitude: spot.location.coordinates[1],
        longitude: spot.location.coordinates[0],
      },
    }));
  } catch (error) {
    console.error("Error fetching collection points:", error);
    return [];
  }
}
