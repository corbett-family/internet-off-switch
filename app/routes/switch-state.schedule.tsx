import { ActionArgs, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { format } from 'date-fns';
import { state } from '~/services/switch-state.server';

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  const formData = await request.formData();
  const nextShutoffTime = formData.get('nextShutoffTime') as string;
  console.log(`${format(new Date(), 'PPpp')} User ${user.email} is changing next shutoff to ${nextShutoffTime}.`);
  const existing = await state.load();
  await state.save({ ...existing, nextShutoff: nextShutoffTime });
  return redirect('/');
}
