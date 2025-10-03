export class LookUp {
  id: number = 0;
  name: string = '';

  constructor(init?: Partial<LookUp>) {
    Object.assign(this, init);
  }
}
