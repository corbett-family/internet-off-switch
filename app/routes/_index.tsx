import { json, LoaderArgs, SerializeFrom, V2_MetaFunction } from '@remix-run/node';
import {
  Box,
  Button,
  Code,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  useDisclosure,
} from '@chakra-ui/react';
import { authenticator } from '~/services/auth.server';
import { Form, useLoaderData, useSubmit } from '@remix-run/react';
import AppHeader from '~/components/AppHeader';
import ContentCard from '~/components/ContentCard';
import { FiActivity, FiAlertOctagon, FiCheckCircle, FiWatch } from 'react-icons/fi';
import { SwitchState, SwitchTaskHistory } from '~/models/SwitchState';
import LineItem from '~/components/LineItem';
import { format, parse } from 'date-fns';
import standardMeta from '~/standard-meta';
import { createColumnHelper } from '@tanstack/table-core';
import { DataTable } from '~/components/DataTable';
import { Icon } from '@chakra-ui/icons';
import { useState } from 'react';
import { state } from '~/services/switch-state.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }, ...standardMeta];
};

export let loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return json({ user, switchState: await state.load() });
};

const formatDateTime = (date: Date): string => {
  return format(date, 'yyyy-MM-dd HH:mm');
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [logData, setLogData] = useState('example-log-data');

  const handleAvailabilityChange = (event: any) => {
    event.target.value = event.target.checked;
    submit(event.currentTarget.form);
  };
  const handleScheduleChange = (event: any) => {
    document
      .getElementById('nextShutoffTime')
      ?.setAttribute('value', parse(event.target.value, "yyyy-MM-dd'T'HH:mm", new Date()).toISOString());
    submit(event.currentTarget.form);
  };

  const handleLogClick = (logData: string) => {
    setLogData(logData);
    onOpen();
  };
  const historyColumnHelper = createColumnHelper<SerializeFrom<SwitchTaskHistory>>();
  const historyColumns = [
    historyColumnHelper.accessor('successful', {
      header: 'Ok',
      cell: (data) =>
        data.getValue() ? (
          <Icon as={FiCheckCircle} boxSize={6} color={'green'} />
        ) : (
          <Icon as={FiAlertOctagon} boxSize={6} color={'red'} />
        ),
    }),
    historyColumnHelper.accessor((row) => new Date(row.date), {
      header: 'Date',
      cell: (data) => format(data.getValue(), 'PPpp'),
    }),
    historyColumnHelper.accessor((row) => (row.taskType === 'switchOn' ? 'On' : 'Off'), { header: 'Type' }),
    historyColumnHelper.display({
      header: ' ',
      cell: (data) => <Button onClick={() => handleLogClick(data.row.original.output)}>Logs</Button>,
    }),
  ];

  return (
    <Box>
      <AppHeader user={data.user} />
      <Flex m={10} direction={'column'} gap={5}>
        <ContentCard title={'Current Status'} icon={FiActivity}>
          <Flex direction={'column'} gap={3}>
            <Form action={'/switch-state/availability'} method={'POST'}>
              <LineItem title={'Internet Available'}>
                <Switch
                  name={'internetAvailable'}
                  defaultChecked={data.switchState.internetAvailable}
                  onChange={handleAvailabilityChange}
                ></Switch>
              </LineItem>
            </Form>
            <LineItem title={'Next Shutoff'}>
              <Form action={'/switch-state/schedule'} method={'POST'}>
                <Input
                  type={'datetime-local'}
                  name={'localShutoffTime'}
                  value={formatDateTime(new Date(data.switchState.nextShutoff))}
                  onChange={handleScheduleChange}
                />
                <Input type={'hidden'} name={'nextShutoffTime'} id={'nextShutoffTime'} />
              </Form>
            </LineItem>
            <LineItem title={''}>
              <Flex direction={'row'} gap={3}>
                <Form action={'/switch-state/skip-day'} method={'POST'}>
                  <Button type={'submit'} colorScheme={'blue'}>
                    Skip Day
                  </Button>
                </Form>
                <Form action={'/switch-state/add-fifteen-minutes'} method={'POST'}>
                  <Button type={'submit'} colorScheme={'blue'}>
                    Add 15 minutes
                  </Button>
                </Form>
              </Flex>
            </LineItem>
          </Flex>
        </ContentCard>
        <ContentCard title={'Task History'} icon={FiWatch}>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Logs</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Code>{logData}</Code>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <DataTable data={data.switchState.history} columns={historyColumns}></DataTable>
        </ContentCard>
      </Flex>
    </Box>
  );
}
