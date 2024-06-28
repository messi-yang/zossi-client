export class DateVo {
  constructor(private date: Date) {}

  static now() {
    return new DateVo(new Date());
  }

  static parseString(dateString: string) {
    return new DateVo(new Date(dateString));
  }

  static fromTimestamp(timestamp: number) {
    return new DateVo(new Date(timestamp));
  }

  public toString() {
    return this.date.toString();
  }

  public getTimestamp() {
    return this.date.getTime();
  }

  public getDiffInMilliseconds(otherDate: DateVo) {
    return this.date.getTime() - otherDate.date.getTime();
  }

  public getSecondsAgo() {
    const timeDiffInMilliseconds = new Date().getTime() - this.date.getTime();

    return Math.floor(timeDiffInMilliseconds / 1000);
  }

  public getMilisecondsAgo() {
    const timeDiffInMilliseconds = new Date().getTime() - this.date.getTime();

    return Math.floor(timeDiffInMilliseconds);
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

  public isBetween(dateA: DateVo, dateB: DateVo) {
    const timestamp = this.getTimestamp();

    return timestamp >= dateA.getTimestamp() && timestamp <= dateB.getTimestamp();
  }
}
