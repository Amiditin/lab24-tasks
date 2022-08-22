interface IWeekDaysDict {
  ru: 'ПОНЕДЕЛЬНИК' | 'ВТОРНИК' | 'СРЕДА' | 'ЧЕТВЕРГ' | 'ПЯТНИЦА' | 'СУББОТА' | 'ВОСКРЕСЕНЬЕ';
  en: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
}

const weekDaysDict: IWeekDaysDict[] = [
  { ru: 'ПОНЕДЕЛЬНИК', en: 'MONDAY' },
  { ru: 'ВТОРНИК', en: 'TUESDAY' },
  { ru: 'СРЕДА', en: 'WEDNESDAY' },
  { ru: 'ЧЕТВЕРГ', en: 'THURSDAY' },
  { ru: 'ПЯТНИЦА', en: 'FRIDAY' },
  { ru: 'СУББОТА', en: 'SATURDAY' },
  { ru: 'ВОСКРЕСЕНЬЕ', en: 'SUNDAY' },
];

const replaceWeekDaysRu = (str: string): string => {
  let word = '';
  let newStr = '';

  for (let i = 0; i < str.length; i++) {
    if (str[i] >= 'А' && str[i] <= 'я') {
      word += str[i];
    } else if (word !== '') {
      let day = weekDaysDict.find((day) => day.ru === word);

      newStr = day ? newStr.slice(0, newStr.length - word.length) + day.en : newStr;

      word = '';
    }

    newStr += str[i];
  }
  return newStr;
};

let str = `Старший братец ПОНЕДЕЛЬНИК –
работяга, не бездельник.
Он неделю открывает
всех трудиться зазывает.

ВТОРНИК следует за братом
у него идей богато.

А потом СРЕДА-сестрица,
не пристало ей лениться.

Брат ЧЕТВЕРГ и так, и сяк,
он мечтательный чудак.

ПЯТНИЦА-сестра сумела
побыстрей закончить дело.

Предпоследний брат СУББОТА
не выходит на работу.

В гости ходит ВОСКРЕСЕНЬЕ,
очень любит угощенье
`;

console.log(replaceWeekDaysRu(str));
