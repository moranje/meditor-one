import User from '@/store/models/User'

export default {
  computed: {
    $user () {
      return User.query().first()
    }
  }
}
