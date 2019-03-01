const fs = require('fs');
// функции для работы с матрицой

// вычисление определителя матрицы (алгоритм Барейса, сложность O(n^3))
Determinant = (A) => {
    let N = A.length, B = [], denom = 1, exchanges = 0;
    for (let i = 0; i < N; ++i) {
        B[i] = [];
        for (let j = 0; j < N; ++j) B[i][j] = A[i][j];
    }
    for (let i = 0; i < N - 1; ++i) {
        let maxN = i, maxValue = Math.abs(B[i][i]);
        for (let j = i + 1; j < N; ++j) {
            let value = Math.abs(B[j][i]);
            if (value > maxValue) { maxN = j; maxValue = value; }
        }
        if (maxN > i) {
            let temp = B[i]; B[i] = B[maxN]; B[maxN] = temp;
            ++exchanges;
        }
        else { if (maxValue == 0) return maxValue; }
        let value1 = B[i][i];
        for (let j = i + 1; j < N; ++j) {
            let value2 = B[j][i];
            B[j][i] = 0;
            for (let k = i + 1; k < N; ++k) B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
        }
        denom = value1;
    }
    if (exchanges % 2) return -B[N - 1][N - 1];
    else return B[N - 1][N - 1];
}

// нахождение элемента в кольце по модулю длины алфавита обратного детерминату
gcd = (x, y, s1 = 1, s2 = 0, t1 = 0, t2 = 1) => {
    let q = Math.floor(x / y),
        s1copy = s1,
        t1copy = t1;
    return (x % y === 0) ? { gcd: y, s: s2, t: t2 } : gcd(y, x % y, s1 = s2, s2 = s1copy - q * s2, t1 = t2, t2 = t1copy - q * t2);
}

// вычисление союзной матрицы 

AdjugateMatrix = (A) => {
    let N = A.length, adjA = [];
    for (let i = 0; i < N; i++) {
        adjA[i] = [];
        for (let j = 0; j < N; j++) {
            let B = [], sign = ((i + j) % 2 == 0) ? 1 : -1;
            for (let m = 0; m < j; m++) {
                B[m] = [];
                for (let n = 0; n < i; n++)   B[m][n] = A[m][n];
                for (let n = i + 1; n < N; n++) B[m][n - 1] = A[m][n];
            }
            for (let m = j + 1; m < N; m++) {
                B[m - 1] = [];
                for (let n = 0; n < i; n++)   B[m - 1][n] = A[m][n];
                for (let n = i + 1; n < N; n++) B[m - 1][n - 1] = A[m][n];
            }
            adjA[i][j] = sign * Determinant(B);
        }
    }
    return adjA;
}

// транспонирование матрицы
TransMatrix = (A) => {
    var m = A.length, n = A[0].length, AT = [];
    for (var i = 0; i < n; i++)
     { AT[ i ] = [];
       for (var j = 0; j < m; j++) AT[ i ][j] = A[j][ i ];
     }
    return AT;
}



//чтение из файла
let text = fs.readFileSync('EncryptedText.txt', 'utf8');
let key = fs.readFileSync('Key.txt', 'utf8');
console.log('Текст для расшифровки: ', text);
console.log('Ключ для расшифровки: ', key);

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
            blockNumber[j] = alphabet.lenght;
        }
    }
    blocks[i] = blockNumber;
}



// вычисление обратной матрицы 
let det = Determinant(matrix);
let x = gcd(det, alphabet.length);
x = x.s;
let reverseDet;
if (det < 0 && x > 0) {
    reverseDet = x;
} else if (det > 0 && x < 0) {
    reverseDet = alphabet.length + x;
} else if (det > 0 && x > 0) {
    reverseDet = x;
} else if (det < 0 && x < 0){
    reverseDet = -x;
}

matrix = AdjugateMatrix(matrix);
for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
        matrix[i][j] = matrix[i][j] % alphabet.length;
    }
}

for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = matrix[i][j]*reverseDet;
    }
}

for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = matrix[i][j] % alphabet.length;
    }
}
// matrix = TransMatrix(matrix);
for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j]<0){
            matrix[i][j] = alphabet.length+matrix[i][j];
        }
    }
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

// взятие остатка от деления на длину алфавита ( матрицы mod длина алфавита)
for (let i = 0; i < newMatrix.length; i++) {
    for (let j = 0; j < newMatrix[i].length; j++) {
        newMatrix[i][j] = newMatrix[i][j] % alphabet.length;
    }
}
// декодирование в текст
for (let i = 0; i < newMatrix.length; i++) {
    for (let j = 0; j < newMatrix[i].length; j++) {
        newMatrix[i][j] = alphabet[newMatrix[i][j]];
    }
}
// склеивание массива в строку
for (let i in newMatrix) {
    newMatrix[i] = newMatrix[i].join('');
}
newMatrix = newMatrix.join('');
console.log("Расшифрованный текст: ", newMatrix);

// запись в файл
fs.writeFileSync('DecryptedText.txt', newMatrix);




