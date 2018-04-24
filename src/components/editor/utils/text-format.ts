function lines(text: string, fn) {
  let match = /^[\s\S]*?$/gm;
  let line = match.exec(text);
  while (line !== null) {
    fn(line[0]);

    line = match.exec(text);
  }
}

function collectMatches(text: string, match: RegExp, store: any[]) {
  lines(text, line => {
    if (match.test(line)) {
      const [full, ...matches] = match.exec(line);

      // Remove falsy entries
      let filtered = matches.filter(x => x);

      store.push(filtered);
    }
  });
}

function sortByName(first, second) {
  var firstName = first.name.toLowerCase();
  var secondName = second.name.toLowerCase();

  if (firstName < secondName) {
    return -1;
  }

  if (firstName > secondName) {
    return 1;
  }

  // Names are the same
  return 0;
}

function capitalizeFirst(string: string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

export function medication(text: string) {
  // const medicationGeneral = /^(?:t )?(?<name>.*?)(?: \(.*?\) | [a-z]*(?:caps|creme|drnk|inf|pdr|inh|inj|susp|tabl|vlst)[a-z]* | dragee | fl | kauw[a-z]* | klysma | nevel | pleister | poeder | respimat | siroop | spray | verneveloplossing | zetpil ).*?(?<frequency>(?:\d ?x(?: per)?[ /]?(?:(?:dag)|(?:week)))|(?:vlgs\.? voorschrift)) (?<dose>\d+[,.]?(?:\d+)?( tot \d+)? (?:dosis|internat.eenh|milligram|milliliter|mg|stuk))/gi;
  const medicationGeneral = /^(?:t )?(.*?)(?: \(.*?\) | [a-z]*(?:caps|creme|drnk|inf|pdr|inh|inj|susp|tabl|vlst)[a-z]* | dragee | fl | kauw[a-z]* | klysma | nevel | pleister | poeder | respimat | siroop | spray | verneveloplossing | zetpil ).*?((?:\d ?x(?: per)?[ /]?(?:(?:dag)|(?:week)))|(?:vlgs\.? voorschrift)) (\d+[,.]?(?:\d+)?( tot \d+)? (?:dosis|internat.eenh|milligram|milliliter|mg|stuk))/i;
  const medFormatted = /^(.*?) (?:(?:(\d+.*?(?:ug|mg|g|ie)) (\d+ *(?:dd)[02-9]?)1?)|(?:(\d+ *(?:dd)[02-9]?)1? (\d+.*?(?:ug|mg|g|ie))))/i;

  let list = [];
  let temp = [];
  let output = '';

  collectMatches(text, medicationGeneral, temp);
  collectMatches(text, medFormatted, temp);

  // Normalize medication name
  temp.forEach(item => {
    let [name, frequency, dose] = item;

    name = capitalizeFirst(name.toLowerCase());

    list.push({ name, frequency, dose });
  });

  // Order names alphabetically
  list.sort(sortByName);

  list.forEach(item => {
    let { name, frequency, dose } = item;

    output += `${name} ${dose} ${frequency}\n`;
  });

  return output;
}

export function history(text: string) {}
