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

test('Enum type and members are protected', () => {
    expect(() => WeekDays.someProperty = 3).toThrowError();
    expect(() => WeekDays.sunday.someProperty = 3).toThrowError();
})

test('value equals itself', () => {
    expect(WeekDays.sunday).toBe(WeekDays.sunday);
});

test('values are different from each other', () => {
    expect(WeekDays.monday).not.toBe(WeekDays.tuesday);
    expect(WeekDays.tuesday != WeekDays.wednesday).toBe(true);
});

test('values have order', () => {
    expect(Number(WeekDays.thursday)).toBeLessThan(Number(WeekDays.friday));
    expect(WeekDays.thursday < WeekDays.friday).toBe(true);
});

test('name and value', () => {
    expect(WeekDays.saturday.name).toBe('saturday');
    expect(WeekDays.saturday.value).toBe(6);
    expect(() => WeekDays.saturday.name = 'anotherName').toThrowError();
    expect(() => WeekDays.saturday.value = 0).toThrowError();
});

test('type conversions', () => {
    expect(+WeekDays.sunday).toBe(0);
    expect(WeekDays.monday + '').toBe('EnumMember monday(1)');
    
    // 'EnumMember {}' ? I expected it to use the custom string coercion.
    // Have to check on a browser.
    console.log(WeekDays.tuesday);
});
