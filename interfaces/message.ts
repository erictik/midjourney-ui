export interface Message {
  text: string;
  img: string;
  flags?: number;
  msgID?: string;
  msgHash?: string;
  content?: string;
  hasTag: boolean;
  progress?: string;
}
