class EnumMember {
    name
    index
    ownerEnum

    constructor(ownerEnum, index, name = '') {
        if (!Number.isInteger(index) ||
            index < 0 ||
            typeof name !== 'string'
        ) {
            throw Error('internal error in enum.js; unexpected argument');
        }

        this.name = name;
        this.index = index;
        this.ownerEnum = ownerEnum;
        Object.freeze(this);
    }

    valueOf() {
        return this.index;
    }

    toString() {
        return `EnumMember ${this.name}(${this.index})`;
    }

    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            return this.index;
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
            throw Error(
                'argument must be a regular object with at least one string key'
            );
        }

        keys.forEach( (keyName, keyIndex) => {
            this[keyName] = new EnumMember(this, keyIndex, keyName);
        });

        Object.freeze(this);
    }

    static isValidEnumMember(enumObj, member) {
        if (!(enumObj instanceof Enum)) {
            throw Error('first argument is not an instance of Enum');
        }

        if (!(member instanceof EnumMember)) {
            return false;
        }
        return Object.values(enumObj).includes(member);
    }
}

export default Enum;