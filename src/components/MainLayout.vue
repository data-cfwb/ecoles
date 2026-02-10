<script setup>
import { ref } from 'vue';
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { PlusIcon } from '@heroicons/vue/20/solid';

const mobileFiltersOpen = ref(false);
</script>
<template>
  <div class="bg-white">
    <div>
      <!-- Mobile filter dialog -->
      <TransitionRoot
        as="template"
        :show="mobileFiltersOpen"
      >
        <Dialog
          as="div"
          class="relative z-40 lg:hidden"
          @close="mobileFiltersOpen = false"
        >
          <TransitionChild
            as="template"
            enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div class="fixed inset-0 z-40 flex">
            <TransitionChild
              as="template"
              enter="transition ease-in-out duration-300 transform"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                <div class="flex items-center justify-between px-4">
                  <h2 class="text-lg font-bold text-gray-500 uppercase">
                    Filtres
                  </h2>
                  <button
                    type="button"
                    class="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                    @click="mobileFiltersOpen = false"
                  >
                    <span class="sr-only">Fermer menu</span>
                    <XMarkIcon
                      class="h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div class="pb-4 pt-4 px-4 text-sm font-bold">
                  {{ ecoles.length }} écoles trouvées
                </div>

                <!-- Search by name -->
                <div class="border-t border-gray-200 pb-4 pt-4 px-4">
                  <label
                    for="search-name-mobile"
                    class="block text-sm font-bold text-gray-900 uppercase"
                  >
                    Recherche par nom
                  </label>
                  <input
                    id="search-name-mobile"
                    v-model="search_text"
                    type="text"
                    placeholder="Nom de l'école"
                    class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-age focus:ring-age sm:text-sm"
                    @input="searchByName"
                  >
                </div>

                <!-- Search by postal code -->
                <div class="border-t border-gray-200 pb-4 pt-4 px-4">
                  <label
                    for="search-postal-mobile"
                    class="block text-sm font-bold text-gray-900 uppercase"
                  >
                    Code postal
                  </label>
                  <input
                    id="search-postal-mobile"
                    v-model="search_postal"
                    type="number"
                    placeholder="ex: 1000"
                    class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-age focus:ring-age sm:text-sm"
                    @input="searchByPostalCode"
                  >
                </div>

                <!-- Filters -->
                <div
                  v-for="section in filters"
                  :key="section.name"
                  as="div"
                  class="border-t border-gray-200 pb-4 pt-4"
                >
                  <fieldset>
                    <legend class="w-full px-2">
                      <div class="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                        <span class="text-sm font-bold text-gray-900 uppercase">{{ section.name }}</span>
                      </div>
                    </legend>
                    <div v-if="data_loaded">
                      <div class="px-4 pb-2">
                        <div class="space-y-3">
                          <button
                            v-for="option in section.options"
                            :key="option"
                            class="flex items-center text-left"
                            :class="active_filters[section.id] === option ? 'font-bold text-age' : ''"
                            @click="filterCategory(section.id, option)"
                          >
                            {{ option }} <span class="text-gray-500 ml-1">({{ getCountCategory(section.id, option) }})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>

                <div class="px-4 pt-4">
                  <button
                    v-if="Object.keys(active_filters).length > 0 || search_text || search_postal"
                    class="w-full rounded-md bg-age px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    @click="resetFilter"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>

      <main class="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div class="border-b border-gray-200 pb-10">
          <!-- logo -->
          <div class="flex items-center justify-center">
            <img
              src="https://raw.githubusercontent.com/data-cfwb/charte-graphique/main/pastilles_PNG_et_SVG_24px/pastille_ENS24.svg"
              alt="Fédération Wallonie-Bruxelles"
              width="48"
              class="px-1 sm:px-1"
            >
            <h1 class="text-4xl font-bold tracking-tight text-gray-900">
              Les écoles en FWB
            </h1>
          </div>
          <!-- hide on small -->
          <p class="mt-4 text-base text-gray-500 max-md:hidden text-center">
            Trouvez des informations sur les <span class="font-semibold">{{ original_ecoles.length }}</span> établissements d'enseignement en Fédération Wallonie-Bruxelles.
          </p>

          <div class="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            <aside>
              <h2 class="sr-only">
                Filtres
              </h2>

              <button
                type="button"
                class="inline-flex items-center lg:hidden"
                @click="mobileFiltersOpen = true"
              >
                <span class="text-sm font-medium text-gray-700 uppercase">Filtres</span>
                <PlusIcon
                  class="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              </button>

              <div class="hidden lg:block">
                <!-- Search by name -->
                <div class="py-6">
                  <label
                    for="search-name"
                    class="block text-md font-bold leading-6 text-gray-900 uppercase"
                  >
                    <MagnifyingGlassIcon class="h-6 w-6 text-age inline-flex items-baseline" />
                    Recherche par nom
                  </label>
                  <input
                    id="search-name"
                    v-model="search_text"
                    type="text"
                    placeholder="Nom de l'école"
                    class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-age focus:ring-age sm:text-sm"
                    @input="searchByName"
                  >
                </div>

                <!-- Search by postal code -->
                <div class="py-6 pt-4">
                  <label
                    for="search-postal"
                    class="block text-md font-bold leading-6 text-gray-900 uppercase"
                  >
                    <MapPinIcon class="h-6 w-6 text-age inline-flex items-baseline" />
                    Code postal
                  </label>
                  <input
                    id="search-postal"
                    v-model="search_postal"
                    type="number"
                    placeholder="ex: 1000"
                    class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-age focus:ring-age sm:text-sm"
                    @input="searchByPostalCode"
                  >
                </div>

                <div
                  v-for="(section, sectionIdx) in filters"
                  :key="section.name"
                  :class="sectionIdx === 0 ? 'pt-6' : 'pt-10'"
                >
                  <fieldset>
                    <legend class="block text-md leading-6 font-bold text-gray-900 uppercase">
                      {{ section.name }}
                    </legend>
                    <div class="space-y-3 pt-2 max-h-64 overflow-y-auto">
                      <button
                        v-for="option in section.options"
                        :key="option"
                        class="flex items-center hover:text-age text-left"
                        :class="active_filters[section.id] === option ? 'font-bold text-age' : ''"
                        @click="filterCategory(section.id, option)"
                      >
                        {{ option }} <span class="text-gray-500 ml-1">({{ getCountCategory(section.id, option) }})</span>
                      </button>
                    </div>
                  </fieldset>
                </div>

                <div class="pt-6">
                  <button
                    v-if="Object.keys(active_filters).length > 0 || search_text || search_postal"
                    class="w-full rounded-md bg-age px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    @click="resetFilter"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            </aside>

            <!-- Ecole content -->
            <div class="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
              <!-- Your content -->
              <div>
                <LoadingFwb v-if="!data_loaded" />
                <div v-else>
                  <div class="px-4 sm:px-6 lg:px-8">
                    <div class="sm:flex sm:items-center">
                      <div class="sm:flex-auto">
                        <p class="text-sm text-gray-700">
                          {{ ecoles.length }} écoles trouvées
                        </p>
                      </div>
                      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                          v-if="!seeMap"
                          type="button"
                          class="relative inline-flex items-center block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                          @click="seeMap = !seeMap"
                        >
                          <MapPinIcon class="h-6 w-6 text-white" />
                          Voir sur une carte
                        </button>
                        <button
                          v-if="seeMap"
                          type="button"
                          class="relative inline-flex items-center block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          @click="seeMap = !seeMap"
                        >
                          <ListBulletIcon class="h-6 w-6 text-white" />
                          Liste des écoles
                        </button>
                      </div>
                    </div>
                    <div class="mt-8 flow-root">
                      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                          <div
                            v-if="seeMap"
                            class="overflow-hidden border-t border-gray-200 sm:rounded-lg"
                          >
                            <MapComponent
                              :ecoles="ecoles"
                              :selected-ecole="selected_ecole"
                              @select-ecole="selectEcole"
                            />
                          </div>
                          <ListEcoles
                            v-if="!seeMap"
                            :ecoles="ecoles"
                            @select-ecole="selectEcole"
                          />
                          <EcoleDescription
                            v-if="selected_ecole && selected_ecole.nom_d_etablissement"
                            :ecole="selected_ecole"
                            @close="selected_ecole = null"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <FooterModule />
  </div>
