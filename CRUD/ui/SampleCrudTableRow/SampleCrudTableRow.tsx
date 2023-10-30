import { TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ISampleListItem } from '../../api';

interface IProps {
  item: ISampleListItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string | number) => void;
}

export type SampleCrudTableRowProps = IProps;

const useStyles = makeStyles(({ palette }) => ({
  link: {
    textDecoration: 'none',
    color: palette.text.secondary,
  },
}));

export function SampleCrudTableRow(props: IProps) {
  const classes = useStyles();
  const { item } = props;
  return (
    <>
      <TableCell>
        <Link
          to={`/project-dashboard/${item.surveyMoment.project}/survey-dashboard/sample/${item.id}/?project=${item.surveyMoment.project}&startDate=${item.surveyMoment.startDate}`}
          className={classes.link}
        >
          # {item.sampleId}
        </Link>
      </TableCell>
      <TableCell>
        <Link
          to={`/project-dashboard/${item.surveyMoment.project}/survey-dashboard/sample/${item.id}/?project=${item.surveyMoment.project}&startDate=${item.surveyMoment.startDate}`}
          className={classes.link}
        >
          {item.sampler}
        </Link>
      </TableCell>
      <TableCell>
        <Link
          to={`/project-dashboard/${item.surveyMoment.project}/survey-dashboard/sample/${item.id}/?project=${item.surveyMoment.project}&startDate=${item.surveyMoment.startDate}`}
          className={classes.link}
        >
          {format(new Date(item.surveyMoment.startDate), 'MMM dd, y')}
        </Link>
      </TableCell>
    </>
  );
}
