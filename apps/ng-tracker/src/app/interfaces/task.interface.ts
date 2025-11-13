export interface Task {
  id: string;
  text: string;
  day: Date | null;
  reminder: boolean;
}
