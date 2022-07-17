function validate(condition: boolean) {
    if (!condition) {
        throw Error();
    }
}

export { validate };