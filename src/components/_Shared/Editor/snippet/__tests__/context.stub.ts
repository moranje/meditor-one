import { format } from 'date-fns'

export default {
  snippetFiles: {
    basic: { value: 'This is an expansion' },
    'with-slots': { value: '$!5. And $!1 $!2 an $!3 as well.' },
    'first-nested': {
      value: 'Tabstop: $1. ${!3:second-nested} Tabstop: $2.',
    },
    'second-nested': { value: '2nd Level: $1. ${!3:third-nested} And $2.' },
    'third-nested': { value: 'Final level: $1.' },
    placeholders: { value: '$1 $2 $3' },
    'nested-choice': { value: '${1|One,Two,Three|}' },
  },
  actions: {
    date(string) {
      if (!string) return format(new Date(), 'dd-MM-yyyy')

      return format(new Date(), string)
    },

    time(string) {
      if (!string) return format(new Date(), 'HH:mm')

      return format(new Date(), string)
    },
  },
}
