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
  ConstituentsContext,
  FORM_STATUS,
  RECORD_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import {
  ISample,
  ISampleListItemPayload,
  useCreateSampleMutation,
  useGetAllConstituentsQuery,
  useGetSampleByIdQuery,
  useUpdateSampleMutation,
} from '../../api';
import { schema, uiSchema } from './Schemas';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { TransitionsModal } from '@tes/ui/core';
import { FormTheme } from '@tes/ui/form';
import { DYNAMIC_FORM_STATUS, useDynamicFormElements } from '../../hooks';
import {
  ChevronLeft as ChevronLeftIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sampleActions } from '../../sample.slice';
import { extraRenderers } from '@tes/jsonforms-extensions';

export function SampleCreatePage() {
  const { surveyMoment } = useOutletContext<{
    surveyMoment: {
      project: string;
      startDate: string;
    };
  }>();
  const dispatch = useDispatch();
  const { updateNeedsRefetch } = sampleActions;

  const {
    id = '',
    step = '',
    subjectId = '',
    subject = '',
    sampleId = '',
  } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<
    Partial<ISampleListItemPayload & { chemical: boolean }>
  >({});
  const [open, setOpen] = useState<boolean>(true);

  const { record, recordStatus } = useRecord({
    givenId: sampleId,
    useRecordQuery: useGetSampleByIdQuery,
  });

  useEffect(() => {
    if (!subjectId) {
      return;
    }

    if (!surveyMoment) {
      return;
    }

    if (subject === 'person') {
      setData((prevState) => ({
        ...prevState,
        surveyMoment: surveyMoment,
        personSampleSubject: subjectId,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        surveyMoment: surveyMoment,
        areaSampleSubject: subjectId,
      }));
    }
  }, [subject, subjectId, surveyMoment]);

  const {
    jsonformProps: baseJsonformProps,
    formStatus,
    hasFormErrors,
  } = useForm({
    schema,
    uischema: uiSchema,
    recordStatus: RECORD_STATUS.SUCCEEDED,
    isNewRecord: !sampleId,
    record,
    data,
    setData,
    extraRenderers,
  });

  const { jsonformProps, dynamicFormStatus } = useDynamicFormElements({
    baseJsonformProps,
    setData,
    data,
    record,
  });

  const submitSuccessHandler = useCallback(
    (successData) => {
      if (!successData) {
        return;
      }
      setData({});
      navigate(-1);
      dispatch(updateNeedsRefetch({ needsRefetch: true }));
    },
    [dispatch, navigate, updateNeedsRefetch],
  );

  const dataEquipment = useMemo(() => {
    if (!data.equipment) {
      return;
    }

    if (typeof data.equipment === 'object') {
      return data.equipment;
    }

    if (!data.equipment?.split('|')) {
      return;
    }

    return data.equipment.split('|')[0].trim();
  }, [data?.equipment]);

  const equipmentType = useMemo(() => {
    if (!data.equipment) {
      return undefined;
    }

    if (typeof data.equipment === 'object') {
      return (data as unknown as ISample).equipment.model.equipmentType;
    }

    if (!data.equipment?.includes('|')) {
      return undefined;
    }

    return data.equipment?.split('|')[1].trim();
  }, [data]);

  useEffect(() => {
    if (!equipmentType) {
      return;
    }

    setData((prevState) => ({
      ...prevState,
      chemical: equipmentType === 'chemical',
      twaCalculationMethod: record?.twaCalculationMethod?.id,
    }));
  }, [equipmentType, record?.twaCalculationMethod?.id]);

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord: !sampleId,
    data: { ...data, equipment: dataEquipment ? dataEquipment : '' },
    recordId: sampleId,
    submitSuccessHandler,
    useCreateMutation: useCreateSampleMutation,
    useUpdateMutation: useUpdateSampleMutation,
  });

  return (
    <>
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
          errorList={
            submissionError?.data as { [key: string]: [string] } | null
          }
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

      {formStatus === FORM_STATUS.SUCCEEDED &&
        jsonformProps &&
        dynamicFormStatus === DYNAMIC_FORM_STATUS.SUCCEEDED && (
          <Modal
            open={true}
            onClose={(_event, reason) => {
              if (reason === 'escapeKeyDown') {
                navigate(`/project-dashboard/${id}/${step}`);
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
                maxWidth: '900px',
                height: 'calc(100% - 24px)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                overflow: 'auto',
              }}
            >
              <AppBar color="primary" elevation={0} position="sticky">
                <Toolbar
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Button
                    onClick={() => navigate(-1)}
                    sx={{ pl: 0, textTransform: 'none' }}
                  >
                    <ChevronLeftIcon sx={{ color: '#fff' }} />
                    <Typography variant="h5" color="#fff">
                      {!sampleId ? `Add sample` : `Update sample`}
                    </Typography>
                  </Button>
                  <IconButton
                    onClick={() => navigate(`/project-dashboard/${id}/${step}`)}
                  >
                    <CloseIcon sx={{ fill: '#fff' }} />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Box sx={{ mx: 4, mb: 2 }}>
                <ConstituentsContext.Provider
                  value={{
                    constituentType: equipmentType,
                    useGetAllQuery: useGetAllConstituentsQuery,
                  }}
                >
                  <form onSubmit={onFormSubmit}>
                    <FormTheme>
                      <JsonForms {...jsonformProps} />
                    </FormTheme>
                    <Box
                      mt={3}
                      sx={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={hasFormErrors}
                      >
                        {!sampleId ? `Create new sample` : `Update sample`}
                      </Button>
                    </Box>
                  </form>
                </ConstituentsContext.Provider>
              </Box>
            </Box>
          </Modal>
        )}
    </>
  );
}
