import { SampleDetail } from '../../ui';
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  SUBMISSION_STATUS,
  useRecord,
  useSubmitHandler,
  mapListResult,
  ISubmissionError,
} from '@tes/utils-hooks';
import {
  useDownloadSamplePDFFileMutation,
  useGetSampleByIdQuery,
  useGetSampleResultByIdQuery,
  useRegisterLastCheckSampleMutation,
} from '../../api';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageNotFound, TransitionsModal } from '@tes/ui/core';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';

export function SampleDetailPage() {
  const { id = '', step = '', sampleId = '' } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(true);
  const [hasError, setHasError] = useState<{
    hasError: boolean;
    errorMessage: null | ISubmissionError;
  }>({ hasError: false, errorMessage: null });

  const { record, refetch } = useRecord({
    givenId: sampleId,
    refetchOnMount: true,
    useRecordQuery: useGetSampleByIdQuery,
  });

  useEffect(() => refetch(), [refetch]);

  const sampleType = useMemo(
    () => record?.equipment.model.equipmentType,
    [record?.equipment.model.equipmentType],
  );

  const response = useGetSampleResultByIdQuery({
    uuid: record?.id,
    type: sampleType,
  });
  const { itemCount, itemList } = mapListResult(response.data);

  const submitSuccessHandler = useCallback(() => {
    refetch();
  }, [refetch]);

  const { submissionStatus, submitHandler } = useSubmitHandler({
    isNewRecord: true,
    data: {
      sample: sampleId,
    },
    recordId: '',
    submitSuccessHandler,
    useCreateMutation: useRegisterLastCheckSampleMutation,
  });

  const [download] = useDownloadSamplePDFFileMutation();

  const onClickDownload = useCallback(() => {
    download(sampleId)
      .unwrap()
      .then(
        (successdata) => {
          setHasError({ hasError: false, errorMessage: successdata });
        },
        (error) => {
          setHasError({ hasError: true, errorMessage: error });
        },
      );
  }, [download, sampleId]);

  const currentStatus = useMemo(() => {
    const currentDateTime = dayjs(new Date());

    if (!record) {
      return 'No record found';
    }

    if (currentDateTime.diff(record.startTime, 'second', true) < 0) {
      return 'Not started';
    } else if (!record.endTime) {
      return 'Running';
    }

    return 'Finished';
  }, [record]);

  const lastCheck = useMemo(() => {
    if (!record) {
      return;
    }

    if (record.checkins.length === 0) {
      return;
    }

    return record.checkins[0];
  }, [record]);

  if (!record) {
    return <PageNotFound />;
  }

  return (
    <>
      {hasError.hasError && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          showButton
          errorList={hasError.errorMessage?.data as { [key: string]: [string] }}
          open={hasError.hasError}
          handleClose={() =>
            setHasError({ hasError: false, errorMessage: null })
          }
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          showButton
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.SAVING && (
        <TransitionsModal
          description={<CircularProgress />}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      <Modal
        open={true}
        onClose={(_event, reason) => {
          if (reason === 'escapeKeyDown') {
            navigate(`/project-dashboard/${id}/${step}`);
          }
        }}
        aria-labelledby="sample-detail-modal-title"
        aria-describedby="sample-detail-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '720px',
            height: 'calc(100% - 64px)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
          }}
        >
          <AppBar color="primary" elevation={0}>
            <Toolbar
              sx={{
                px: '32px !important',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button
                onClick={() => navigate('./edit')}
                sx={{
                  fontSize: '1.25rem',
                  textTransform: 'None',
                }}
              >
                <Typography
                  variant="h6"
                  color="#fff"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {`# ${record.sampleId}`}
                  <EditIcon sx={{ ml: 2 }} />
                </Typography>
              </Button>
              <IconButton
                onClick={() => navigate(`/project-dashboard/${id}/${step}`)}
              >
                <CloseIcon sx={{ color: '#fff' }} />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box mb={6} />

          <SampleDetail
            title={`# ${record.sampleId}`}
            subtitle={record.sampler}
            equipment={record.equipment ? record.equipment.model.title : ''}
            equipmentSerial={record.equipment.serialNumber}
            calibrator={
              record.calibratedWith
                ? `${record.calibratedWith.model.title} ${record.calibratedWith.serialNumber}`
                : ''
            }
            constituents={record.constituents.map((item) => item.title)}
            status={currentStatus}
            startTime={record.startTime}
            lastCheck={
              lastCheck
                ? `Last check: ${dayjs(lastCheck.createdAt).format(
                    'D MMMM YYYY, hh:mm a',
                  )} (${dayjs(lastCheck.createdAt).fromNow()})`
                : 'Last check: Has not been checked'
            }
            initialFlowRate={record.initialFlowRate || ''}
            finalFlowRate={
              record.finalFlowRate
                ? record.finalFlowRate
                : 'No Final calibration" (dBA)'
            }
            endTime={record.endTime ? record.endTime : 'No end time'}
            averageFlowRate={
              record.averageFlowRate
                ? record.averageFlowRate
                : 'No final flowrate or calibration'
            }
            type={record.type}
            durationInMinutes={
              record.durationInMinutes
                ? record.durationInMinutes
                : 'No end time'
            }
            twa={record.twaCalculationMethod?.title || ''}
            onClickEdit={() => navigate('./edit')}
            onClickRegister={() => submitHandler()}
            hasEndTime={!!record.endTime}
            onClickFinish={() => navigate('./finish')}
            onClickResult={() => navigate('./result')}
            resultCount={itemCount}
            resultItemList={itemList}
            sampleType={sampleType}
            onClickDownload={onClickDownload}
            constituentsList={record.constituents}
          />
        </Box>
      </Modal>
    </>
  );
}
