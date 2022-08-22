import readline from 'readline';

interface IMove {
  name: string;
  physicalDmg: number;
  magicDmg: number;
  physicArmorPercents: number;
  magicArmorPercents: number;
  cooldown: number;
}

interface ICooldowns {
  name: string;
  movesLeft: number;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const monster = {
  maxHealth: 10,
  name: 'Лютый',
  moves: [
    {
      name: 'Удар когтистой лапой',
      physicalDmg: 3, // физический урон
      magicDmg: 0, // магический урон
      physicArmorPercents: 20, // физическая броня
      magicArmorPercents: 20, // магическая броня
      cooldown: 0, // ходов на восстановление
    },
    {
      name: 'Огненное дыхание',
      physicalDmg: 0,
      magicDmg: 4,
      physicArmorPercents: 0,
      magicArmorPercents: 0,
      cooldown: 3,
    },
    {
      name: 'Удар хвостом',
      physicalDmg: 2,
      magicDmg: 0,
      physicArmorPercents: 50,
      magicArmorPercents: 0,
      cooldown: 2,
    },
  ],
};

const player = {
  maxHealth: 10,
  name: 'Player',
  moves: [
    {
      name: 'Удар боевым кадилом',
      physicalDmg: 2,
      magicDmg: 0,
      physicArmorPercents: 0,
      magicArmorPercents: 50,
      cooldown: 0,
    },
    {
      name: 'Вертушка левой пяткой',
      physicalDmg: 4,
      magicDmg: 0,
      physicArmorPercents: 0,
      magicArmorPercents: 0,
      cooldown: 4,
    },
    {
      name: 'Каноничный фаербол',
      physicalDmg: 0,
      magicDmg: 5,
      physicArmorPercents: 0,
      magicArmorPercents: 0,
      cooldown: 3,
    },
    {
      name: 'Магический блок',
      physicalDmg: 0,
      magicDmg: 0,
      physicArmorPercents: 100,
      magicArmorPercents: 100,
      cooldown: 4,
    },
  ],
};

let difficultyLevel: 'l' | 'm' | 'h';
let playerCooldowns: ICooldowns[] = [];
let monsterCooldowns: ICooldowns[] = [];
let monsterMove: IMove;
let playerMove: IMove;

const getMonsterMove = (): IMove => {
  while (true) {
    const moveIndex = Math.floor(Math.random() * 3);

    if (!monsterCooldowns.find((item) => item.name === monster.moves[moveIndex].name)) {
      if (monster.moves[moveIndex].cooldown !== 0) {
        monsterCooldowns.push({
          name: monster.moves[moveIndex].name,
          movesLeft: monster.moves[moveIndex].cooldown + 1,
        });
      }

      return monster.moves[moveIndex];
    }
  }
};

const getPlayerMove = (move: string): IMove => {
  const cooldown = playerCooldowns.find((item) => item.name === player.moves[+move - 1].name);

  if (!cooldown) {
    if (player.moves[+move - 1].cooldown !== 0) {
      playerCooldowns.push({
        name: player.moves[+move - 1].name,
        movesLeft: player.moves[+move - 1].cooldown + 1,
      });
    }

    return player.moves[+move - 1];
  }

  console.log('Эта способность на перезарядке. Игрок автоматически атаковал 1 способностью.');
  return player.moves[0];
};

const showPlayerChoiceMessage = () => {
  console.log(`Ваше здоровье: ${player.maxHealth.toFixed(2)}hp`);
  console.log(`Здоровье монстра: ${monster.maxHealth.toFixed(2)}hp`);
  console.log('Выберите одно из действий:');

  player.moves.forEach((move, i) => {
    let cooldowm = playerCooldowns.find((cooldowm) => cooldowm.name === move.name);

    if (cooldowm) {
      console.log(`${i + 1}: ${move.name} на перезарядке (${cooldowm.movesLeft})`);
    } else {
      console.log(
        `${i + 1}: ${move.name}`,
        `(PhyDmg: ${move.physicalDmg},`,
        `MagDmg: ${move.magicDmg},`,
        `PhyArm: ${move.physicArmorPercents},`,
        `MagArm: ${move.magicArmorPercents},`,
        `Cooldown: ${move.cooldown})`,
      );
    }
  });

  console.log('');
};

const showMonsterMoveMessage = (monsterMove: IMove) => {
  console.log(`--------------------------------------------------------------------------------\n`);
  console.log(`Монстр ${monster.name} собирается вас атаковать!`);
  console.log(
    `Атака: ${monsterMove.name}`,
    `(PhyDmg: ${monsterMove.physicalDmg},`,
    `MagDmg: ${monsterMove.magicDmg},`,
    `PhyArm: ${monsterMove.physicArmorPercents},`,
    `MagArm: ${monsterMove.magicArmorPercents},`,
    `Cooldown: ${monsterMove.cooldown})\n`,
  );
};

const updateCooldowns = () => {
  const getNewCooldowns = (newArr: ICooldowns[], cooldown: ICooldowns) => {
    cooldown.movesLeft -= 1;

    if (cooldown.movesLeft > 0) {
      newArr.push(cooldown);
    }

    return newArr;
  };

  playerCooldowns = playerCooldowns.reduce(getNewCooldowns, []);
  monsterCooldowns = monsterCooldowns.reduce(getNewCooldowns, []);
};

const getHealth = (attackMove: IMove, defenderMove: IMove): number => {
  return (
    attackMove.physicalDmg -
    attackMove.physicalDmg * (defenderMove.physicArmorPercents / 100) +
    (attackMove.magicDmg - attackMove.magicDmg * (defenderMove.magicArmorPercents / 100))
  );
};

console.log('Выберите уровень сложности: low (l), medium (m), hard (h)');

rl.on('line', (move: string) => {
  if (!difficultyLevel) {
    if (move === 'l' || move === 'm' || move === 'h') {
      difficultyLevel = move;
      switch (difficultyLevel) {
        case 'l':
          player.maxHealth = 30;
          break;
        case 'm':
          player.maxHealth = 20;
          break;
        case 'h':
          player.maxHealth = 10;
          break;
      }
      monsterMove = getMonsterMove();

      showMonsterMoveMessage(monsterMove);
      showPlayerChoiceMessage();
    } else {
      console.log('Выберите уровень сложности: low (l), medium (m), hard (h)');
    }
  } else if (move === '1' || move === '2' || move === '3' || move === '4') {
    playerMove = getPlayerMove(move);
    console.log(playerMove, monsterMove);

    player.maxHealth -= getHealth(monsterMove, playerMove);
    monster.maxHealth -= getHealth(playerMove, monsterMove);

    if (player.maxHealth <= 0 && monster.maxHealth <= 0) {
      console.log('Ничья');
      rl.close();
      return;
    }
    if (monster.maxHealth <= 0) {
      console.log('Вы выйграли');
      rl.close();
      return;
    }
    if (player.maxHealth <= 0) {
      console.log('Вы проиграли');
      rl.close();
      return;
    }

    updateCooldowns();
    monsterMove = getMonsterMove();
    showMonsterMoveMessage(monsterMove);
    showPlayerChoiceMessage();
  }
});
