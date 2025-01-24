// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
//
// // Fix for default marker icons in Leaflet with Vite
// const defaultIcon = L.icon({
//   iconUrl: '/images/marker-icon.png',
//   iconRetinaUrl: '/images/marker-icon-2x.png',
//   shadowUrl: '/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });
//
// L.Marker.prototype.options.icon = defaultIcon;
//
// // Dummy data for intervention locations
// const locations = [
//   {
//     id: 1,
//     district: 'Gasabo',
//     coordinates: [-1.9441, 30.0619],
//     completionRate: 85,
//     beneficiaries: 250,
//   },
//
//
//   {
//     id: 2,
//     district: 'Kicukiro',
//     coordinates: [-1.9706, 30.0587],
//     completionRate: 75,
//     beneficiaries: 180,
//   },
// ];
//
// const ReportMap = () => {
//   const { t } = useTranslation();
//
//   return (
//     <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
//       <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
//         {t('Intervention Areas')}
//       </h3>
//       <div className="h-[400px]">
//         <MapContainer
//           center={[-1.9441, 30.0619]}
//           zoom={11}
//           style={{ height: '100%', width: '100%' }}
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           {locations.map((location) => (
//             <Marker
//               key={location.id}
//               position={location.coordinates as [number, number]}
//             >
//               <Popup>
//                 <div className="p-2">
//                   <h4 className="font-semibold">{location.district}</h4>
//                   <p>{t('Completion')}: {location.completionRate}%</p>
//                   <p>{t('Beneficiaries')}: {location.beneficiaries}</p>
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       </div>
//     </div>
//   );
// };
//
// export default ReportMap;

