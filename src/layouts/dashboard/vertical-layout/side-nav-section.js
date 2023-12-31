import PropTypes from 'prop-types';
import {Box, Stack} from '@mui/material';
import {SideNavItem} from './side-nav-item';
import {useMe} from "../../../hooks/useMe";
import {useGrants} from "../../../hooks/useGrants";

const renderItems = ({depth = 0, items, pathname, grants, isAdmin}) => items.reduce((acc, item) => reduceChildRoutes({
  acc,
  depth,
  item,
  pathname,
  grants,
  isAdmin
}), []);

const checkExact = (pathname, itemPath) => {
  const section = pathname.split('/')[1] ?? false;

  if (pathname === itemPath) {
    return true;
  }
  
  switch (section) {
    case 'users':
      return pathname === itemPath
    default: void 0;
  }
  
  if (!Number.isInteger(+section)) {
    return pathname.split('/')[1] === itemPath.split('/')[1]
  }
}

const reduceChildRoutes = ({acc, depth, item, pathname, grants, isAdmin}) => {
  const checkPath = !!(item.path && pathname);
  const isId = +pathname.split('/')[1] !== 0 && Number.isInteger(+pathname.split('/')[1]);
  const partialMatch = checkPath ? (pathname.includes(item.path) || isId) : false;
  let exactMatch = checkPath ? checkExact(pathname, item.path) : false;

  if (item.items) {
    (item.grants ? (isAdmin || grants.includes(item.grants)) : true) && !item.hidden && acc.push(
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
            isAdmin: isAdmin,
            grants: grants,
            pathname
          })}
        </Stack>
      </SideNavItem>
    );
  } else {
    (item.grants ? (isAdmin || grants.includes(item.grants)) : true) && !item.hidden && acc.push(
      <SideNavItem
        active={exactMatch}
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
  const isAdmin = data && data.role === 'admin';
  const grants = useGrants(data?.role_id);

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
