import {SvgIcon} from '@mui/material';
import {tokens} from '../../../locales/tokens';
import {paths} from '../../../navigation/paths';
import {
  Dashboard,
  PortraitOutlined,
  QuestionAnswerOutlined,
  PeopleAltOutlined,
  LibraryBooksOutlined,
  CreditCardOutlined
} from '@mui/icons-material';


export const getSections = (t, project) => {

  return [
    {
      items: [
        {
          title: t(tokens.nav.dashboard),
          path: paths.index,
          hidden: true,
          role: ['admin', 'client', 'supervisor', 'operator'],
          icon: (
            <SvgIcon fontSize="small">
              <Dashboard/>
            </SvgIcon>
          )
        },
        {
          title: project?.name,
          path: paths.project.index,
          role: ['admin', 'client'],
          hidden: !Boolean(project),
          icon: (
            <SvgIcon fontSize="small">
              <Dashboard/>
            </SvgIcon>
          ),
          items: [
            {
              title: t(tokens.common.edit),
              role: ['admin', 'client'],
              path: `/${project?.id}`,
            },
          ]
        },
        {
          title: t(tokens.nav.projects),
          path: paths.projects.index,
          role: ['admin', 'client', 'supervisor'],
          icon: (
            <SvgIcon fontSize="small">
              <LibraryBooksOutlined/>
            </SvgIcon>
          )
        },
        {
          title: t(tokens.nav.users),
          path: paths.users.index,
          role: ['admin', 'client', 'supervisor'],
          icon: (
            <SvgIcon fontSize="small">
              <PeopleAltOutlined/>
            </SvgIcon>
          )
        },
        {
          title: t(tokens.nav.account),
          path: paths.account,
          role: ['admin', 'client', 'supervisor', 'operator'],
          icon: (
            <SvgIcon fontSize="small">
              <PortraitOutlined/>
            </SvgIcon>
          )
        },
        {
          title: t(tokens.nav.support),
          path: paths.support,
          role: ['admin', 'client', 'supervisor', 'operator'],
          icon: (
            <SvgIcon fontSize="small">
              <QuestionAnswerOutlined/>
            </SvgIcon>
          )
        },
        {
          title: t(tokens.nav.billing),
          path: paths.billing,
          role: ['admin', 'client', 'supervisor', 'operator'],
          icon: (
            <SvgIcon fontSize="small">
              <CreditCardOutlined/>
            </SvgIcon>
          )
        },
    
    
      ]
    },
  ];
}
