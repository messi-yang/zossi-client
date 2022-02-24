export const pause = async (time: number) =>
  new Promise((res, rej) => {
    try {
      setTimeout(res, time);
    } catch (e) {
      rej(e);
    }
  });

export default {};
