let idGen = 0;

class DemoList extends HTMLElement {
    constructor() {
        super();

        this.role = 'list';
        this.tabIndex = 0;
        this.listItems = [];

        this.addEventListener('demo-move-up', ({ target }) => {
            this.moveUp(target);
        });

        this.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowDown':
                    this.focusItem(true);
                    break;
                case 'ArrowUp':
                    this.focusItem(false);
                    break;
            }
        });
    }

    focusItem(next) {
        const focusedItem = this.ownerDocument.activeElement;
        const index = this.listItems.indexOf(focusedItem);

        let newItem;

        if (index < 0) {
            newItem = this.listItems[0];
        } else if (next && index < this.listItems.length - 1) {
            newItem = this.listItems[index + 1];
        } else if (!next && index > 0) {
            newItem = this.listItems[index - 1];
        }

        if (newItem) {
            if (this.contains(focusedItem)) {
                focusedItem.tabIndex = -1;
            }

            newItem.tabIndex = 0;
            newItem.focus();
        }
    }

    moveUp(target) {
        const index = this.listItems.indexOf(target);

        if (index <= 0) {
            return;
        }

        const prevItem = this.listItems[index - 1];
        this.listItems[index - 1] = target;
        this.listItems[index] = prevItem;
        this.updateOrdering();
    }

    updateOrdering() {
        this.listItems.forEach((child, i) => {
            child.style.order = i;
        });

        const ariaOwns = this.listItems
            .map((child) => child.id ?? '')
            .filter((id) => id)
            .join(' ');
        this.setAttribute('aria-owns', ariaOwns);
    }

    connectedCallback() {
        this.listItems = Array.from(this.querySelectorAll('demo-listitem'));
        this.updateOrdering();
    }
}

customElements.define('demo-list', DemoList);
