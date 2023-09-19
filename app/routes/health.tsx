import { json, LoaderArgs } from '@remix-run/node';
import { unifi } from '~/services/unifi.server';
import { getNextShutoff, getNextSwitchOn, state } from '~/services/switch-state.server';
import { compareAsc } from 'date-fns';
import { SwitchTaskHistory } from '~/models/SwitchState';

export const loader = async ({ request }: LoaderArgs) => {
  scheduledTasks();
  return json({ Ok: true });
};

async function scheduledTasks() {
  const existing = await state.load();
  const now = new Date();
  let nextShutoff = new Date(existing.nextShutoff);
  let nextSwitchOn = new Date(existing.nextSwitchOn);
  let history = existing.history;
  let historyEntry: SwitchTaskHistory | undefined = undefined;
  if (compareAsc(now, nextShutoff) > 0) {
    historyEntry = {
      date: now.toISOString(),
      taskType: 'switchOff',
      output: 'Shutoff successful',
      successful: true,
    };
    try {
      await unifi.turnOffInternet();
    } catch (error) {
      historyEntry.successful = false;
      if (error instanceof Error) {
        historyEntry.output = error.message + '\n' + error.stack;
      } else {
        historyEntry.output = String(error);
      }
    }
    nextShutoff = getNextShutoff();
  } else if (compareAsc(now, nextSwitchOn) > 0) {
    historyEntry = {
      date: now.toISOString(),
      taskType: 'switchOn',
      output: 'SwitchOn successful',
      successful: true,
    };
    try {
      await unifi.turnOnInternet();
    } catch (error) {
      historyEntry.successful = false;
      if (error instanceof Error) {
        historyEntry.output = error.message + '\n' + error.stack;
      } else {
        historyEntry.output = String(error);
      }
    }
    nextSwitchOn = getNextSwitchOn();
  }
  const internetAvailable = !(await unifi.getRuleStatus());
  console.log(`Internet is ${internetAvailable ? 'available' : 'unavailable'}.`);
  if (historyEntry) {
    history.unshift(historyEntry);
  }
  if (history.length > 10) {
    history.pop();
  }
  await state.save({
    ...existing,
    nextShutoff: nextShutoff.toISOString(),
    nextSwitchOn: nextSwitchOn.toISOString(),
    internetAvailable,
    history,
  });
}
