import path from "path";
import csvToJson from "csvtojson";
import { askQuestion } from "./askQuestion";

async function readDebugCsv(filename: string): Promise<string[]> {
  const csvLinesValues = await csvToJson({
    escape: '"',
    output: "csv",
  })
    .fromFile(path.resolve(__dirname, "..", "..", "debug", filename))
    .then((csvLines) =>
      csvLines.filter(
        ([timestampValue]) =>
          timestampValue?.trim() &&
          Number(timestampValue) !== 0 &&
          String(new Date(timestampValue)) !== "Invalid Date"
      )
    );

  const options = csvLinesValues.map(
    (p) => ({
      timestamp: p[0],
      user: p[1],
    }),
    ["timestamp", "user"]
  );

  let validAnswer = true;
  let answer: string | undefined;

  do {
    const title = ["", "Choose one of the csv lines: "];

    if (!validAnswer) {
      title.push(
        "\x1b[31mAnd this time remember to choose one from the list, stupid.\x1b[0m"
      );
    }

    console.log(title.join("\n"));

    console.table(options);

    answer = await askQuestion("Your choice: ");

    validAnswer = Object.keys(options).some((p) => p === answer);
  } while (!validAnswer);

  return csvLinesValues[Number(answer)];
}

export { readDebugCsv };
