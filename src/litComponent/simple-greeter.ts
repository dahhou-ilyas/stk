import React from "react"
import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {createComponent} from '@lit/react';


@customElement('demo-greeting')
class DemoGreetingw extends LitElement {
  static styles = css`
    p {
      display: inline-block;
      background: red;
      padding: 0 1em;
    }
  `;

  @property({ type: String })
  name = 'Somebodyssss';
  

  render() {
    return html`<p class="ilyas">Hellosss, ${this.name}!</p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-greeting': DemoGreetingw;
  }
}

if (!customElements.get('demo-greeting')) {
  customElements.define('demo-greeting', DemoGreetingw);
}


export const DemoGreeting = createComponent({
  react: React,
  tagName: 'demo-greeting',
  elementClass: DemoGreetingw,
});