import { Form } from '@remix-run/react';
import { SocialsProvider } from 'remix-auth-socials';
import AppHeader from '~/components/AppHeader';
import { Box, Button, Center } from '@chakra-ui/react';

interface SocialButtonProps {
  provider: SocialsProvider;
  label: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, label }) => (
  <Box m={15}>
    <Form action={`/auth/${provider}`} method="post">
      <Button type={'submit'} colorScheme={'blue'}>
        {label}
      </Button>
    </Form>
  </Box>
);

export default function Login() {
  return (
    <div>
      <AppHeader></AppHeader>
      <Center>
        <SocialButton provider={SocialsProvider.GOOGLE} label="Login with Google" />
      </Center>
    </div>
  );
}