</template>

<script>
import ecolesData from '@/data/ecoles.json';
import MapComponent from '@/components/MapComponent.vue';
import FooterModule from '@/components/partials/FooterModule.vue';
import ListEcoles from '@/components/ListEcoles.vue';
import EcoleDescription from '@/components/partials/EcoleDescription.vue';
import { MapPinIcon, ListBulletIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

export default {
  components: {
    MapComponent,
    ListEcoles,
    EcoleDescription,
    MapPinIcon,
    ListBulletIcon,
    MagnifyingGlassIcon,
    FooterModule
  },
  data() {
    return {
      title: 'Les écoles en FWB',
      filters: [
        {
          id: 'type_d_enseignement',
          name: 'Type d\'enseignement',
          options: [],
        },
        {
          id: 'reseau',
          name: 'Réseau',
          options: [],
        },
        {
          id: 'arrondissement_administratif',
          name: 'Arrondissement',
          options: [],
        },
        {
          id: 'commune_de_l_etablissement',
          name: 'Commune',
          options: [],
        }
      ],
      selected_ecole: null,
      original_ecoles: [],
      ecoles: [],
      active_filters: {},
      search_text: '',
      search_postal: '',
      data_loaded: false,
      seeMap: false,
    };
  },
  computed: {
    addProperties() {
      return this.ecoles.map(ecole => {
        ecole.latLong = [parseFloat(ecole.latitude), parseFloat(ecole.longitude)];
        ecole.fullAddress = `${ecole.adresse_de_l_etablissement || ''}, ${ecole.code_postal_de_l_etablissement || ''} ${ecole.localite_de_l_etablissement || ''}`.trim();

        // Clean text fields
        if (ecole.nom_d_etablissement) {
          ecole.nom_d_etablissement = ecole.nom_d_etablissement.replace(/\n/g, ' ').trim();
        }
        if (ecole.commune_de_l_etablissement) {
          ecole.commune_de_l_etablissement = ecole.commune_de_l_etablissement.replace(/\n/g, ' ').trim();
        }
        if (ecole.localite_de_l_etablissement) {
          ecole.localite_de_l_etablissement = ecole.localite_de_l_etablissement.replace(/\n/g, ' ').trim();
        }

        return ecole;
      });
    },
  },
  created() {
    this.getEcoles();
  },
  methods: {
    selectEcole(ecole) {
      this.selected_ecole = ecole;
      console.log(ecole);
    },
    getCountCategory(category, item) {
      return this.original_ecoles.filter(ecole => ecole[category] === item).length;
    },
    defineFilters() {
      for (let i = 0; i < this.filters.length; i++) {
        const uniqueValues = [...new Set(this.original_ecoles.map(ecole => ecole[this.filters[i].id]))].filter(val => val && val.trim());
        this.filters[i].options = uniqueValues.sort();
      }
    },
    filterCategory(category, value) {
      if (this.active_filters[category] === value) {
        delete this.active_filters[category];
      } else {
        this.active_filters[category] = value;
      }
      this.applyFilters();
    },
    searchByName() {
      this.applyFilters();
    },
    searchByPostalCode() {
      this.applyFilters();
    },
    applyFilters() {
      let filtered = [...this.original_ecoles];

      // Apply category filters
      Object.keys(this.active_filters).forEach(category => {
        const value = this.active_filters[category];
        filtered = filtered.filter(ecole => ecole[category] === value);
      });

      // Apply name search
      if (this.search_text) {
        const searchLower = this.search_text.toLowerCase();
        filtered = filtered.filter(ecole =>
          ecole.nom_d_etablissement && ecole.nom_d_etablissement.toLowerCase().includes(searchLower)
        );
      }

      // Apply postal code search
      if (this.search_postal) {
        filtered = filtered.filter(ecole =>
          ecole.code_postal_de_l_etablissement && ecole.code_postal_de_l_etablissement.toString().includes(this.search_postal)
        );
      }

      this.ecoles = filtered;
      this.addProperties;
      this.orderByCommune();
    },
    orderByCommune() {
      this.ecoles.sort((a, b) => {
        if (!a.commune_de_l_etablissement) return 1;
        if (!b.commune_de_l_etablissement) return -1;
        return a.commune_de_l_etablissement.localeCompare(b.commune_de_l_etablissement);
      });
    },
    resetFilter() {
      this.active_filters = {};
      this.search_text = '';
      this.search_postal = '';
      this.ecoles = [...this.original_ecoles];
      this.addProperties;
      this.orderByCommune();
    },
    getEcoles() {
      this.data_loaded = false;
      this.original_ecoles = ecolesData;
      this.ecoles = [...this.original_ecoles];
      this.addProperties;
      this.orderByCommune();
      this.defineFilters();
      console.log(`Loaded ${this.ecoles.length} schools`);
      this.data_loaded = true;
    },
  },
};
</script>
