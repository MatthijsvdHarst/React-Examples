import { Box, Button, Divider, Typography } from '@mui/material';
import { ISampleResultListItem, ISampleResultNoiseListItem } from '../../api';

interface IProps {
  title: string;
  subtitle: string;
  equipment: string;
  equipmentSerial: string;
  // sampleMedia: string;
  calibrator: string;
  constituents: Array<string>;
  status: string;
  startTime: string;
  lastCheck: string;
  initialFlowRate: string;
  finalFlowRate: string;
  endTime: string;
  twa: string;
  onClickEdit: () => void;
  onClickRegister: () => void;
  onClickFinish: () => void;
  onClickResult: () => void;
  hasEndTime?: boolean;
  resultCount?: number;
  resultItemList?: Array<ISampleResultListItem | ISampleResultNoiseListItem>;
  sampleType?: string;
  onClickDownload: () => void;
  constituentsList: Array<{ id: string; title: string }>;
  averageFlowRate: string;
  type: string;
  durationInMinutes: string;
}

export type SampleDetailProps = IProps;

export function SampleDetail(props: IProps) {
  const {
    title,
    subtitle,
    equipment,
    equipmentSerial,
    calibrator,
    constituents,
    status,
    startTime,
    lastCheck,
    initialFlowRate,
    finalFlowRate,
    onClickEdit,
    onClickFinish,
    endTime,
    twa,
    hasEndTime,
    onClickResult,
    resultCount,
    resultItemList,
    sampleType,
    constituentsList,
    averageFlowRate,
    type,
    durationInMinutes,
  } = props;

  return (
    <Box>
      <Box>
        <Box>
          <Typography
            variant={'h4'}
            sx={{
              lineHeight: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {title}
            <Box>
              <Button
                variant="contained"
                onClick={onClickFinish}
                sx={{
                  maxWidth: '400px',
                  backgroundColor: '#FCE7E7',
                  color: '#FF6651',

                  '&:hover,&:focus': {
                    backgroundColor: '#FF6651',
                    color: '#FCE7E7',
                  },
                  mr: 3,
                }}
              >
                {!hasEndTime ? `Finish sample` : `Edit finish sample`}
              </Button>
              <Button variant={'contained'} onClick={onClickResult}>
                {resultCount !== 0 ? `Edit results` : `Add results`}
              </Button>
            </Box>
          </Typography>
          <Typography variant={'subtitle1'}>
            {`Sample type: ${type}`}
          </Typography>
          <Typography variant={'subtitle1'}>
            {`Subject: ${subtitle}`}
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box>
          <Typography variant={'h6'}>{equipment}</Typography>
          <Typography variant={'body1'}>
            {`Serial: ${equipmentSerial}`}
          </Typography>
          <Typography variant={'body1'}>
            {`Calibrated using: ${calibrator}`}
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box>
          <Typography variant={'h6'}>Constituents</Typography>
          <Typography variant={'body1'}>
            {constituents.map((constituent, i) => (
              <span key={i}>
                {i > 0 && ', '}
                {constituent}
              </span>
            ))}
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box>
          <Typography variant={'h6'}>{`Current status: ${status}`}</Typography>
          <Typography variant={'body1'}>
            {`Start time:
              ${startTime}
            `}
          </Typography>
          <Typography variant={'body1'}>{`Endtime: ${endTime}`}</Typography>
          <Typography
            variant={'body1'}
          >{`Total time: ${durationInMinutes} minutes`}</Typography>
          <Typography variant={'body1'}>{lastCheck}</Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box>
          <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
            TWA methode
          </Typography>
          <Typography
            variant={'body1'}
            sx={{ mb: 2 }}
          >{`TWA: ${twa}`}</Typography>
          <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
            Flow rate
          </Typography>
          <Typography variant={'body1'}>
            {sampleType === 'noise' &&
              `Initial calibration" (dBA): ${initialFlowRate}`}
            {sampleType === 'chemical' &&
              `Initial flowrate: ${initialFlowRate} L/min`}
          </Typography>
          <Typography variant={'body1'}>
            {sampleType === 'noise' &&
              `Final calibration" (dBA): ${finalFlowRate}`}
            {sampleType === 'chemical' &&
              `Final flowrate: ${finalFlowRate} L/min`}
          </Typography>
          <Typography variant={'body1'}>
            {sampleType === 'noise' &&
              `Average calibration" (dBA): ${averageFlowRate}`}
            {sampleType === 'chemical' &&
              `Average flowrate: ${averageFlowRate} L/min`}
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
        <>
          <Box>
            <Typography mb={2} variant={'h6'}>
              Sample results
            </Typography>
            {sampleType === 'chemical'
              ? resultItemList &&
                resultCount !== 0 &&
                (resultItemList as unknown as Array<ISampleResultListItem>).map(
                  (item, index) => {
                    const constituentTitle = constituentsList.find(
                      (constituentItem) =>
                        constituentItem.id === item.constituent,
                    );
                    return (
                      <Box mb={2}>
                        <Typography
                          sx={{ fontWeight: 'bold' }}
                          variant={'subtitle1'}
                        >
                          {constituentTitle?.title}
                        </Typography>
                        <Typography variant={'body1'}>
                          {`TWA Result: ${item.twaResult}`}
                        </Typography>
                        <Typography variant={'body1'}>
                          {`Method: ${item.method}`}
                        </Typography>
                        <Typography variant={'body1'}>
                          {`Volume: ${item.volume} L`}
                        </Typography>
                        <Typography variant={'body1'}>
                          {`Total: ${item.total}`}
                        </Typography>
                        <Typography variant={'body1'}>
                          {`Occupational Exposure Limits: ${item.oel}`}
                        </Typography>
                        <Typography variant={'body1'}>
                          {`Lod Sr 2: ${item.lodSr2}`}
                        </Typography>
                        <Typography variant={'body1'}>
                          {`Report limit: ${item.reportLimit}`}
                        </Typography>
                        {index <= 1 ? <Divider sx={{ my: 3 }} /> : null}
                      </Box>
                    );
                  },
                )
              : resultItemList &&
                resultCount !== 0 &&
                (
                  resultItemList as unknown as Array<ISampleResultNoiseListItem>
                ).map((item) => (
                  <Box sx={{ display: 'flex', flexFlow: 'row wrap' }}>
                    <Box sx={{ display: 'inline-block', width: '33%', mb: 1 }}>
                      <Box>
                        <Typography
                          variant={'body1'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          ACGIH/Niosh (dBA):
                        </Typography>
                        <Typography variant={'body1'}>
                          {item.acgihNoishDba}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant={'body1'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          ACGIH/Niosh (Dose%):
                        </Typography>
                        <Typography variant={'body1'}>
                          {item.acgihNoishDose}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'inline-block', width: '33%', mb: 1 }}>
                      <Box>
                        <Typography
                          variant={'body1'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          OSHA HCP (dBA):
                        </Typography>
                        <Typography variant={'body1'}>
                          {item.oshaHcpDba}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant={'body1'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          OSHA HCP (Dose%):
                        </Typography>
                        <Typography variant={'body1'}>
                          {item.oshaHcpDose}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'inline-block', width: '33%', mb: 1 }}>
                      <Box>
                        <Typography
                          variant={'body1'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          OSHA PEL (dBA):
                        </Typography>
                        <Typography variant={'body1'}>
                          {item.oshaPelDba}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant={'body1'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          OSHA PEL (Dose%):
                        </Typography>
                        <Typography variant={'body1'}>
                          {item.oshaPelDose}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'inline-block', width: '33%' }}>
                      <Box>
                        <Typography
                          variant={'body1'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          Las Max (dBa):
                        </Typography>
                        <Typography variant={'body1'}>
                          {item.lasMaxDba}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
          </Box>
        </>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            color={'secondary'}
            variant={'contained'}
            onClick={onClickEdit}
          >
            Edit Sample
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
