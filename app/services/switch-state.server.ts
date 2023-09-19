import { promises as fs } from 'fs';
import { SwitchState } from '~/models/SwitchState';
import { appConfig } from '~/config/app.config';
import { add } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export class SwitchStateServer {
  private readonly location: string;

  constructor() {
    this.location = `${appConfig.storage.basePath}/switch-state.json`;
  }

  public async load(): Promise<SwitchState> {
    try {
      return JSON.parse(await fs.readFile(this.location, 'utf-8')) as SwitchState;
    } catch (error) {
      console.error('Error loading state, initializing new state!');
      const newState: SwitchState = {
        nextShutoff: getNextShutoff().toISOString(),
        nextSwitchOn: getNextSwitchOn().toISOString(),
        internetAvailable: true,
        history: [
          {
            successful: true,
            date: new Date().toISOString(),
            taskType: 'switchOn',
            output: 'Initialized new state',
          },
        ],
      };
      try {
        await this.save(newState);
      } catch (error) {
        console.error('Error saving new state!');
      }
      return newState;
    }
  }

  public async save(state: SwitchState): Promise<void> {
    await fs.writeFile(this.location, JSON.stringify(state, null, 2));
  }
}

export function getNextShutoff(): Date {
  const now = utcToZonedTime(new Date(), appConfig.timezone);
  const nextShutoff =
    now.getHours() < appConfig.switchOffHour
      ? utcToZonedTime(new Date(now.setHours(appConfig.switchOffHour, 0, 0, 0)), appConfig.timezone)
      : utcToZonedTime(add(new Date(now.setHours(appConfig.switchOffHour, 0, 0, 0)), { days: 1 }), appConfig.timezone);
  return skipWeekends(nextShutoff);
}

export function getNextSwitchOn(): Date {
  const nextShutoff = getNextShutoff();
  return add(nextShutoff, { hours: 24 - appConfig.switchOffHour + appConfig.switchOnHour });
}

export function skipWeekends(date: Date): Date {
  const day = utcToZonedTime(date, appConfig.timezone).getDay();
  if (day === 5) {
    return utcToZonedTime(add(date, { days: 2 }), appConfig.timezone);
  } else if (day === 6) {
    return utcToZonedTime(add(date, { days: 1 }), appConfig.timezone);
  }
  return date;
}

export const state = new SwitchStateServer();
