import { useNavigate } from 'react-router';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Button } from '@tes/ui/core';
import { ISampleListItem } from '../../api';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface IProps {
  item: ISampleListItem;
}

export type SampleListItemProps = IProps;

export function SampleListItem(props: IProps) {
  const { item } = props;
  const navigate = useNavigate();

  const listOfConst = useMemo(
    () => item.constituents.reduce((acc, { title }) => acc + `${title}, `, ''),
    [item.constituents],
  );

  const lastCheck = useMemo(() => {
    if (item.checkins.length === 0) {
      return;
    }

    return item.checkins[0];
  }, [item.checkins]);

  const stateDate = dayjs(item.surveyMoment.startDate + item.startTime);

  return (
    <Card key={item.id} sx={{ mt: 3, width: '100%', boxShadow: 'none', pb: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mr: 2 }}>
            #{item.sampleId}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem' }} variant="body2">
            {item.equipment.model}
          </Typography>
        </Box>
        <Button onClick={() => navigate(`./sample/${item.id}/`)}>
          Open sample
        </Button>
      </Box>
      <CardContent sx={{ py: 0 }}>
        <List>
          <ListItem sx={{ p: 0 }}>
            <ListItemText
              sx={{ lineHeight: 1, my: '2px' }}
              secondary={'Constituents: ' + listOfConst}
            />
          </ListItem>
          <ListItem sx={{ p: 0 }}>
            <ListItemText
              sx={{ lineHeight: 1, my: '2px' }}
              secondary={`Start time: ${stateDate.format(
                'hh:mm a',
              )}. (${stateDate.fromNow()})`}
            />
          </ListItem>
          <ListItem sx={{ p: 0 }}>
            <ListItemText
              sx={{ lineHeight: 1, my: '2px' }}
              secondary={
                lastCheck
                  ? `Last check: ${dayjs(lastCheck.createdAt).format(
                      'D MMMM YYYY, hh:mm a',
                    )} (${dayjs(lastCheck.createdAt).fromNow()})`
                  : 'Last check: Has not been checked'
              }
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
