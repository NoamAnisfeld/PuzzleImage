class EnumMember {
    #name
    #symbol

    constructor(value, name) {
        if (!Number.isInteger(value) || value < 0) {
            throw Error('internal error in enum.js; unexpected argument');
        }

        this.#name = name;
        this.#symbol = Symbol(value);
    }

    get name() {
        return this.#name;
    }

    get value() {
        return Number(this.#symbol.description);
    }

    valueOf() {
        return this.value;
    }

    toString() {
        return `EnumMember ${this.name}(${this.value})`;
    }

    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            return this.value;
        } else {
            return this.toString();
        }
    }
}

class Enum {
    constructor(obj) {
        if (!(obj instanceof Object)) {
            throw Error('missing or bad argument');
        }

        const keys = Object.keys(obj);

        if (Object.getPrototypeOf(obj) !== Object.prototype ||
            keys.length === 0
        ) {
            throw Error('argument must be regular object with at least one key');
        }

        keys.forEach( (keyName, keyIndex) => {
            this[keyName] = Object.freeze(new EnumMember(keyIndex, keyName));
        });

        Object.freeze(this);
    }
}

export default Enum;