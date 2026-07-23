import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Card from '../common/Card';
import Skeleton from '../common/Skeleton';
import RiskBadge from '../risk/RiskBadge';

/**
 * RiskMap - Map visualization of risk hotspots by region.
 *
 * @param {object} props
 * @param {Array<{lat:number, lng:number, risk:number, title:string, region:string}>} props.hotspots
 * @param {Array<number>} [props.center=[20, 0]]
 * @param {number} [props.zoom=3]
 * @param {boolean} [props.loading=false]
 * @param {string} [props.title='Risk Map']
 * @param {string} [props.className]
 */
function RiskMap({ hotspots, center = [20, 0], zoom = 3, loading = false, title = 'Risk Map', className = '' }) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    import('leaflet').then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setMapReady(true);
    });
  }, []);

  if (loading) {
    return (
      <Card padding="lg" className={className}>
        <Card.Header title={title} />
        <Skeleton variant="rect" height={400} />
      </Card>
    );
  }

  const getRiskColor = (risk) => {
    if (risk > 75) return '#ef4444';
    if (risk > 50) return '#f97316';
    if (risk > 25) return '#eab308';
    return '#22c55e';
  };

  const getRadius = (risk) => Math.max(8, (risk / 100) * 30);

  return (
    <Card padding="none" className={className}>
      <div className="p-4 pb-2">
        <Card.Header title={title} />
      </div>
      {mapReady ? (
        <div className="relative rounded-b-xl overflow-hidden" style={{ height: 400 }}>
          <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} zoomControl={false} className="h-full w-full" aria-label="Risk map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <ZoomControl position="bottomright" />
            {hotspots?.map((spot, i) => (
              <CircleMarker
                key={i}
                center={[spot.lat, spot.lng]}
                radius={getRadius(spot.risk)}
                pathOptions={{ color: getRiskColor(spot.risk), fillColor: getRiskColor(spot.risk), fillOpacity: 0.5, weight: 2 }}
              >
                <Popup>
                  <div className="min-w-[150px]">
                    <p className="text-sm font-semibold text-gray-900">{spot.title || spot.region}</p>
                    <div className="mt-1">
                      <RiskBadge level={spot.risk} size="sm" />
                    </div>
                    {spot.region && <p className="text-xs text-gray-500 mt-1">{spot.region}</p>}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center" style={{ height: 400 }}>
          <Skeleton variant="rect" height={400} />
        </div>
      )}
    </Card>
  );
}

export default RiskMap;

