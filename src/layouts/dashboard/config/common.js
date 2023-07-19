import {SvgIcon} from '@mui/material';
import {tokens} from '../../../locales/tokens';
import {paths} from '../../../navigation/paths';
import {
  Dashboard,
  PortraitOutlined,
  QuestionAnswerOutlined,
  PeopleAltOutlined,
  CreditCardOutlined,
  LayersOutlined,
  TableRowsOutlined
} from '@mui/icons-material';
import {useRoles} from "../../../hooks/useRoles";


export const getSections = (t, roles) => {
  const r = [
    {
      title: t(tokens.nav.staff.all),
      path: paths.users.index,
      grants: 'users.read',
    }
  ]
  
  roles?.map(item => {
    r.push({
      title: item.name,
      path: paths.users.index + item.name + `/${item.id}/`,
      grants: 'users.read',
    })
  })
  
  return [
    {
      items: [
        {
          title: t(tokens.nav.overview),
          path: paths.index,
          hidden: false,
          icon: (
            <SvgIcon fontSize="small">
              <Dashboard/>
            </SvgIcon>
          )
        },
        /*{
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
        },*/
        {
          title: t(tokens.nav.projects),
          path: paths.projects.index,
          grants: 'projects.read',
          icon: (
            <SvgIcon fontSize="small">
              <LayersOutlined/>
            </SvgIcon>
          )
        },
        {
          title: t(tokens.nav.roles),
          path: paths.roles.index,
          grants: 'roles.read',
          icon: (
            <SvgIcon fontSize="small">
              <PeopleAltOutlined/>
            </SvgIcon>
          )
        },
        {
          title: t(tokens.nav.staff.index),
          path: paths.users.index,
          grants: 'users.read',
          icon: (
            <SvgIcon fontSize="small">
              <TableRowsOutlined/>
            </SvgIcon>
          ),
          items: r
        },
        {
          title: t(tokens.nav.account),
          path: paths.account,
          hidden: true,
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
