export function abreviateName(fullname: string) {
    const nameSplited: string[] = fullname.split(' ');
    const firstName = nameSplited.splice(0,1);
    const lastName = nameSplited.splice(nameSplited.length - 1,1);
    const filteredName = nameSplited.filter(name => name.length > 3);

    let abreviatedName = '';

    for (let i = 0; i < filteredName.length; i++) {
        abreviatedName += ' ' + filteredName[i][0];
    }

    return `${firstName}${abreviatedName} ${lastName}`;
}