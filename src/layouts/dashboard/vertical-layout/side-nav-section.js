import PropTypes from 'prop-types';
import {Box, Stack} from '@mui/material';
import {SideNavItem} from './side-nav-item';
import {useMe} from "../../../hooks/useMe";
import {getGrants} from "../../../utils/get-role-grants";

const renderItems = ({depth = 0, items, pathname, grants, isAdmin}) => items.reduce((acc, item) => reduceChildRoutes({
  acc,
  depth,
  item,
  pathname,
  grants,
  isAdmin
}), []);

const reduceChildRoutes = ({acc, depth, item, pathname, grants, isAdmin}) => {
  const checkPath = !!(item.path && pathname);
  const partialMatch = checkPath ? (pathname.includes(item.path) || Number.isInteger(+pathname.split('/')[1])) : false;
  const exactMatch = checkPath ? !Number.isInteger(+pathname.split('/')[1]) ? (pathname === item.path || (pathname.split('/')[1] === item.path.split('/')[1])) : false : false;
  //todo write normal check for project inner route (too long oneline =()
  if (item.items) {
    (isAdmin || item.grants?.includes(grants)) && !item.hidden && acc.push(
      <SideNavItem
        active={partialMatch}
        depth={depth}
        disabled={item.disabled}
        icon={item.icon}
        key={item.title}
        label={item.label}
        open={partialMatch}
        path={item.path}
        title={item.title}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: 'none',
            m: 0,
            p: 0
          }}
        >
          {renderItems({
            depth: depth + 1,
            items: item.items,
            grants: grants,
            pathname
          })}
        </Stack>
      </SideNavItem>
    );
  } else {
    (isAdmin || item.grants?.includes(grants)) && !item.hidden && acc.push(
      <SideNavItem
        active={exactMatch || (Number.isInteger(+pathname.split('/')[1]) && item.path.split('/')[2]?.length && (item.path.split('/')[2] === pathname.split('/')[2]))}
        depth={depth}
        disabled={item.disabled}
        icon={item.icon}
        key={item.title}
        label={item.label}
        path={item.path}
        title={item.title}
      />
    );
  }
  
  return acc;
};

export const SideNavSection = (props) => {
  const {items = [], pathname, subheader = '', ...other} = props;
  const {data} = useMe();
  const isAdmin = data && data.role_id === 0;
  const grants = getGrants(data?.role_id);
  
  return (
    <Stack
      component="ul"
      spacing={0.5}
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0
      }}
      {...other}>
      {subheader && (
        <Box
          component="li"
          sx={{
            color: 'var(--nav-section-title-color)',
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.66,
            mb: 1,
            ml: 1,
            textTransform: 'uppercase'
          }}
        >
          {subheader}
        </Box>
      )}
      {renderItems({items, pathname, grants, isAdmin})}
    </Stack>
  );
};

SideNavSection.propTypes = {
  items: PropTypes.array,
  pathname: PropTypes.string,
  subheader: PropTypes.string
};
