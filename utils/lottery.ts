export interface Participant {
  name: string;
  multiplier: number;
}

export function parseParticipants(input: string): Participant[] {
  return input.split('\n').map(line => {
    const [name, multiplier] = line.split(',');
    return {
      name: name.trim(),
      multiplier: Number.parseInt(multiplier?.trim() || '1', 10)
    };
  });
}

export function createWeightedList(participants: Participant[]): string[] {
  return participants.flatMap(p => 
    Array(p.multiplier).fill(p.name)
  );
}

export function selectWinner(weightedList: string[]): string {
  const randomIndex = Math.floor(Math.random() * weightedList.length);
  return weightedList[randomIndex];
}

