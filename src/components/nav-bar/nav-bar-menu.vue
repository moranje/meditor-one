<template>
  <v-menu
    v-if="user !== null"
    offset-y
    left
  >
    <v-btn
      slot="activator"
      icon
      dark
    >
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
    <v-list>
      <v-subheader>Account</v-subheader>
      <v-divider/>
      <v-list-tile @click="logout">
        <v-list-tile-action>
          <v-icon color="primary">mdi-logout</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Log out</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
  <v-menu
    v-else
    offset-y
    left
  >
    <v-btn
      slot="activator"
      icon
      dark
    >
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
    <v-list>
      <v-subheader>Account</v-subheader>
      <v-divider/>
      <v-list-tile @click="login">
        <v-list-tile-action>
          <v-icon color="blue darken-3">mdi-google</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Login</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import firebase from 'firebase';

export default {
  computed: {
    user() {
      return this.$store.getters.getUser;
    }
  },

  methods: {
    login() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // For some reason the user property has additional properties
          // that cause an infinite loop
          const { displayName, email, uid } = result.user;
          this.$store.commit('signIn', { displayName, email, uid });
        })
        .catch(error => {
          console.error(error.code, error.message, error);
        });
    },

    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => this.$store.commit('signOut'))
        .catch(error => {
          // An error happened.
          console.error(error);
        });
    }
  }
};
</script>
