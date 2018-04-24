import { Text } from '.';

export default class Anchor extends Text {
  constructor(text, type) {
    super(text.replace('=', ''), type);
  }
}
