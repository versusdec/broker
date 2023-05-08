import PropTypes from 'prop-types';
import {Box, Stack} from '@mui/material';
import {SideNavItem} from './side-nav-item';
import {useMe} from "../../../hooks/useMe";
import {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {api} from "../../../api";

const renderItems = ({depth = 0, items, pathname, role}) => items.reduce((acc, item) => reduceChildRoutes({
  acc,
  depth,
  item,
  pathname,
  role
}), []);

const reduceChildRoutes = ({acc, depth, item, pathname, role}) => {
  const checkPath = !!(item.path && pathname);
  const partialMatch = (checkPath ? pathname.includes(item.path) : false) ||  (checkPath ? (item.path === '/:project' && Number.isInteger(+pathname.split('/')[1])) : false);
  const exactMatch = checkPath ? pathname === item.path : false;
  
  if (item.items) {
    item.role.includes(role) && !item.hidden && acc.push(
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
            role: role,
            pathname
          })}
        </Stack>
      </SideNavItem>
    );
  } else {
    item.role.includes(role) && !item.hidden && acc.push(
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
  const {user} = useMe();
  const role = user && user.role;
  return role && (
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
      {renderItems({items, pathname, role})}
    </Stack>
  );
};

SideNavSection.propTypes = {
  items: PropTypes.array,
  pathname: PropTypes.string,
  subheader: PropTypes.string
};
