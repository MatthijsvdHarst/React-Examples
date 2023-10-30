// VerticalLayout
// HorizontalLayout

export const uiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label: 'Sample details',
      elements: [
        {
          type: 'Control',
          label: 'Sample ID',
          scope: '#/properties/sampleId',
        },
        {
          type: 'Control',
          label: 'Sampler name',
          scope: '#/properties/sampler',
        },
        {
          type: 'Control',
          label: 'Sample type',
          scope: '#/properties/type',
          options: {
            format: 'radio',
          },
        },
      ],
    },
    {
      type: 'Group',
      label: 'IH sample equipment',
      elements: [
        {
          type: 'Control',
          label: 'IH Equipment',
          scope: '#/properties/equipment',
        },
        {
          type: 'Control',
          scope: '#/properties/calibratedWith',
        },
      ],
    },
    {
      type: 'Group',
      elements: [
        {
          type: 'ApiSearchControl',
          label: 'Constituents of concern',
          scope: '#/properties/constituents',
        },
      ],
    },
    {
      type: 'Group',
      label: 'Measurements data',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              label: 'Start time',
              scope: '#/properties/startTime',
              options: {
                format: 'time',
                ampm: true,
                clearLabel: 'Clear it!',
                cancelLabel: 'Abort',
                okLabel: 'Do it',
              },
            },
          ],
        },
        {
          type: 'Control',
          label: 'Initial calibration" (dBA)',
          scope: '#/properties/initialFlowRate',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/chemical',
              schema: {
                const: false,
              },
            },
          },
        },
        {
          type: 'InputAdornment',
          label: 'Initial Flowrate',
          scope: '#/properties/initialFlowRate',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/chemical',
              schema: {
                const: true,
              },
            },
          },
          options: {
            endAdornment: 'L/min',
            endAdornmentFormat: 'plaintext',
          },
        },
        {
          type: 'Control',
          scope: '#/properties/twaCalculationMethod',
          label: 'TWA Calculation Method',
          options: {
            format: 'radio',
          },
        },
      ],
    },
  ],
};
