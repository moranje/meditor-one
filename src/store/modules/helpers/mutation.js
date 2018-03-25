export function create(records = [], values = {}) {
  records.push(values);
}

export function update(records = [], id, key, value) {
  records.forEach(record => {
    if (
      (record['.key'] === id || record.id === id) &&
      record[key] !== undefined
    ) {
      record = Object.assign(record, { [key]: value });
    }
  });
}

export function remove(records = [], id) {
  const index = records.findIndex(record => record['.key'] === id);

  if (index !== -1) {
    records.splice(index, 1);
  }
}
