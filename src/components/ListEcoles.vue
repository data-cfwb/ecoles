<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="ecole in ecoles"
      :key="ecole.ndeg_fase_de_l_etablissement"
      class="relative flex flex-col gap-2 rounded-lg border border-gray-300 bg-white px-4 py-4 shadow-sm hover:border-age hover:shadow-md transition-all cursor-pointer"
      @click="emitSelectedEcole(ecole)"
    >
      <div class="flex-1">
        <p class="text-lg font-bold leading-6 text-gray-900">
          {{ ecole.nom_d_etablissement || 'École' }}
        </p>

        <div class="mt-2 flex items-center gap-2">
          <span
            v-if="ecole.type_d_enseignement"
            class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
            :class="getEducationTypeClass(ecole.type_d_enseignement)"
          >
            {{ ecole.type_d_enseignement }}
          </span>
          <span
            v-if="ecole.niveau"
            class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
          >
            {{ ecole.niveau }}
          </span>
        </div>

        <p class="mt-2 text-sm text-gray-600">
          <span class="font-medium">Adresse:</span><br>
          {{ ecole.adresse_de_l_etablissement || 'Non renseigné' }}<br>
          {{ ecole.code_postal_de_l_etablissement }} {{ ecole.localite_de_l_etablissement }}
        </p>

        <p
          v-if="ecole.reseau"
          class="mt-2 text-sm text-gray-500"
        >
          <span class="font-medium">Réseau:</span> {{ ecole.reseau }}
        </p>

        <p
          v-if="ecole.commune_de_l_etablissement"
          class="mt-1 text-sm text-gray-500"
        >
          <span class="font-medium">Commune:</span> {{ ecole.commune_de_l_etablissement }}
        </p>
      </div>

      <div class="flex items-center justify-end pt-2">
        <ChevronRightIcon
          class="h-5 w-5 flex-none text-gray-400"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ChevronRightIcon } from '@heroicons/vue/20/solid';

export default {
  components: {
    ChevronRightIcon,
  },
  props: {
    ecoles: {
      type: Array,
      required: true,
    },
  },
  emits: ['selectEcole'],
  methods: {
    emitSelectedEcole(ecole) {
      this.$emit('selectEcole', ecole);
    },
    getEducationTypeClass(type) {
      const typeMap = {
        'Maternel': 'bg-agaj/10 text-agaj ring-agaj/20',
        'Primaire': 'bg-age/10 text-age ring-age/20',
        'Secondaire': 'bg-agmj/10 text-agmj ring-agmj/20',
        'Supérieur': 'bg-ags/10 text-ags ring-ags/20',
      };

      // Check if the type contains any of the keys
      for (const [key, value] of Object.entries(typeMap)) {
        if (type && type.includes(key)) {
          return value;
        }
      }

      return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    },
  },
};
</script>
