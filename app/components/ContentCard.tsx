import { IconType } from 'react-icons';
import { FC } from 'react';
import { Card, CardBody, CardHeader, Divider, Text, Box, Flex } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import * as React from 'react';

type ContentBoxProps = {
  children?: React.ReactNode;
  title: string;
  icon: IconType;
};

const ContentCard: FC<ContentBoxProps> = ({ children, title, icon }) => {
  return (
    <Card mt={3} rounded={15} pb={'7px'}>
      <CardHeader pb={'.2em'}>
        <Flex direction={'row'}>
          <Box mt={'6px'}>
            <Icon color={'black.200'} as={icon} />
          </Box>
          <Text ml={'10px'} fontWeight={600} fontSize={'1.2em'}>
            {title}
          </Text>
        </Flex>
        <Divider pt={'10px'} />
      </CardHeader>
      <CardBody pt={'.6em'}>{children}</CardBody>
    </Card>
  );
};

export default ContentCard;
