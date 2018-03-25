export function find(reference, { key, value }) {
  return reference.orderByChild(key).equalTo(value);
}

// export function findMany(reference, ids = []) {
// return reference.orderByChild(key).equalTo(value);
// }

export function findAll(reference, { key, value }) {
  return reference.orderByChild(key).equalTo(value);
}

export function create(reference, values, updateRelationship) {
  const local = reference.push();
  const root = reference.getRoot();

  // Create child
  local.set(values);

  // Create reference to child in parent and vice-versa
  root.update(updateRelationship(local.key));

  return local;
}

export function update(reference, { id, key, value }) {
  return reference.child(id).update({ [key]: value });
}

export function remove(reference, id, parent) {
  reference.update({ [`folders/${parent}`]: null });

  return reference.child(id).remove();
}
