<template>
  <div
    id="map"
    style="height: 600px; width: 100%"
    class="z-30"
  />
</template>

<script>
import L from 'leaflet';
import 'leaflet.markercluster';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
/* eslint-disable no-undef */
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
/* eslint-enable no-undef */

const typeColors = {
  'Maternel': '#85C38E',
  'Primaire': '#3A97C9',
  'Secondaire': '#BE80B6',
  'Supérieur': '#ED9E41',
  'Haute École': '#ED9E41',
  'Université': '#ED9E41',
  'Arts': '#E37276',
  'Artistique': '#E37276',
  'Adultes': '#42A09E',
};
const defaultColor = '#4A5563';

function getMarkerColor(type) {
  if (!type) return defaultColor;
  for (const [key, color] of Object.entries(typeColors)) {
    if (type.includes(key)) return color;
  }
  return defaultColor;
}

export default {
  props: {
    ecoles: {
      type: Array,
      required: true,
    },
    selectedEcole: {
      type: Object,
      required: false,
      default: null,
    },
  },
  emits: ['selectEcole'],
  data() {
    return {
      map: null,
      markers: null,
      legend: null,
    };
  },
  watch: {
    ecoles: {
      handler() {
        this.updateMarkers();
      },
      deep: true,
    },
    selectedEcole: {
      handler(newVal) {
        if (newVal && newVal.latitude && newVal.longitude) {
          this.map.setView([newVal.latitude, newVal.longitude], 15);
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.initMap();
    this.updateMarkers();
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    initMap() {
      // Initialize map centered on Belgium
      this.map = L.map('map', {
        attributionControl: false
      }).setView([50.5039, 4.4699], 8);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Add attribution control
      L.control.attribution({
        position: 'bottomleft',
        prefix: 'OSM'
      }).addTo(this.map);
    },
    updateMarkers() {
      if (!this.map) return;

      // Remove existing marker cluster group
      if (this.markers) {
        this.map.removeLayer(this.markers);
      }

      // Create new marker cluster group
      this.markers = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 80,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
      });

      // Add markers for each school with valid coordinates
      this.ecoles.forEach(ecole => {
        if (ecole.latitude && ecole.longitude) {
          const color = getMarkerColor(ecole.type_d_enseignement);
          const marker = L.circleMarker([ecole.latitude, ecole.longitude], {
            radius: 7,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.85,
          });

          // Create tooltip content
          const tooltipContent = `
            <div class="font-sans">
              <div class="font-bold text-blue-900">${ecole.nom_d_etablissement || 'École'}</div>
              <div class="text-sm">${ecole.type_d_enseignement || ''}</div>
              <div class="text-sm text-gray-600">${ecole.commune_de_l_etablissement || ''}</div>
            </div>
          `;

          marker.bindTooltip(tooltipContent, {
            direction: 'top',
            offset: [0, -10]
          });

          // On click, emit event to parent
          marker.on('click', () => {
            this.$emit('selectEcole', ecole);
          });

          this.markers.addLayer(marker);
        }
      });

      // Add cluster group to map
      this.map.addLayer(this.markers);

      // Add legend
      if (!this.legend) {
        this.legend = L.control({ position: 'bottomright' });
        this.legend.onAdd = function () {
          const div = L.DomUtil.create('div', 'leaflet-legend');
          div.style.cssText = 'background:white;padding:8px 12px;border-radius:6px;box-shadow:0 1px 4px rgba(0,0,0,.3);font:12px sans-serif;line-height:20px;';
          const items = [
            { label: 'Maternel', color: '#85C38E' },
            { label: 'Primaire', color: '#3A97C9' },
            { label: 'Secondaire', color: '#BE80B6' },
            { label: 'Supérieur / Univ.', color: '#ED9E41' },
            { label: 'Artistique', color: '#E37276' },
            { label: 'Adultes', color: '#42A09E' },
            { label: 'Autre', color: '#4A5563' },
          ];
          div.innerHTML = items.map(i =>
            `<div><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${i.color};margin-right:6px;vertical-align:middle;"></span>${i.label}</div>`
          ).join('');
          return div;
        };
        this.legend.addTo(this.map);
      }

      // Fit bounds to show all markers if there are any
      if (this.markers.getLayers().length > 0 && !this.selectedEcole) {
        this.map.fitBounds(this.markers.getBounds(), {
          padding: [50, 50],
          maxZoom: 12
        });
      }
    },
  },
};
</script>

<style>
/* MarkerCluster styling */
.marker-cluster-small {
  background-color: rgba(58, 151, 201, 0.6);
}
.marker-cluster-small div {
  background-color: rgba(58, 151, 201, 0.8);
}

.marker-cluster-medium {
  background-color: rgba(58, 151, 201, 0.6);
}
.marker-cluster-medium div {
  background-color: rgba(58, 151, 201, 0.8);
}

.marker-cluster-large {
  background-color: rgba(58, 151, 201, 0.6);
}
.marker-cluster-large div {
  background-color: rgba(58, 151, 201, 0.8);
}

.marker-cluster {
  background-clip: padding-box;
  border-radius: 20px;
}
.marker-cluster div {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  margin-top: 5px;
  text-align: center;
  border-radius: 15px;
  font: 12px "Helvetica Neue", Arial, Helvetica, sans-serif;
  font-weight: bold;
  line-height: 30px;
  color: white;
}
</style>
