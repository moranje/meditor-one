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

    return `\${${variable}/(${
      regex.source
    })|(^.*?$)/\${1:?\u200B:${replacement}}/}`;
  },

  if(...args) {
    let variable, pattern, replacement;
    if (args.length === 2) [variable, replacement] = args;
    if (args.length === 3) [variable, pattern, replacement] = args;

    if (!pattern) {
      return `\${${variable}/(^.+$)/\${1:+${replacement}}/}`;
    }

    let regex = new RegExp(pattern);

    return `\${${variable}/(${regex.source})|(^.*?$)/\${1:+${replacement}}/}`;
  },

  date() {
    let date = new Date();
    let day = `${date.getDate()}`.padStart(2, '0');
    let month = `${date.getMonth() + 1}`.padStart(2, '0');
    let year = date.getFullYear();

    return `${day}-${month}-${year}`;
  },

  dateReversed() {
    let date = new Date();
    let day = `${date.getDate()}`.padStart(2, '0');
    let month = `${date.getMonth() + 1}`.padStart(2, '0');
    let year = date.getFullYear();

    return `${year}-${month}-${day}`;
  },

  time() {
    let date = new Date();
    let hours = `${date.getHours()}`.padStart(2, '0');
    let minutes = `${date.getMinutes()}`.padStart(2, '0');

    return `${hours}:${minutes}`;
  },

  timeLong() {
    let date = new Date();
    let hours = `${date.getHours()}`.padStart(2, '0');
    let minutes = `${date.getMinutes()}`.padStart(2, '0');
    let seconds = `${date.getSeconds()}`.padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }
};
