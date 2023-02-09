import { createTheme as createMuiTheme, responsiveFontSizes } from '@mui/material/styles';
import { createOptions as createBaseOptions } from './base/create-options';

export const createTheme = (config) => {
  let theme = createMuiTheme(
    // Base options available for both dark and light palette modes
    createBaseOptions({
      direction: config.direction
    }));

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
