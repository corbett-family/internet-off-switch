import { ActionArgs, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { add, format } from 'date-fns';
import { state } from '~/services/switch-state.server';

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  console.log(`${format(new Date(), 'PPpp')} User ${user.email} is adding 15 minutes to shutoff time.`);
  const existing = await state.load();
  await state.save({ ...existing, nextShutoff: add(new Date(existing.nextShutoff), { minutes: 15 }).toISOString() });
  return redirect('/');
}
