export class DateModel {
  constructor(private date: Date) {}

  static now() {
    return new DateModel(new Date());
  }

  static parseString(dateString: string) {
    return new DateModel(new Date(dateString));
  }

  public toString() {
    return this.date.toString();
  }

  public getTimestampe() {
    return this.date.getTime();
  }

  public getSecondsAgo() {
    const timeDiffInMilliseconds = new Date().getTime() - this.date.getTime();

    return Math.floor(timeDiffInMilliseconds / 1000);
  }

  public getMinutesAgo() {
    const timeDiffInMilliseconds = new Date().getTime() - this.date.getTime();

    return Math.floor(timeDiffInMilliseconds / (1000 * 60));
  }

  public getHoursAgo() {
    const timeDiffInMilliseconds = new Date().getTime() - this.date.getTime();

    return Math.floor(timeDiffInMilliseconds / (1000 * 60 * 60));
  }

  public getDaysAgo() {
    const timeDiffInMilliseconds = new Date().getTime() - this.date.getTime();

    return Math.floor(timeDiffInMilliseconds / (1000 * 60 * 60 * 24));
  }
}
