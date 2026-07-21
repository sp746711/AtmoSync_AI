import { Marker, Popup } from 'react-leaflet';
import MarkerPopup from './MarkerPopup';

/**
 * ShipmentMarker - Interactive map marker for a shipment.
 *
 * @param {object} props
 * @param {object} props.marker
 * @param {Array<number>} props.marker.position - [lat, lng]
 * @param {string} [props.marker.status]
 * @param {string} [props.marker.title]
 * @param {function} [props.onClick]
 */
function ShipmentMarker({ marker, onClick }) {
  if (!marker || !marker.position || marker.position.length !== 2) {
    return null;
  }

  const getMarkerColor = (status) => {
    const colorMap = {
      active: '#22c55e',
      in_transit: '#3b82f6',
      completed: '#22c55e',
      pending: '#eab308',
      delayed: '#ef4444',
      at_risk: '#f97316',
      failed: '#ef4444',
      warning: '#eab308',
      critical: '#ef4444',
    };
    return colorMap[status?.toLowerCase()] || '#6366f1';
  };

  const color = getMarkerColor(marker.status);

  // Custom DivIcon with colored circle
  const icon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 12px;
        height: 12px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -10],
  });

  return (
    <Marker
      position={marker.position}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <MarkerPopup marker={marker} />
      </Popup>
    </Marker>
  );
}

export default ShipmentMarker;
