export class Notify {
  isShow: boolean = false;
  message: string = '';
  color: string = 'success';
  timeout: number = 3000;
  icon: string = 'mdi-check-circle-outline';
  position: string = 'top-right';
  multiLine: boolean = false;
  vertical: boolean = false;
  closeBtn: boolean = false;
  progress: boolean = false;
  progressColor: string = 'white';
  progressHeight: number = 2;
  transition: string = 'slide-x-reverse-transition';

  constructor(init?: Partial<Notify>) {
    Object.assign(this, init);
  }
}
