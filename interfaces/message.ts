export interface Message {
  text: string;
  img: string;
  flags?: number;
  msgID?: string;
  msgHash?: string;
  content?: string;
  progress?: string;
  options?: any;
  prompt?: string;
}
