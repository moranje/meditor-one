import { sortedUniq } from 'lodash';

function lines(text: string, fn) {
  text.split('\n').forEach(line => {
    fn(line);
  });
}

function sortBy(first, second) {
  var firstName = first.name
    ? first.name.toLowerCase()
    : first.toString().toLowerCase();
  var secondName = second.name
    ? second.name.toLowerCase()
    : second.toString().toLowerCase();

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
  if (!string) return '';

  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

class Hix {
  name: string;
  frequency: Frequency;
  dose: Dose;
  start: Date | null;
  stop: Date | null;
  administrationRoute: string;
  constructor(line: string) {
    this.parse(line);
  }

  get isValid() {
    if (this.name && this.frequency.isValid) {
      return true;
    }

    return false;
  }
  parse(line: string) {
    const [
      unknown,
      ownMedication,
      genericName,
      doseAndFrequency,
      administration,
      unknown2,
      brandName,
      startDate,
      startTime,
      endDate
    ] = line
      .split('Thuismedicatie\tActief\t')
      .pop()
      .split('\t');

    if (
      !genericName ||
      !doseAndFrequency ||
      !startDate ||
      endDate === 'T.N.O. gestopt'
    ) {
      return;
    }

    let stop = new Date(
      endDate
        .split('-')
        .reverse()
        .join('-')
    );
    if (endDate.replace(/ |-/, '') && !Number.isNaN(stop.getTime())) {
      // Current date is past stop date
      if (Date.now() > stop.getTime()) return;

      this.stop = stop;
    }

    this.name = capitalizeFirst(
      genericName
        .toLowerCase()
        .replace(/^t\s/i, '')
        .split(
          /([a-z]*(?:caps|creme|drnk|inf|pdr|inh|inj|susp|tabl|vlst)[a-z]*| aerosol| dragee| fl| kauw[a-z]*| klysma| nevel| pleister| poeder| respimat| siroop| spray| verneveloplossing| zetpil)/i
        )
        .shift()
        .trim()
    );
    this.frequency = new Frequency(doseAndFrequency.trim());
    this.dose = new Dose(doseAndFrequency.trim());
    this.administrationRoute = administration.toLowerCase();
    this.start = new Date(
      startDate
        .split(/\s\(.*?\)/)
        .shift()
        .split('-')
        .reverse()
        .join('-')
    );
  }

  toString() {
    return new Medication(this).toString();
  }
}

class Generic {
  name: string;
  frequency: Frequency;
  dose: Dose;
  constructor(line: string) {
    this.frequency = new Frequency(line);
    this.dose = new Dose(line);

    this.parse(line);
  }

  get isValid() {
    if (this.name && this.frequency.isValid) {
      return true;
    }

    return false;
  }

  parse(line: string) {
    let text = line
      .split(`${this.frequency._frequency}`)
      .shift()
      .split(`${this.dose._value}`)
      .shift();

    if (text) {
      this.name = capitalizeFirst(
        text
          .toLowerCase()
          .replace(/^t\s/i, '')
          .split(
            /([a-z]*(?:caps|creme|drnk|inf|pdr|inh|inj|susp|tabl|vlst)[a-z]*| aerosol| dragee| fl| kauw[a-z]*| klysma| nevel| pleister| poeder| respimat| siroop| spray| verneveloplossing| zetpil)/i
          )
          .shift()
          .trim()
      );
    }
  }

  toString() {
    return new Medication(this).toString();
  }
}

class Frequency {
  _frequency: string;
  _frequencyExtra: string = '';
  _recurrence: string;
  _variable: string;
  constructor(line: string) {
    this.parse(line);
  }

  get isValid() {
    if ((this.frequency && this.recurrence) || this.variable) {
      return true;
    }

    return false;
  }

  get frequency() {
    return this._frequency;
  }

  set frequency(frequency: string) {
    if (typeof frequency === 'string') {
      this._frequency = frequency;
    }
  }

  get frequencyExtra() {
    if (this._frequencyExtra) return `${this._frequencyExtra} `;

    return this._frequencyExtra;
  }

  set frequencyExtra(frequencyExtra: string) {
    if (typeof frequencyExtra === 'string') {
      this._frequencyExtra = frequencyExtra;
    }
  }

  get recurrence() {
    return this._recurrence;
  }

  set recurrence(recurrence: string) {
    if (typeof recurrence === 'string') {
      this._recurrence = recurrence.replace('dd', 'dag');
    }
  }

  get variable() {
    return this._variable;
  }

  set variable(variable: string) {
    if (typeof variable === 'string') {
      this._variable = variable.replace('vlgs.', 'volgens');
    }
  }

  parse(line: string) {
    let full, frequency, frequencyExtra, recurrence;
    let match = /(\d+)\s?(?:x|keer)?(?:\sper)?[\s/]?(\d+)?\s?((?:dd|dag|we?ek|maand)(?:en)?)/i.exec(
      line
    );
    let variable = /vlgs\. voorschrift/i.exec(line);
    if (match) {
      [full, frequency, frequencyExtra, recurrence] = match;
    }

    if (frequency !== undefined || !Number.isNaN(+frequency)) {
      this.frequency = frequency;
    }

    if (frequencyExtra !== undefined || !Number.isNaN(+frequencyExtra)) {
      this.frequencyExtra = frequencyExtra;
    }

    if (recurrence && recurrence !== 'vlgs. voorschrift') {
      this.recurrence = recurrence;
    }

    if (variable) {
      this.variable = variable[0];
    }
  }

  toString() {
    if (this.variable && !this.frequency && !this.recurrence) {
      return `${this.variable}`;
    }

    if (this.variable && this.frequency && this.recurrence) {
      return `${this.variable} ${this.frequency} keer per ${
        this.frequencyExtra
      }${this.recurrence}`;
    }

    return `${this.frequency} keer per ${this.frequencyExtra}${
      this.recurrence
    }`;
  }
}

class Dose {
  _value: string;
  _unit: string;
  private _isVariable: boolean = false;
  constructor(line: string) {
    this.parse(line);
  }

  get isValid() {
    if (this.value && this.unit) {
      return true;
    }

    return false;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  get unit() {
    return this._unit;
  }

  set unit(unit) {
    this._unit = unit
      .replace('internat.eenh', 'ie')
      .replace('microgram', 'ug')
      .replace('mcg', 'ug')
      .replace('milligram', 'mg')
      .replace('gram', 'g')
      .replace('milliliter', 'ml')
      .replace('liter', 'l')
      .replace('uur', 'u');
  }

  parse(line: string) {
    const pattern = /((?:\d+(?:[.,]\d+)?\/)?(?:\d+(?:[,.]\d+)?(?: (?:tot|a) \d+)?\s?))((?:dosis|internat.eenh|microgram|milligram|gram|milliliter|liter|ug|mcg|mg|g|ml|l|uur|u|ie|stuk)(?:\/(?:\d+(?:[.,]\d+)?)?(?:dosis|internat.eenh|microgram|milligram|gram|milliliter|liter|ug|mcg|mg|g|ml|l|u|uur|ie|stuk))?)/gi;
    let match = pattern.exec(line);

    if (line.search(/.*?vo?lge?n?s\.? voorschrift.*/) !== -1) {
      this._isVariable = true;
    } else if (match !== null) {
      this.value = match[1].trim();
      this.unit = match[2].trim();
    }
  }

  toString() {
    if (!this.isValid) return '';
    if (this._isVariable) return '';

    return `${this.value}${this.unit}`;
  }
}

class Medication {
  name: string;
  frequency: string;
  dose: string;
  administrationRoute: string;
  stop: Date;
  constructor(options: any) {
    Object.assign(this, options);
  }

  toString() {
    let medication = `${this.name} ${this.frequency}`;

    if (this.dose) medication += ` ${this.dose}`;
    // if (this.dose) medication += ` ${this.dose}`.trimRight();

    if (
      this.administrationRoute &&
      this.administrationRoute.search(/iv|im/) !== -1
    ) {
      medication += ` ${this.administrationRoute}`;
    }

    if (this.stop) {
      medication += ` tot ${this.stop.getDate()}-${this.stop.getMonth() +
        1}-${this.stop.getFullYear()}`;
    }

    return medication;
  }
}

class History {
  private _day: string;
  private _month: string;
  private _year: string;
  line: string;
  constructor(line: string) {
    this.line = line;
    this.parse(line);
  }

  parse(line: string) {
    const pattern = /^(0[1-9]|[12]\d|3[01])?[-/]?((?:1[0-2])|(?:0?[1-9]))?[-/]?((?:19|20)\d{2})[-/]?((?:1[0-2])|(?:0?[1-9]))?[-/]?(0[1-9]|[12]\d|3[01])?/;
    let fullmatch, _day, _month, year, $month, $day;
    const matches = pattern.exec(line);
    if (matches) [fullmatch, _day, _month, year, $month, $day] = matches;

    this._day = _day || $day || '';
    this._month = _month || $month || '';
    this._year = year;
  }

  toString() {
    let stripped = this.line;

    // Remove date parts
    stripped = capitalizeFirst(stripped.replace(/^[:/ \-0-9]+/, ''));

    if (this._day && this._month && this._year) {
      // @ts-ignore eslint-disable-next-line
      return `${this._year}-${this._month.padStart(
        2,
        '0'
        // @ts-ignore eslint-disable-next-line
      )}-${this._day.padStart(2, '0')}: ${stripped}`;
    } else if (!this._day && this._month && this._year) {
      // @ts-ignore eslint-disable-next-line
      return `${this._year}-${this._month.padStart(2, '0')}: ${stripped}`;
    } else if (this._day && !this._month && this._year) {
      // The day variable holds the month value instead
      // @ts-ignore eslint-disable-next-line
      return `${this._year}-${this._day.padStart(2, '0')}: ${stripped}`;
    } else if (!this._day && !this._month && this._year) {
      return `${this._year}: ${stripped}`;
    } else {
      return this.line;
    }
  }
}

export function medication(text: string) {
  let list = [];

  lines(text, line => {
    let generic = new Generic(line);

    if (generic.isValid) {
      list.push(generic);
    }
  });

  // Order names alphabetically
  list.sort(sortBy);

  return list.join('\n');
}

export function medicationHix(text: string) {
  let list = [];

  lines(text, line => {
    let advanced = new Hix(line);

    if (advanced.isValid) {
      list.push(advanced);
    }
  });

  // Order names alphabetically
  list.sort(sortBy);

  return list.join('\n');
}

export function history(text: string) {
  let list = [];

  lines(text, line => {
    if (line) {
      list.push(new History(line));
    }
  });

  // Order names alphabetically
  list.sort(sortBy);

  return sortedUniq(list).join('\n');
}
