import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ShipmentMarker from './ShipmentMarker';
import MapLegend from './MapLegend';
import Card from '../common/Card';
import Skeleton from '../common/Skeleton';

/**
 * ShipmentMap - Interactive map displaying shipment locations.
 *
 * @param {object} props
 * @param {Array} [props.markers]
 * @param {Array<number>} [props.center=[20, 0]]
 * @param {number} [props.zoom=3]
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onMarkerClick]
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {string} [props.className]
 * @param {string} [props.tileUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png']
 * @param {string} [props.tileAttribution='&copy; OpenStreetMap contributors']
 * @param {boolean} [props.showLegend=true]
 * @param {boolean} [props.scrollWheelZoom=true]
 */
function ShipmentMap({
  markers,
  center = [20, 0],
  zoom = 3,
  loading = false,
  onMarkerClick,
  title,
  subtitle,
  className = '',
  tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  showLegend = true,
  scrollWheelZoom = true,
}) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Fix default marker icon issue with webpack/vite
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
        {title && <Card.Header title={title} subtitle={subtitle} />}
        <div className={title ? 'mt-4' : ''}>
          <Skeleton variant="rect" height={400} />
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" className={className}>
      {(title || subtitle) && (
        <div className="p-4 pb-2">
          <Card.Header title={title} subtitle={subtitle} />
        </div>
      )}

      {mapReady ? (
        <div className="relative rounded-b-xl overflow-hidden" style={{ height: 400 }}>
          <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={scrollWheelZoom}
            zoomControl={false}
            className="h-full w-full"
            aria-label="Shipment location map"
          >
            <TileLayer url={tileUrl} attribution={tileAttribution} />
            <ZoomControl position="bottomright" />

            {markers &&
              markers.map((marker, index) => (
                <ShipmentMarker
                  key={marker.id || index}
                  marker={marker}
                  onClick={() => onMarkerClick?.(marker)}
                />
              ))}
          </MapContainer>

          {showLegend && markers && markers.length > 0 && (
            <div className="absolute bottom-4 left-4 z-[1000]">
              <MapLegend markers={markers} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center" style={{ height: 400 }}>
          <Skeleton variant="rect" height={400} />
        </div>
      )}
    </Card>
  );
}

export default ShipmentMap;
