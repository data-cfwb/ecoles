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
                        {{ ecole.nom || 'École' }}
                      </h3>
                      <div class="mt-2 flex items-center gap-2">
                        <span
                          v-if="ecole.type"
                          class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                          :class="getEducationTypeClass(ecole.type)"
                        >
                          {{ ecole.type }}
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
                  <!-- Implantation Address + Technical identifiers -->
                  <div
                    v-if="ecole.adr_impl || ecole.cp_impl"
                    class="px-4 py-4 sm:px-6 flex items-start justify-between gap-6"
                  >
                    <div class="text-sm text-gray-700">
                      <div class="text-xs font-medium text-gray-500 uppercase mb-1">
                        Adresse de l'implantation
                      </div>
                      <div v-if="ecole.adr_impl">
                        {{ ecole.adr_impl }}
                      </div>
                      <div v-if="ecole.cp_impl || ecole.loc_impl">
                        {{ ecole.cp_impl }} {{ ecole.loc_impl }}
                      </div>
                      <div
                        v-if="ecole.commune_impl && ecole.commune_impl !== ecole.loc_impl"
                        class="text-gray-500"
                      >
                        ({{ ecole.commune_impl }})
                      </div>
                    </div>
                    <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs shrink-0">
                      <span
                        v-if="ecole.id_etab"
                        class="text-gray-400"
                      >FASE étab.</span>
                      <span
                        v-if="ecole.id_etab"
                        class="font-mono select-all text-gray-500"
                      >{{ ecole.id_etab }}</span>
                      <span
                        v-if="ecole.id_impl"
                        class="text-gray-400"
                      >FASE impl.</span>
                      <span
                        v-if="ecole.id_impl"
                        class="font-mono select-all text-gray-500"
                      >{{ ecole.id_impl }}</span>
                      <span
                        v-if="ecole.bce_etab"
                        class="text-gray-400"
                      >BCE</span>
                      <a
                        v-if="ecole.bce_etab"
                        :href="`https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?nummer=${ecole.bce_etab}&actionLu=Rechercher`"
                        target="_blank"
                        class="font-mono select-all text-blue-600 hover:underline"
                      >{{ ecole.bce_etab }} ↗</a>
                    </div>
                  </div>

                  <!-- Etablissement Address (if different from implantation) -->
                  <div
                    v-if="(ecole.adr_etab || ecole.cp_etab) && (ecole.adr_etab !== ecole.adr_impl || ecole.cp_etab !== ecole.cp_impl)"
                    class="px-4 pb-4 sm:px-6"
                  >
                    <div class="text-sm text-gray-700">
                      <div class="text-xs font-medium text-gray-500 uppercase mb-1">
                        Adresse de l'établissement
                      </div>
                      <div v-if="ecole.adr_etab">
                        {{ ecole.adr_etab }}
                      </div>
                      <div v-if="ecole.cp_etab || ecole.loc_etab">
                        {{ ecole.cp_etab }} {{ ecole.loc_etab }}
                      </div>
                      <div
                        v-if="ecole.commune_etab && ecole.commune_etab !== ecole.loc_etab"
                        class="text-gray-500"
                      >
                        ({{ ecole.commune_etab }})
                      </div>
                    </div>
                  </div>

                  <!-- Info grid -->
                  <div class="px-4 sm:px-6 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                    <div v-if="ecole.commune_etab">
                      <dt class="text-xs font-medium text-gray-500 uppercase">
                        Commune
                      </dt>
                      <dd class="mt-0.5 text-sm text-gray-900">
                        {{ ecole.commune_etab }}
                      </dd>
                    </div>
                    <div v-if="ecole.arr">
                      <dt class="text-xs font-medium text-gray-500 uppercase">
                        Arrondissement
                      </dt>
                      <dd class="mt-0.5 text-sm">
                        <button
                          class="text-gray-900 hover:text-age hover:underline text-left"
                          @click="$emit('filter', 'arr', ecole.arr)"
                        >
                          {{ ecole.arr }}
                        </button>
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
                    <div v-if="ecole.type">
                      <dt class="text-xs font-medium text-gray-500 uppercase">
                        Type
                      </dt>
                      <dd class="mt-0.5 text-sm">
                        <button
                          class="text-gray-900 hover:text-age hover:underline text-left"
                          @click="$emit('filter', 'type', ecole.type)"
                        >
                          {{ ecole.type }}
                        </button>
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
                      <dd class="mt-0.5 text-sm">
                        <button
                          class="text-gray-900 hover:text-age hover:underline text-left"
                          @click="$emit('filter', 'reseau', ecole.reseau)"
                        >
                          {{ ecole.reseau }}
                        </button>
                      </dd>
                    </div>
                  </div>

                  <!-- Pouvoir Organisateur section -->
                  <div
                    v-if="ecole.nom_po"
                    class="px-4 py-4 sm:px-6 border-t border-gray-100"
                  >
                    <div class="text-xs font-medium text-gray-500 uppercase mb-2">
                      Pouvoir organisateur
                    </div>
                    <div class="text-sm text-gray-900 font-medium">
                      {{ ecole.nom_po }}
                    </div>
                    <div
                      v-if="ecole.adr_po"
                      class="mt-2 text-sm text-gray-700"
                    >
                      <div>{{ ecole.adr_po }}</div>
                      <div v-if="ecole.cp_po || ecole.loc_po">
                        {{ ecole.cp_po }} {{ ecole.loc_po }}
                      </div>
                      <div
                        v-if="ecole.commune_po && ecole.commune_po !== ecole.loc_po"
                        class="text-gray-500"
                      >
                        ({{ ecole.commune_po }})
                      </div>
                    </div>
                    <div
                      v-if="ecole.id_po || ecole.bce_po"
                      class="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs max-w-xs"
                    >
                      <span
                        v-if="ecole.id_po"
                        class="text-gray-500"
                      >FASE</span>
                      <span
                        v-if="ecole.id_po"
                        class="font-mono select-all text-gray-700"
                      >{{ ecole.id_po }}</span>
                      <span
                        v-if="ecole.bce_po"
                        class="text-gray-500"
                      >BCE</span>
                      <a
                        v-if="ecole.bce_po"
                        :href="`https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?nummer=${ecole.bce_po}&actionLu=Rechercher`"
                        target="_blank"
                        class="font-mono select-all text-blue-600 hover:underline"
                      >{{ ecole.bce_po }} ↗</a>
                    </div>
                  </div>

                  <!-- Action buttons -->
                  <div class="px-4 py-4 sm:px-6 bg-gray-50 flex gap-3">
                    <a
                      v-if="ecole.lat && ecole.lng"
                      type="button"
                      class="inline-flex items-center rounded-md bg-age px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                      :href="`https://www.google.be/maps/dir/?api=1&destination=${ecole.lat},${ecole.lng}`"
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
import { MapIcon, ShareIcon, XMarkIcon } from '@heroicons/vue/24/outline';

export default {
  /* eslint-disable vue/no-reserved-component-names */
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    MapIcon,
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
  emits: ['close', 'filter'],
  data() {
    return {
      linkCopied: false,
    };
  },
  methods: {
    shareLink() {
      const url = new URL(window.location);
      url.searchParams.set('etablissement', this.ecole.id_etab);
      url.searchParams.set('implantation', this.ecole.id_impl);
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
