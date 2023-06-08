import {SvgIcon} from '@mui/material';
import {tokens} from '../../../locales/tokens';
import {paths} from '../../../navigation/paths';
import {
  Dashboard,
  PortraitOutlined,
  QuestionAnswerOutlined,
  PeopleAltOutlined,
  LibraryBooksOutlined,
  CreditCardOutlined, Groups2Outlined
} from '@mui/icons-material';


export const getSections = (t, project) => {

  return [
    {
      items: [
        {
          title: t(tokens.nav.dashboard),
          path: paths.index,
          hidden: true,
          icon: (
            <SvgIcon fontSize="small">
              <Dashboard/>
            </SvgIcon>
          )
        },
        {
          title: project?.name,
          path: paths.project.index,
          hidden: !Boolean(project),
          icon: (
            <SvgIcon fontSize="small">
              <Dashboard/>
            </SvgIcon>
          ),
          items: [
            {
              title: t(tokens.common.edit),
              grants: 'projects.write',
              path: `/${project?.id}`,
            },
            {
              title: t(tokens.nav.queues),
              grants: 'projects.queues.read',
              path: `/${project?.id}/queues`,
            },
             {
              title: t(tokens.nav.scripts),
              grants: 'projects.scripts.read',
              path: `/${project?.id}/scripts`,
            },
            
          ]
        },
        {
          title: t(tokens.nav.projects),
          path: paths.projects.index,
          grants: 'projects.read',
          icon: (
            <SvgIcon fontSize="small">
              <LibraryBooksOutlined/>
            </SvgIcon>
          )
        },
        {
          title: t(tokens.nav.users),
          path: paths.users.index,
          grants: 'users.read',
          icon: (
            <SvgIcon fontSize="small">
              <PeopleAltOutlined/>
            </SvgIcon>
          )
        },
        {
          title: t(tokens.nav.roles),
          path: paths.roles.index,
          grants: 'roles.read',
          icon: (
            <SvgIcon fontSize="small">
              <Groups2Outlined/>
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
          hidden: true,
          icon: (
            <SvgIcon fontSize="small">
              <QuestionAnswerOutlined/>
            </SvgIcon>
          )
        },
        {
          title: t(tokens.nav.billing),
          path: paths.billing,
          grants: 'transactions.read',
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
