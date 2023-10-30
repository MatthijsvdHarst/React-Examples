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
  FORM_STATUS,
  RECORD_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import {
  ISample,
  useGetSampleByIdQuery,
  useUpdateSampleMutation,
} from '../../api';
import { schema, uiSchema } from './Schemas';
import { useCallback, useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { PageNotFound, TransitionsModal } from '@tes/ui/core';
import { FormTheme } from '@tes/ui/form';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { extraRenderers } from '@tes/jsonforms-extensions';

export function SampleFinishPage() {
  const { sampleId = '' } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<
    Partial<ISample & { flowRate: number; isChemical: boolean }>
  >({});
  const [open, setOpen] = useState<boolean>(true);

  const { record, recordStatus } = useRecord({
    givenId: sampleId,
    useRecordQuery: useGetSampleByIdQuery,
  });

  const { jsonformProps, formStatus } = useForm({
    schema,
    uischema: uiSchema,
    recordStatus,
    isNewRecord: !sampleId,
    data,
    setData,
    extraRenderers,
  });

  const submitSuccessHandler = useCallback(
    (successData) => {
      if (!successData) {
        return;
      }
      navigate(-1);
    },
    [navigate],
  );

  const { submissionStatus, onFormSubmit } = useSubmitHandler({
    isNewRecord: !sampleId,
    data: {
      constituents: data.constituents,
      endTime: data?.endTime,
      finalFlowRate: `${data?.flowRate}`,
      surveyMoment: data.surveyMoment,
    },
    recordId: sampleId,
    submitSuccessHandler,
    useUpdateMutation: useUpdateSampleMutation,
  });

  useEffect(() => {
    if (recordStatus !== RECORD_STATUS.SUCCEEDED) {
      return;
    }

    if (!record) {
      return;
    }

    setData({
      ...record,
      flowRate: parseInt(record.finalFlowRate),
      isChemical: record.equipment.model.equipmentType === 'chemical',
    });
  }, [record, recordStatus]);

  return (
    <>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}

      {recordStatus === RECORD_STATUS.LOADING && (
        <Box
          sx={{
            position: 'fixed',
            top: 'calc(50% - 48px)',
            left: 'calc(50% - 48px)',
          }}
        >
          <CircularProgress />
        </Box>
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

      {formStatus === FORM_STATUS.SUCCEEDED && jsonformProps && (
        <Modal
          open={true}
          onClose={(_event, reason) => {
            if (reason === 'escapeKeyDown') {
              navigate(-1);
            }
          }}
          aria-labelledby={`${record?.sampleId}-modal-title`}
          aria-describedby={`${record?.sampleId}-modal-description`}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'calc(100% - 32px)',
              maxWidth: '720px',
              height: '80%',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              overflow: 'auto',
            }}
          >
            <AppBar color="primary" elevation={0}>
              <Toolbar
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography variant="h5" color="#fff">
                  Finish sample
                </Typography>
                <IconButton onClick={() => navigate(-1)}>
                  <CloseIcon sx={{ fill: '#fff' }} />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Box mb={6} />
            <form onSubmit={onFormSubmit}>
              <FormTheme>
                <JsonForms {...jsonformProps} />
              </FormTheme>
              <Box mt={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained">
                  Finish
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      )}
    </>
  );
}
