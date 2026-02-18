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
                  <!-- Implantation Address -->
                  <div
                    v-if="ecole.adresse_de_l_implantation || ecole.code_postal_de_l_implantation"
                    class="px-4 py-4 sm:px-6 flex items-start gap-3"
                  >
                    <MapPinIcon class="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                    <div class="text-sm text-gray-700">
                      <div class="text-xs font-medium text-gray-500 uppercase mb-1">
                        Adresse de l'implantation
                      </div>
                      <div v-if="ecole.adresse_de_l_implantation">
                        {{ ecole.adresse_de_l_implantation }}
                      </div>
                      <div v-if="ecole.code_postal_de_l_implantation || ecole.localite_de_l_implantation">
                        {{ ecole.code_postal_de_l_implantation }} {{ ecole.localite_de_l_implantation }}
                      </div>
                      <div
                        v-if="ecole.commune_de_l_implantation && ecole.commune_de_l_implantation !== ecole.localite_de_l_implantation"
                        class="text-gray-500"
                      >
                        ({{ ecole.commune_de_l_implantation }})
                      </div>
                    </div>
                  </div>

                  <!-- Etablissement Address (if different from implantation) -->
                  <div
                    v-if="(ecole.adresse_de_l_etablissement || ecole.code_postal_de_l_etablissement) && (ecole.adresse_de_l_etablissement !== ecole.adresse_de_l_implantation || ecole.code_postal_de_l_etablissement !== ecole.code_postal_de_l_implantation)"
                    class="px-4 pb-4 sm:px-6 flex items-start gap-3"
                  >
                    <BuildingOfficeIcon class="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                    <div class="text-sm text-gray-700">
                      <div class="text-xs font-medium text-gray-500 uppercase mb-1">
                        Adresse de l'établissement
                      </div>
                      <div v-if="ecole.adresse_de_l_etablissement">
                        {{ ecole.adresse_de_l_etablissement }}
                      </div>
                      <div v-if="ecole.code_postal_de_l_etablissement || ecole.localite_de_l_etablissement">
                        {{ ecole.code_postal_de_l_etablissement }} {{ ecole.localite_de_l_etablissement }}
                      </div>
                      <div
                        v-if="ecole.commune_de_l_etablissement && ecole.commune_de_l_etablissement !== ecole.localite_de_l_etablissement"
                        class="text-gray-500"
                      >
                        ({{ ecole.commune_de_l_etablissement }})
                      </div>
                    </div>
                  </div>

                  <!-- Info grid -->
                  <div class="px-4 sm:px-6 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                    <div v-if="ecole.commune_de_l_etablissement">
                      <dt class="text-xs font-medium text-gray-500 uppercase">
                        Commune
                      </dt>
                      <dd class="mt-0.5 text-sm text-gray-900">
                        {{ ecole.commune_de_l_etablissement }}
                      </dd>
                    </div>
                    <div v-if="ecole.arrondissement_administratif">
                      <dt class="text-xs font-medium text-gray-500 uppercase">
                        Arrondissement
                      </dt>
                      <dd class="mt-0.5 text-sm text-gray-900">
                        {{ ecole.arrondissement_administratif }}
                      </dd>
                    </div>
                    <div v-if="ecole.bassin">
                      <dt class="text-xs font-medium text-gray-500 uppercase">
                        Bassin
                      </dt>
                      <dd class="mt-0.5 text-sm text-gray-900">
                        {{ ecole.bassin }}
                      </dd>
                    </div>
                    <div v-if="ecole.type_d_enseignement">
                      <dt class="text-xs font-medium text-gray-500 uppercase">
                        Type
                      </dt>
                      <dd class="mt-0.5 text-sm text-gray-900">
                        {{ ecole.type_d_enseignement }}
                      </dd>
                    </div>
                    <div v-if="ecole.niveau">
                      <dt class="text-xs font-medium text-gray-500 uppercase">
                        Niveau
                      </dt>
                      <dd class="mt-0.5 text-sm text-gray-900">
                        {{ ecole.niveau }}
                      </dd>
                    </div>
                    <div v-if="ecole.genre">
                      <dt class="text-xs font-medium text-gray-500 uppercase">
                        Genre
                      </dt>
                      <dd class="mt-0.5 text-sm text-gray-900">
                        {{ ecole.genre }}
                      </dd>
                    </div>
                    <div v-if="ecole.reseau">
                      <dt class="text-xs font-medium text-gray-500 uppercase">
                        Réseau
                      </dt>
                      <dd class="mt-0.5 text-sm text-gray-900">
                        {{ ecole.reseau }}
                      </dd>
                    </div>
                  </div>

                  <!-- Pouvoir Organisateur section -->
                  <div
                    v-if="ecole.nom_du_po"
                    class="px-4 py-4 sm:px-6 border-t border-gray-100"
                  >
                    <div class="text-xs font-medium text-gray-500 uppercase mb-2">
                      Pouvoir organisateur
                    </div>
                    <div class="text-sm text-gray-900 font-medium">
                      {{ ecole.nom_du_po }}
                    </div>
                    <div
                      v-if="ecole.adresse_du_po"
                      class="mt-2 text-sm text-gray-700"
                    >
                      <div>{{ ecole.adresse_du_po }}</div>
                      <div v-if="ecole.code_postal_du_po || ecole.localite_du_po">
                        {{ ecole.code_postal_du_po }} {{ ecole.localite_du_po }}
                      </div>
                      <div
                        v-if="ecole.commune_du_po && ecole.commune_du_po !== ecole.localite_du_po"
                        class="text-gray-500"
                      >
                        ({{ ecole.commune_du_po }})
                      </div>
                    </div>
                    <div
                      v-if="ecole.ndeg_fase_du_po || ecole.numero_bce_du_po"
                      class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500"
                    >
                      <span v-if="ecole.ndeg_fase_du_po">
                        FASE PO <span class="font-mono select-all">{{ ecole.ndeg_fase_du_po }}</span>
                      </span>
                      <a
                        v-if="ecole.numero_bce_du_po"
                        :href="`https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?nummer=${ecole.numero_bce_du_po}&actionLu=Rechercher`"
                        target="_blank"
                        class="hover:text-age hover:underline"
                      >
                        BCE PO <span class="font-mono select-all">{{ ecole.numero_bce_du_po }}</span>
                      </a>
                    </div>
                  </div>

                  <!-- Technical identifiers -->
                  <div class="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
                    <span v-if="ecole.ndeg_fase_de_l_etablissement">
                      FASE etab. <span class="font-mono select-all">{{ ecole.ndeg_fase_de_l_etablissement }}</span>
                    </span>
                    <span v-if="ecole.ndeg_fase_de_l_implantation">
                      FASE impl. <span class="font-mono select-all">{{ ecole.ndeg_fase_de_l_implantation }}</span>
                    </span>
                    <a
                      v-if="ecole.numero_bce_de_l_etablissement"
                      :href="`https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?nummer=${ecole.numero_bce_de_l_etablissement}&actionLu=Rechercher`"
                      target="_blank"
                      class="hover:text-age hover:underline"
                    >
                      BCE <span class="font-mono select-all">{{ ecole.numero_bce_de_l_etablissement }}</span>
                    </a>
                  </div>

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
                      @click="shareLink"
                    >
                      <ShareIcon
                        class="h-5 w-5 mr-2"
                        aria-hidden="true"
                      />
                      {{ linkCopied ? 'Lien copié !' : 'Partager' }}
                    </button>
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
import { BuildingOfficeIcon, MapIcon, MapPinIcon, ShareIcon } from '@heroicons/vue/24/outline';
import { XMarkIcon } from '@heroicons/vue/24/outline';

export default {
  /* eslint-disable vue/no-reserved-component-names */
  components: {
    BuildingOfficeIcon,
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    MapIcon,
    MapPinIcon,
    ShareIcon,
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
  data() {
    return {
      linkCopied: false,
    };
  },
  methods: {
    shareLink() {
      const url = new URL(window.location);
      url.searchParams.set('etablissement', this.ecole.ndeg_fase_de_l_etablissement);
      url.searchParams.set('implantation', this.ecole.ndeg_fase_de_l_implantation);
      navigator.clipboard.writeText(url.toString());
      this.linkCopied = true;
      setTimeout(() => { this.linkCopied = false; }, 2000);
    },
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
