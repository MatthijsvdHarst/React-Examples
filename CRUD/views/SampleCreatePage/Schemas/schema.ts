import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    sampleId: {
      type: 'string',
    },
    type: {
      type: 'string',
      oneOf: [
        { const: 'full shift', title: 'Full shift' },
        { const: 'excursion', title: 'Excursion' },
        { const: 'short term', title: ' Short term' },
        { const: 'grab sample', title: ' Grab sample' },
      ],
    },
    equipment: {
      type: 'string',
    },
    calibratedWith: {
      type: 'string',
    },
    sampler: {
      type: 'string',
    },
    surveyMoment: {
      type: 'object',
    },
    constituents: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
        },
      },
    },
    noise: {
      type: 'object',
      properties: {
        acghiNoishDba: {
          type: 'string',
        },
        acghiNoishDose: {
          type: 'string',
        },
        oshaHcpDba: {
          type: 'string',
        },
        oshaHcpDose: {
          type: 'string',
        },
        oshaPelDba: {
          type: 'string',
        },
        oshaPelDose: {
          type: 'string',
        },
      },
    },
    notApplicableAcghiNoish: {
      type: 'boolean',
    },
    notApplicableOshaHcp: {
      type: 'boolean',
    },
    notApplicableOshaPel: {
      type: 'boolean',
    },
    startTime: {
      type: 'string',
    },
    initialFlowRate: {
      type: 'string',
    },
    chemical: {
      type: 'boolean',
    },
    twaCalculationMethod: {
      type: 'string',
    },
  },
  required: ['sampleId'],
};
