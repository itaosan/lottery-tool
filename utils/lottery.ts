export interface Participant {
  name: string;
  multiplier: number;
}

export function parseParticipants(input: string): Participant[] {
  return input.split("\n").map((line) => {
    const [name, multiplier] = line.split(",");
    return {
      name: name.trim(),
      multiplier: Number.parseInt(multiplier?.trim() || "1", 10),
    };
  });
}

export function createWeightedList(participants: Participant[]): string[] {
  return participants.flatMap((p) => Array(p.multiplier).fill(p.name));
}

export function selectWinner(weightedList: string[]): string {
  const randomIndex = Math.floor(Math.random() * weightedList.length);
  return weightedList[randomIndex];
}

export interface Settings {
  title: string;
  duration: number;
  participants: string;
  prizeNames: string;
}

export function settingsToText(settings: Settings): string {
  return `Title: ${settings.title}
Duration: ${settings.duration}
Prizes:
${settings.prizeNames}
Participants:
${settings.participants}`;
}

export function textToSettings(text: string): Settings {
  const lines = text.split("\n");
  const title = lines[0].split(": ")[1] || "";
  const duration = Number.parseInt(lines[1].split(": ")[1], 10) || 15;
  const prizeIndex = lines.indexOf("Prizes:");
  const participantsIndex = lines.indexOf("Participants:");

  if (prizeIndex === -1 || participantsIndex === -1) {
    throw new Error("Invalid file format");
  }

  const prizeNames = lines
    .slice(prizeIndex + 1, participantsIndex)
    .join("\n")
    .trim();
  const participants = lines
    .slice(participantsIndex + 1)
    .join("\n")
    .trim();

  return { title, duration, prizeNames, participants };
}
