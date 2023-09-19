export type SwitchState = {
  internetAvailable: boolean;
  nextShutoff: string;
  nextSwitchOn: string;
  history: SwitchTaskHistory[];
};

export type SwitchTaskHistory = {
  successful: boolean;
  date: string;
  taskType: 'switchOn' | 'switchOff';
  output: string;
};
