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
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
  data() {
    return {
      map: null,
      markers: null,
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
          const marker = L.marker([ecole.latitude, ecole.longitude]);

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
