import { Model } from '@vuex-orm/core';

export default class Editor extends Model {
  instance: any;
  id: string;
  viewport: any;
  navbar: any;
  sidenav: any;
  filelist: any;

  static entity = 'editor';

  static primaryKey = 'id';

  static fields(): any {
    return {
      id: this.string(''),
      instance: this.attr(null),
      viewport: this.attr(null),
      navbar: this.attr(null),
      sidenav: this.attr(null),
      filelist: this.attr(null)
    };
  }

  get height() {
    const FOOTER = 56;

    return this.viewport.height - (this.navbar.height + FOOTER);
  }

  get width() {
    const DIVIDER = 1;
    let filelist = 0;
    let sidenav = 0;

    if (this.sidenav && this.sidenav.width) {
      sidenav = this.sidenav.width;
    }

    if (this.filelist && this.filelist.width) {
      filelist = this.filelist.width + DIVIDER;
    }

    return this.viewport.width - (sidenav + filelist + DIVIDER);
  }
}
