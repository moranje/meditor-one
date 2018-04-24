import { Tabstop } from '.';
import LinkedList from '@/components/editor/linked-list';

export default class TabstopList extends LinkedList {
  private _lastTabstop: number = 0;

  get lastTabstop() {
    return this._lastTabstop;
  }

  set lastTabstop(number: number) {
    this._lastTabstop = number;
  }

  getSiblingIndex(tabstop: Tabstop) {
    let index = -1;

    this.forEach(($tabstop: Tabstop, $index) => {
      if (tabstop.comparator === $tabstop.comparator) {
        index = $index;
      }
    });

    return index;
  }

  getInsertionIndex(tabstop: Tabstop): number {
    let index = 0;

    this.forEachReverse(($tabstop: Tabstop, $index) => {
      if (tabstop.comparator > $tabstop.comparator && index === 0) {
        index = $index + 1;
      }
    });

    return index;
  }

  addTabstop(tabstop: Tabstop) {
    let insertionIndex = this.getInsertionIndex(tabstop);
    let siblingIndex = this.getSiblingIndex(tabstop);

    if (siblingIndex !== -1) {
      let node = this.getNode(siblingIndex);
      tabstop.node = node;

      node.siblings = [tabstop];
    } else if (this.length === insertionIndex) {
      this.push(tabstop);

      tabstop.node = this.getNode(insertionIndex);
    } else {
      this.splice(insertionIndex, 0, tabstop);

      tabstop.node = this.getNode(insertionIndex);
    }

    if (this.length - 1 > this.lastTabstop) {
      this.lastTabstop = this.length - 1;
    }
  }

  updateNodeReferences() {
    this.forEach((tabstop, i) => {
      tabstop.node = this.getNode(i);
    });
  }

  updateTabstopComparators(threshold: number, by: number) {
    this.forEach(tabstop => {
      if (tabstop.comparator >= threshold) {
        tabstop.comparator += by;
      }
    });
  }

  setTabstopGroup(group: number) {
    this.forEach(tabstop => {
      tabstop.group = group;
    });
  }

  serialize() {
    let serialized = '';

    this.forEach((element, index) => {
      serialized += `${element.serialize()} `;

      let node = this.getNode(index);
      if (node.siblings) {
        node.siblings.forEach(tabstop => {
          serialized += `${tabstop.serialize()} `;
        });
      }
    });

    return serialized.trim();
  }
}
