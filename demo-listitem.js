const template = document.createElement('template');
template.innerHTML = `
<div>
  <button tabindex="-1" class="move-up">↑</button>
  <input tabindex="-1">
</div>
`;

let idGen = 0;

class DemoListitem extends HTMLElement {
    static observedAttributes = ['tabindex'];

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));

        const value = this.getAttribute('value');

        this.role = 'listitem';
        this.tabIndex = -1;
        this.ariaLabel = value;
        this.id = `item-${idGen++}`;

        this.input = shadowRoot.querySelector('input');
        this.input.id = `${this.id}-input`;
        this.input.value = value;
        this.input.addEventListener('input', () => {
            this.ariaLabel = this.input.value;
        });
        this.input.addEventListener('keydown', (event) => {
            event.stopPropagation();
        });

        this.moveUp = shadowRoot.querySelector('.move-up');
        this.moveUp.id = `${this.id}-moveup`;
        this.moveUp.ariaLabel = 'Move up';
        this.moveUp.setAttribute(
            'aria-labelledby',
            `${this.moveUp.id} ${this.input.id}`,
        );
        this.moveUp.onclick = () => {
            this.dispatchEvent(
                new CustomEvent('demo-move-up', { bubbles: true }),
            );
        };
    }

    attributeChangedCallback() {
        if (this.tabIndex === 0) {
            this.input.tabIndex = 0;
            this.moveUp.tabIndex = 0;
        } else {
            this.input.tabIndex = -1;
            this.moveUp.tabIndex = -1;
        }
    }
}

customElements.define('demo-listitem', DemoListitem);
