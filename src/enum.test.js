import Enum from './enum';

console.log('=====================================================');

const WeekDays = new Enum({
    sunday:0,
    monday:0,
    tuesday:0,
    wednesday:0,
    thursday:0,
    friday:0,
    saturday:0
});

const Winds = new Enum({
    north:0,
    east:0,
    south:0,
    west:0
});

test('keys are set correctly', () => {
    expect(Object.keys(WeekDays)).toStrictEqual(
        ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);
    expect(Object.keys(Winds)).toStrictEqual(
        ['north', 'east', 'south', 'west']);
});

test('Enum type and members are protected', () => {
    expect(() => WeekDays.someProperty = 3).toThrowError();
    expect(() => WeekDays.sunday.someProperty = 3).toThrowError();
})

test('a member equals itself', () => {
    expect(WeekDays.sunday).toBe(WeekDays.sunday);
});

test('members not equal each other', () => {
    expect(WeekDays.monday).not.toBe(WeekDays.tuesday);
    expect(WeekDays.tuesday === WeekDays.wednesday).toBe(false);
    expect(WeekDays.tuesday == WeekDays.wednesday).toBe(false);
});

test('members of different enums not equal each other', () => {
    expect(WeekDays.sunday).not.toBe(Winds.north);
    expect(WeekDays.sunday === Winds.north).toBe(false);
    expect(WeekDays.sunday == Winds.north).toBe(false);
})

test('members have a comparable order', () => {
    expect(WeekDays.thursday.index).toBeLessThan(WeekDays.friday.index);
    expect(WeekDays.thursday < WeekDays.friday).toBe(true);
    expect(Winds.west < WeekDays.friday).toBe(true);
});

test('name and index', () => {
    expect(WeekDays.saturday.name).toBe('saturday');
    expect(WeekDays.saturday.index).toBe(6);
    expect(() => WeekDays.saturday.name = 'anotherName').toThrowError();
    expect(() => WeekDays.saturday.index = 0).toThrowError();
});

test('type conversions', () => {
    expect(+WeekDays.sunday).toBe(0);
    expect(WeekDays.monday + '').toBe('EnumMember monday(1)');
});

test('member validation', () => {
    const wednesday = WeekDays.wednesday,
        fakeWednesday = Symbol(wednesday.index);

    expect(Enum.isValidEnumMember(WeekDays, wednesday)).toBe(true);
    expect(Enum.isValidEnumMember(WeekDays, fakeWednesday)).toBe(false);
    expect(Enum.isValidEnumMember(Winds, wednesday)).toBe(false);
});

test('retrieving a member by index', () => {
    expect(Object.values(WeekDays)[3]).toBe(WeekDays.wednesday);
})