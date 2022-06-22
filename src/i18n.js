const messageKeys = [
        'title',
        'controlPanel',
        'insertURL',
        'rows',
        'columns',
        'chooseImageFromURL',
        'uploadImage',
        'start'
    ],
    messagesPrototype = {};

for (const key of Object.keys(messageKeys)) {
    messagesPrototype[key] = `{msg: ${key}}`;
}

const he = Object.assign(
    Object.create(messagesPrototype), {
        title: 'כאן בונים',
        controlPanel: 'הגדרות',
        insertURL: 'הכנס כתובת של תמונה',
        rows: 'שורות',
        columns: 'עמודות',
        chooseImageFromURL: 'בחירת תמונה מכתובת אינטרנט',
        uploadImage: 'העלאת תמונה',
        start: 'צור פאזל'
    }
);

export default he;
export const direction = 'rtl';