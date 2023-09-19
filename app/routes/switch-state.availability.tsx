import { ActionArgs, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { format } from 'date-fns';

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  const formData = await request.formData();
  const internetAvailable = formData.get('internetAvailable') === 'true';
  console.log(
    `${format(new Date(), 'PPpp')} User ${user.email} is switching internetAvailable to ${internetAvailable}.`,
  );
  return redirect('/');
}
