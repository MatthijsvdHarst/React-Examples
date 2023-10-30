export const uiSchema = {
  type: 'Group',
  label: 'Finish information',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          label: 'End time',
          scope: '#/properties/endTime',
          options: {
            format: 'time',
            ampm: true,
            clearLabel: 'Clear it!',
            cancelLabel: 'Abort',
            okLabel: 'Do it',
          },
        },
        {
          type: 'Control',
          label: 'Final calibration" (dBA)',
          scope: '#/properties/flowRate',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/isChemical',
              schema: {
                const: false,
              },
            },
          },
        },
        {
          type: 'InputAdornment',
          label: 'Final Flowrate',
          scope: '#/properties/flowRate',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/isChemical',
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
      ],
    },
  ],
};
