<template lang="html">
  <VLayout fill-height align-center justify-center>
    <VFlex xs12 sm8 md4>
      <VCard class="elevation-12">
        <VToolbar dark color="primary">
          <VToolbarTitle>Account</VToolbarTitle>
        </VToolbar>
        <VCardText v-show="!$user">
          <VLayout align-center>
            <VFlex xs12 text-xs-center>
              <VBtn
                @click="loginWithPopup"
                outline
                color="primary"
                class="text-xs-center"
              >
                <VIcon>mdi-google</VIcon>
                &nbsp;Log in
              </VBtn>
            </VFlex>
          </VLayout>

          <br />
          <VDivider />
          <br />

          <VForm>
            <VTextField
              prepend-icon="mdi-account-outline"
              name="login"
              label="Login"
              type="text"
              autocomplete="email"
            />
            <VTextField
              id="password"
              prepend-icon="mdi-lock-outline"
              name="password"
              label="Password"
              type="password"
              autocomplete="current-password"
            />
          </VForm>
        </VCardText>

        <VCardText v-show="$user" class="text-xs-center">
          Momenteel ben je ingelogd.
        </VCardText>

        <VCardActions v-show="!$user">
          <VSpacer />
          <VBtn @click="loginWithEmailAndPassword" color="primary">
            Log in
          </VBtn>
        </VCardActions>

        <VCardActions v-show="$user">
          <VLayout align-center>
            <VFlex xs12 text-xs-center>
              <VBtn @click="logout" color="primary">
                Log uit
              </VBtn>
            </VFlex>
          </VLayout>
        </VCardActions>
      </VCard>
    </VFlex>
  </VLayout>
</template>

<script lang="js">
import { firebase } from '@/plugins/firebase'
import User from '@/store/models/User'
import File from '@/store/models/File'
import Folder from '@/store/models/Folder'

export default {
  name: 'Login',

  metaInfo: {
    title: 'Log in',
  },

  props: [],

  data () {
    return {

    }
  },

  computed: {

  },

  mounted () {},

  methods: {
    loginWithPopup () {
      const provider = new firebase.auth.GoogleAuthProvider()

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(({ user }) => {
          // For some reason the user property has additional properties
          // that cause an infinite loop
          User.create({ data: user })
        })
        .catch((error) => {
          throw error
        })
    },

    loginWithEmailAndPassword () {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(({ user }) => {
          // For some reason the user property has additional properties
          // that cause an infinite loop
          // const { displayName, email, uid } = result.user;
          User.create({ data: user })
          // this.$store.commit('signIn', { displayName, email, uid });
        })
        .catch((error) => {
          throw error
          // ...
        })
    },

    logout () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          User.deleteAll()
          // This is able to delete all records appearently
          // File.deleteAll();
          // Folder.deleteAll();
        })
        .catch((error) => {
          // An error happened.
          throw error
        })
    },
  },
}
</script>

<style scoped lang="scss">
.login {
}
</style>
