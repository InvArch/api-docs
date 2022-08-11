import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {BeforeEnterObserver, RouterLocation} from '@vaadin/router';

import {DatabaseController} from './db.ctrl';
import {apiCursor, Api} from './db';
import {listPallets} from './polka/pallet';

import './component/navigation';
import './component/header';

@customElement('app-root')
export class App extends LitElement implements BeforeEnterObserver {
  private db = new DatabaseController<Api>(this, apiCursor, this.localName);

  @property({attribute: false})
  params = null;

  @property({attribute: false})
  data = {pallets: [], loaded: false};

  static styles = css`
    header {
      height: var(--toolbar-height);
      margin-left: var(--drawer-width);
    }

    main {
      margin-left: var(--drawer-width);
    }
  `;

  async onBeforeEnter(location: RouterLocation) {
    this.params = location.params;
  }

  async updated() {
    if (this.db.state && !this.data.loaded) {
      const metadata = this.db.state.metadata;
      const pallets = listPallets(metadata);

      this.data = {
        pallets: pallets,
        loaded: true,
      };
    }
  }

  render() {
    return html`
      ${when(
        this.db.state,
        () => html`
          <header>
            <ui-header
              .params=${this.params}
            ></ui-header>
          </header>
          <nav>
            <ui-navigation
              .params=${this.params}
              .pallets=${this.data.pallets}
              .chain=${this.db.state.apiState.systemName}
              .version=${this.db.state.apiState.specName +
              '/' +
              this.db.state.apiState.specVersion}
            ></ui-navigation>
          </nav>
          <main>
            <slot></slot>
          </main>
          <footer></footer>
        `,
        () => html`Loading metadata...`
      )}
    `;
  }
}
