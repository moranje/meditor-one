<template>
  <v-layout
    row
    justify-center
  >
    <v-dialog
      v-model="dialog"
      max-width="300"
      lazy
    >
      <v-card>
        <v-card-title class="headline">{{ headline }}</v-card-title>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="accent"
            flat="flat"
            @click.native="cancelAction"
          >{{ cancelText }}</v-btn>

          <v-btn
            color="accent"
            flat="flat"
            @click.native="confirmAction"
          >{{ confirmText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'M1Modal',

  props: {
    headline: {
      type: String,
      default: 'Weet je het zeker?'
    },
    confirmText: {
      type: String,
      default: 'Ja.'
    },
    cancelText: {
      type: String,
      default: 'Uh nee'
    },
    confirm: {
      type: Function,
      default: () => ({})
    },
    cancel: {
      type: Function,
      default: () => ({})
    }
  },

  data() {
    return {
      dialog: false
    };
  },

  methods: {
    open(options) {
      Object.assign(this, options);

      this.dialog = true;
    },

    conirmAction(...args) {
      this.dialog = false;

      this.confirm(args);
    },

    cancelAction(...args) {
      this.dialog = false;

      this.cancel(args);
    }
  }
};
</script>
