<template>
  <div>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="(ecole, index) in paginatedEcoles"
        :key="index"
        class="group relative flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
        @click="emitSelectedEcole(ecole)"
      >
        <!-- Type color accent bar -->
        <div
          class="h-0.5 w-full"
          :class="getAccentBarClass(ecole.type)"
        />

        <div class="flex flex-col gap-3 p-4 flex-1">
          <!-- Name -->
          <p class="text-sm font-semibold leading-snug text-gray-900">
            {{ ecole.nom || 'École' }}
          </p>

          <!-- Info rows -->
          <div class="flex flex-col gap-1.5">
            <div
              v-if="ecole.adr_etab"
              class="flex items-start gap-2"
            >
              <MapPinIcon class="mt-0.5 h-3.5 w-3.5 flex-none text-gray-300" />
              <span class="text-xs leading-snug text-gray-500">
                {{ ecole.adr_etab }}, {{ ecole.cp_etab }} {{ ecole.loc_etab }}
              </span>
            </div>

            <div
              v-if="ecole.type"
              class="flex items-center gap-2"
            >
              <AcademicCapIcon class="h-3.5 w-3.5 flex-none text-gray-300" />
              <span class="text-xs text-gray-500">
                {{ ecole.type }}<span v-if="ecole.niveau"> · {{ ecole.niveau }}</span>
              </span>
            </div>

            <div
              v-if="ecole.reseau"
              class="flex items-center gap-2"
            >
              <BuildingLibraryIcon class="h-3.5 w-3.5 flex-none text-gray-300" />
              <span class="text-xs text-gray-500">{{ ecole.reseau }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between border-t border-gray-100 px-4 py-2">
          <span
            v-if="ecole.commune_etab"
            class="text-xs font-medium text-gray-400"
          >
            {{ ecole.commune_etab }}
          </span>
          <ChevronRightIcon class="ml-auto h-4 w-4 text-gray-200 transition-colors group-hover:text-age" />
        </div>
      </div>
    </div>

    <div
      v-if="ecoles.length > pageSize"
      class="mt-6 flex items-center justify-center gap-4"
    >
      <button
        :disabled="currentPage === 1"
        class="rounded-md bg-age px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        @click="currentPage--"
      >
        Précédent
      </button>
      <span class="text-sm text-gray-700">
        Page {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        :disabled="currentPage >= totalPages"
        class="rounded-md bg-age px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        @click="currentPage++"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script>
import { ChevronRightIcon, MapPinIcon, AcademicCapIcon, BuildingLibraryIcon } from '@heroicons/vue/20/solid';

export default {
  components: {
    ChevronRightIcon,
    MapPinIcon,
    AcademicCapIcon,
    BuildingLibraryIcon,
  },
  props: {
    ecoles: {
      type: Array,
      required: true,
    },
  },
  emits: ['selectEcole'],
  data() {
    return {
      currentPage: 1,
      pageSize: 60,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.ecoles.length / this.pageSize);
    },
    paginatedEcoles() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.ecoles.slice(start, start + this.pageSize);
    },
  },
  watch: {
    ecoles() {
      this.currentPage = 1;
    },
  },
  methods: {
    emitSelectedEcole(ecole) {
      this.$emit('selectEcole', ecole);
    },
    getAccentBarClass(type) {
      if (!type) return 'bg-gray-200';
      if (type.includes('Maternel')) return 'bg-agaj';
      if (type.includes('Primaire')) return 'bg-age';
      if (type.includes('Secondaire')) return 'bg-agmj';
      if (type.includes('Supérieur') || type.includes('Haute') || type.includes('Université') || type.includes('Arts')) return 'bg-ags';
      return 'bg-gray-200';
    },
    getEducationTypeClass(type) {
      const typeMap = {
        'Maternel': 'bg-agaj/10 text-agaj ring-agaj/20',
        'Primaire': 'bg-age/10 text-age ring-age/20',
        'Secondaire': 'bg-agmj/10 text-agmj ring-agmj/20',
        'Supérieur': 'bg-ags/10 text-ags ring-ags/20',
      };
      for (const [key, value] of Object.entries(typeMap)) {
        if (type && type.includes(key)) return value;
      }
      return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    },
  },
};
</script>
