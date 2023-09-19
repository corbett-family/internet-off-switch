import { ActionArgs, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { add, format, isPast, isToday } from 'date-fns';
import { skipWeekends, state } from '~/services/switch-state.server';
import { appConfig } from '~/config/app.config';
import { utcToZonedTime } from 'date-fns-tz';

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  console.log(`${format(new Date(), 'PPpp')} User ${user.email} is skipping the turnoff for a day.`);

  const existingState = await state.load();
  let nextShutoff = utcToZonedTime(new Date(existingState.nextShutoff), appConfig.timezone);
  nextShutoff.setHours(appConfig.switchOffHour, 0, 0, 0);
  nextShutoff = skipWeekends(add(nextShutoff, { days: 1 }));
  await state.save({ ...existingState, nextShutoff: nextShutoff.toISOString() });
  return redirect('/');
}
