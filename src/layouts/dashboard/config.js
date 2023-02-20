import {SvgIcon} from '@mui/material';
import {tokens} from '../../locales/tokens';
import {paths} from '../../navigation/paths';
import DashboardIcon from '@mui/icons-material/Dashboard'
import PortraitOutlinedIcon from '@mui/icons-material/PortraitOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

export const getSections = (t) => [
  {
    items: [
      {
        title: t(tokens.nav.dashboard),
        path: paths.index,
        icon: (
          <SvgIcon fontSize="small">
            <DashboardIcon/>
          </SvgIcon>
        )
      },
      {
        title: t(tokens.nav.account),
        path: paths.account,
        icon: (
          <SvgIcon fontSize="small">
            <PortraitOutlinedIcon/>
          </SvgIcon>
        )
      },
      {
        title: t(tokens.nav.support),
        path: paths.support,
        icon: (
          <SvgIcon fontSize="small">
            <QuestionAnswerOutlinedIcon />
          </SvgIcon>
        )
      },
      
    ]
  },

];
