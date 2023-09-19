import { User } from '~/models/User';
import { Avatar, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import banner from '~/assets/banner.jpg';
import { Form } from '@remix-run/react';

type AppHeaderProps = {
  user?: User;
};

const AppHeader: React.FC<AppHeaderProps> = ({ user }) => {
  return (
    <Flex
      direction={'row'}
      width={'100%'}
      backgroundImage={banner}
      backgroundSize={'cover'}
      backgroundPosition={'bottom'}
      padding={10}
    >
      <Flex direction={'column'} color={'white'}>
        <Heading>Internet Shutoff Switch</Heading>
        {user && <Text>Welcome, {user.name}</Text>}
      </Flex>
      <Spacer />
      <Flex direction={'column'} color={'white'} height={'100%'}>
        {user && <Avatar name={user.name} src={user.avatar} />}
        {user && (
          <Form action={'/logout'} method="post">
            <button>Logout</button>
          </Form>
        )}
      </Flex>
    </Flex>
  );
};

export default AppHeader;
