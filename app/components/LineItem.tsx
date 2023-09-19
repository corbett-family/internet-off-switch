import { FC } from 'react';
import { Box, Divider, Flex, Spacer, Text } from '@chakra-ui/react';

type LineItemProps = {
  children: React.ReactNode;
  title: string;
};

const LineItem: FC<LineItemProps> = ({ children, title }) => {
  return (
    <Box my={1}>
      <Flex direction={'row'}>
        <Text alignSelf={'end'} fontSize={'1.2em'}>
          {title}
        </Text>
        <Spacer />
        <Box>{children}</Box>
      </Flex>
      <Divider pt={1} variant={'dashed'} />
    </Box>
  );
};

export default LineItem;
