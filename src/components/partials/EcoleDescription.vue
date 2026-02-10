<template>
  <!-- eslint-disable vue/no-reserved-component-names -->
  <TransitionRoot
    as="template"
    :show="!!ecole"
  >
    <Dialog
      as="div"
      class="relative z-50"
      @close="$emit('close')"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
              <div
                v-if="ecole"
                class="overflow-hidden shadow sm:rounded-lg bg-white"
              >
                <div class="px-4 py-5 sm:px-6 bg-age/10">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-xl font-bold leading-7 text-gray-900">
                        {{ ecole.nom_d_etablissement || 'École' }}
                      </h3>
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
                    </div>
                    <button
                      type="button"
                      class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      @click="$emit('close')"
                    >
                      <span class="sr-only">Fermer</span>
                      <XMarkIcon
                        class="h-6 w-6"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
                <div class="border-t border-gray-200">
                  <dl class="divide-y divide-gray-100">
                    <!-- Identity Section -->
                    <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-bold leading-6 text-gray-900">
                        Identification
                      </dt>
                      <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <div v-if="ecole.numero_bce_de_l_etablissement">
                          <span class="font-medium">N° BCE:</span>
                          <a
                            :href="`https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?nummer=${ecole.numero_bce_de_l_etablissement}&actionLu=Rechercher`"
                            target="_blank"
                            class="text-age hover:underline"
                          >{{ ecole.numero_bce_de_l_etablissement }}</a>
                        </div>
                        <div v-if="ecole.ndeg_fase_de_l_etablissement">
                          <span class="font-medium">N° FASE établissement:</span> {{ ecole.ndeg_fase_de_l_etablissement }}
                        </div>
                        <div v-if="ecole.ndeg_fase_de_l_implantation">
                          <span class="font-medium">N° FASE implantation:</span> {{ ecole.ndeg_fase_de_l_implantation }}
                        </div>
                      </dd>
                    </div>

                    <!-- Location Section -->
                    <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-bold leading-6 text-gray-900">
                        Localisation
                      </dt>
                      <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <div v-if="ecole.adresse_de_l_etablissement">
                          {{ ecole.adresse_de_l_etablissement }}
                        </div>
                        <div v-if="ecole.code_postal_de_l_etablissement || ecole.localite_de_l_etablissement">
                          {{ ecole.code_postal_de_l_etablissement }} {{ ecole.localite_de_l_etablissement }}
                        </div>
                        <div
                          v-if="ecole.commune_de_l_etablissement"
                          class="mt-1"
                        >
                          <span class="font-medium">Commune:</span> {{ ecole.commune_de_l_etablissement }}
                        </div>
                        <div
                          v-if="ecole.arrondissement_administratif"
                          class="mt-1"
                        >
                          <span class="font-medium">Arrondissement:</span> {{ ecole.arrondissement_administratif }}
                        </div>
                        <div
                          v-if="ecole.bassin"
                          class="mt-1"
                        >
                          <span class="font-medium">Bassin:</span> {{ ecole.bassin }}
                        </div>
                      </dd>
                    </div>

                    <!-- Education Section -->
                    <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-bold leading-6 text-gray-900">
                        Enseignement
                      </dt>
                      <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <div v-if="ecole.type_d_enseignement">
                          <span class="font-medium">Type:</span> {{ ecole.type_d_enseignement }}
                        </div>
                        <div
                          v-if="ecole.niveau"
                          class="mt-1"
                        >
                          <span class="font-medium">Niveau:</span> {{ ecole.niveau }}
                        </div>
                        <div
                          v-if="ecole.genre"
                          class="mt-1"
                        >
                          <span class="font-medium">Genre:</span> {{ ecole.genre }}
                        </div>
                      </dd>
                    </div>

                    <!-- Network Section -->
                    <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-bold leading-6 text-gray-900">
                        Réseau
                      </dt>
                      <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <div v-if="ecole.reseau">
                          {{ ecole.reseau }}
                        </div>
                        <div
                          v-if="ecole.nom_du_po"
                          class="mt-1"
                        >
                          <span class="font-medium">Pouvoir organisateur:</span> {{ ecole.nom_du_po }}
                        </div>
                      </dd>
                    </div>
                  </dl>

                  <!-- Action buttons -->
                  <div class="px-4 py-4 sm:px-6 bg-gray-50 flex gap-3">
                    <a
                      v-if="ecole.latitude && ecole.longitude"
                      type="button"
                      class="inline-flex items-center rounded-md bg-age px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                      :href="`https://www.google.be/maps/dir/?api=1&destination=${ecole.latitude},${ecole.longitude}`"
                      target="_blank"
                    >
                      <MapIcon
                        class="h-5 w-5 mr-2"
                        aria-hidden="true"
                      />
                      Voir sur Google Maps
                    </a>
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      @click="$emit('close')"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { MapIcon } from '@heroicons/vue/24/outline';
import { XMarkIcon } from '@heroicons/vue/24/outline';

export default {
  /* eslint-disable vue/no-reserved-component-names */
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    MapIcon,
    XMarkIcon,
  },
  /* eslint-enable vue/no-reserved-component-names */
  props: {
    ecole: {
      type: Object,
      required: true,
      default: null,
    },
  },
  emits: ['close'],
  methods: {
    getEducationTypeClass(type) {
      const typeMap = {
        'Maternel': 'bg-agaj/10 text-agaj ring-agaj/20',
        'Primaire': 'bg-age/10 text-age ring-age/20',
        'Secondaire': 'bg-agmj/10 text-agmj ring-agmj/20',
        'Supérieur': 'bg-ags/10 text-ags ring-ags/20',
      };

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
