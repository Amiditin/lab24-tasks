import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const guessedNumber = String(Math.floor(Math.random() * 90000 + 10000));

rl.on('line', (number: string) => {
  let matchingNumbers: string[] = [];
  let exactNumbers: string[] = [];

  for (let i = 0; i < number.length; i++) {
    if (number[i] === guessedNumber[i]) {
      exactNumbers.push(number[i]);
    } else if (guessedNumber.includes(number[i])) {
      matchingNumbers.push(number[i]);
    }
  }

  console.log(
    `совпавших цифр не на своих местах - ${matchingNumbers.length} (${matchingNumbers.join(
      ' и ',
    )}), цифр на своих местах - ${exactNumbers.length} (${exactNumbers.join(' и ')})`,
  );

  if (number === guessedNumber) {
    console.log('Победа');

    rl.close();
  }
});
