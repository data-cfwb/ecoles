import './styles/base.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

import LoadingFwb from './components/partials/LoadingFwb.vue';

app.component('LoadingFwb', LoadingFwb);

app.mount('#app');
