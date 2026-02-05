export class CreateTaskDto {
  id: string;
  text: string;
  day: string;
  reminder: boolean;

  constructor(id: string, text: string, day: string, reminder: boolean) {
    this.id = id;
    this.text = text;
    this.day = day;
    this.reminder = reminder;
  }
}
