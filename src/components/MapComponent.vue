<template>
  <div
    id="map"
    class="z-30 h-[50vh] sm:h-[60vh] lg:h-[600px] w-full"
  />
</template>

<script>
import L from 'leaflet';

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
      markerLayer: null,
      legend: null,
    };
  },
  watch: {
    ecoles: {
      handler() {
        this.updateMarkers();
      },
    },
    selectedEcole: {
      handler(newVal) {
        if (this.map && newVal && newVal.lat && newVal.lng) {
          this.map.setView([newVal.lat, newVal.lng], 15);
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
      this.map = L.map('map', {
        attributionControl: false,
        preferCanvas: true,
      }).setView([50.5039, 4.4699], 8);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      L.control.attribution({
        position: 'bottomleft',
        prefix: 'OSM'
      }).addTo(this.map);
    },
    updateMarkers() {
      if (!this.map) return;

      if (this.markerLayer) {
        this.map.removeLayer(this.markerLayer);
      }

      this.markerLayer = L.layerGroup();
      const bounds = L.latLngBounds();

      // Group schools by coordinates to handle overlaps
      const coordMap = {};
      this.ecoles.forEach(ecole => {
        if (ecole.lat && ecole.lng) {
          const key = `${ecole.lat},${ecole.lng}`;
          if (!coordMap[key]) coordMap[key] = [];
          coordMap[key].push(ecole);
        }
      });

      const offset = 0.00007; // ~7m spread for overlapping points
      Object.values(coordMap).forEach(group => {
        group.forEach((ecole, i) => {
          let lat = parseFloat(ecole.lat);
          let lng = parseFloat(ecole.lng);

          if (group.length > 1) {
            const angle = (2 * Math.PI * i) / group.length;
            lat += offset * Math.cos(angle);
            lng += offset * Math.sin(angle);
          }

          const color = getMarkerColor(ecole.type);
          const latlng = [lat, lng];
          bounds.extend(latlng);

          const marker = L.circleMarker(latlng, {
            radius: 8,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
          });

          const tooltipContent = `
            <div class="font-sans">
              <div class="font-bold text-blue-900">${ecole.nom || 'École'}</div>
              <div class="text-sm">${ecole.type || ''}</div>
              <div class="text-sm text-gray-600">${ecole.commune_etab || ''}</div>
            </div>
          `;

          marker.bindTooltip(tooltipContent, {
            direction: 'top',
            offset: [0, -10]
          });

          marker.on('click', () => {
            this.$emit('selectEcole', ecole);
          });

          this.markerLayer.addLayer(marker);
        });
      });

      this.markerLayer.addTo(this.map);

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

      if (bounds.isValid() && !this.selectedEcole) {
        this.map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12
        });
      }
    },
  },
};
</script>

<style>
.ecole-marker {
  background: none !important;
  border: none !important;
}
</style>
