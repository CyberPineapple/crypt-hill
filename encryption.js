const fs = require('fs');

//чтение из файла
let text = fs.readFileSync('Text.txt', 'utf8');
let key = fs.readFileSync('Key.txt', 'utf8');
console.log('Текст для зашифровки: ', text);
console.log('Ключ для зашифровки: ', key);

//кодирование данных
let alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя., ?';
console.log('Алфавит: ', alphabet);
alphabet = alphabet.split('');
text = text.split('');
text = text.map(value => alphabet.indexOf(value));
key = key.split('');
key = key.map(value => alphabet.indexOf(value));

// создание квадратной матрицы из ключа
let matrixSize = Math.sqrt(key.length);
let matrix = [];
for (let i = 0; i < matrixSize; i++) {
    let matrixString = [];
    for (let j = 0; j < matrixSize; j++) {
        matrixString[j] = key.shift();
    }
    matrix[i] = matrixString;
}
// разбиение текста на блоки
let blocks = [];
for (let i = 0; text.length != 0; i++) {
    let blockNumber = [];
    for (let j = 0; j < matrixSize; j++) {
        if (text.length != 0) {
            blockNumber[j] = text.shift();
        } else {
            blockNumber[j] = alphabet.indexOf(' ');
        }

    }
    blocks[i] = blockNumber;
}

// умножение блоков на матрицу
let newMatrix = [];
for (let i = 0; i < blocks.length; i++) {
    let stringNewMatrix = [];
    for (let j = 0; j < matrixSize; j++) {
    let number = 0;
    for (let k = 0; k < matrixSize; k++) {
        number += blocks[i][k] * matrix[k][j];
    }
        stringNewMatrix[j] = number
    }
    newMatrix[i] = stringNewMatrix;
}
// console.log(matrix);
// for (let j = 0; j < matrixSize; j++) {
//     let number = 0;
//     for (let k = 0; k < matrixSize; k++) {
//         number += blocks[i][k] * matrix[k][j];
//         console.log(blocks[i][k],'*',matrix[k][j],'=',number);
//     }
//     newMatrix[j] = number;
// }
console.log(newMatrix);
// взятие остатка от деления на длину алфавита ( матрицы mod длина алфавита)
for (let i =0; i<newMatrix.length; i++){
    for (let j=0; j < newMatrix[i].length; j++){
        newMatrix[i][j] = newMatrix[i][j] % alphabet.length;
    }
}

// декодирование в текст
for (let i =0; i<newMatrix.length; i++){
    for (let j=0; j < newMatrix[i].length; j++){
        newMatrix[i][j] = alphabet[newMatrix[i][j]];
    }
}

// склеивание массива в строку
for (let i in newMatrix){
    newMatrix[i] = newMatrix[i].join('');
}
newMatrix = newMatrix.join('');
console.log("Зашифрованный текст: ", newMatrix);

// запись в файл
fs.writeFileSync('EncryptedText.txt', newMatrix);

