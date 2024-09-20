/** Application entry point */

const HELLO = 'Hello, Auth service!';

const sleep = (ms: number): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const main = async (): Promise<void> => {
  while (true) {
    console.log(HELLO);
    await sleep(5000);
  }
};

main();
