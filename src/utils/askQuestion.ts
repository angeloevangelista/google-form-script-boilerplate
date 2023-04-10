import readline from "readline";

function askQuestion(question: string): Promise<string> {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    readlineInterface.question(question, (answer) => {
      readlineInterface.close();

      resolve(answer);
    })
  );
}

export { askQuestion };
