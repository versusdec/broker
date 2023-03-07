import {SvgIcon} from '@mui/material';
import {tokens} from '../../locales/tokens';
import {paths} from '../../navigation/paths';
import {
  Dashboard,
  PortraitOutlined,
  QuestionAnswerOutlined,
  PeopleAltOutlined
} from '@mui/icons-material';

export const getSections = (t) => [
  {
    items: [
      {
        title: t(tokens.nav.dashboard),
        path: paths.index,
        icon: (
          <SvgIcon fontSize="small">
            <Dashboard/>
          </SvgIcon>
        )
      },
            {
        title: t(tokens.nav.users),
        path: paths.users.index,
        icon: (
          <SvgIcon fontSize="small">
            <PeopleAltOutlined/>
          </SvgIcon>
        )
      },
      {
        title: t(tokens.nav.account),
        path: paths.account,
        icon: (
          <SvgIcon fontSize="small">
            <PortraitOutlined/>
          </SvgIcon>
        )
      },
      {
        title: t(tokens.nav.support),
        path: paths.support,
        icon: (
          <SvgIcon fontSize="small">
            <QuestionAnswerOutlined />
          </SvgIcon>
        )
      },
      
    ]
  },

];
