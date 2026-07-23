import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Card from '../common/Card';
import Skeleton from '../common/Skeleton';
import StatusBadge from '../common/StatusBadge';

/**
 * RouteMap - Map visualization of shipment routes with polylines.
 *
 * @param {object} props
 * @param {Array<{lat:number, lng:number}>} props.route - Array of route points
 * @param {Array<{position:[number,number], title:string, status:string}>} [props.waypoints]
 * @param {Array<number>} [props.center]
 * @param {number} [props.zoom]
 * @param {string} [props.color='#6366f1']
 * @param {boolean} [props.loading=false]
 * @param {string} [props.title='Route']
 * @param {string} [props.className]
 */
function RouteMap({ route, waypoints, center, zoom, color = '#6366f1', loading = false, title = 'Route', className = '' }) {
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

  const defaultCenter = center || (route && route.length > 0 ? [route[0].lat, route[0].lng] : [20, 0]);
  const defaultZoom = zoom || (route ? 4 : 3);

  if (loading) {
    return (
      <Card padding="lg" className={className}>
        <Card.Header title={title} />
        <Skeleton variant="rect" height={350} />
      </Card>
    );
  }

  const positions = route?.map(p => [p.lat, p.lng]) || [];

  return (
    <Card padding="none" className={className}>
      <div className="p-4 pb-2">
        <Card.Header title={title} />
      </div>
      {mapReady ? (
        <div className="rounded-b-xl overflow-hidden" style={{ height: 350 }}>
          <MapContainer center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={true} zoomControl={false} className="h-full w-full" aria-label="Route map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <ZoomControl position="bottomright" />
            {positions.length > 1 && (
              <Polyline positions={positions} pathOptions={{ color, weight: 3, opacity: 0.7, dashArray: '10 5' }} />
            )}
            {waypoints?.map((wp, i) => (
              <Marker key={i} position={wp.position}>
                <Popup>
                  <div>
                    <p className="text-sm font-semibold">{wp.title}</p>
                    {wp.status && <div className="mt-1"><StatusBadge status={wp.status} size="sm" /></div>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center" style={{ height: 350 }}>
          <Skeleton variant="rect" height={350} />
        </div>
      )}
    </Card>
  );
}

export default RouteMap;

