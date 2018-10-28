export default {
  unless(...args) {
    let variable, pattern, replacement;
    if (args.length === 2) [variable, replacement] = args;
    if (args.length === 3) [variable, pattern, replacement] = args;

    if (!pattern) {
      // \u200B (zero-width soace) is a hack because if else blocks don't allow
      // empty strings
      return `\${${variable}/(^.+$)|(^.*?$)/\${1:?\u200B:${replacement}}/}`;
    }

    let regex = new RegExp(pattern);

    return `\${${variable}/(?:(.*${
      regex.source
    }.*))|(^.*?$)/\${1:?\u200B:${replacement}}/}`;
  },

  if(...args) {
    let variable, pattern, replacement;
    if (args.length === 2) [variable, replacement] = args;
    if (args.length === 3) [variable, pattern, replacement] = args;

    if (!pattern) {
      return `\${${variable}/(^.+$)/\${1:+${replacement}}/i}`;
    }

    let regex = new RegExp(pattern);

    return `\${${variable}/(?:(.*${
      regex.source
    }.*))|(^.*?$)/\${1:+${replacement}}/i}`;
  },

  date() {
    return `$CURRENT_DATE-$CURRENT_MONTH-$CURRENT_YEAR`;
  },

  dateReversed() {
    return `$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE`;
  },

  time() {
    return `$CURRENT_HOUR:$CURRENT_MINUTE`;
  },

  timeLong() {
    return `$CURRENT_HOUR:$CURRENT_MINUTE:$CURRENT_SECOND`;
  },

  lowerCase(tabstopIndex) {
    return `\${${tabstopIndex}/(.*)/\${1:/downcase}/}`;
  },

  upperCase(tabstopIndex) {
    return `\${${tabstopIndex}/(.*)/\${1:/upcase}/}`;
  },

  capitalCase(tabstopIndex) {
    return `\${${tabstopIndex}/(.*)/\${1:/capitalize}/}`;
  }
};
