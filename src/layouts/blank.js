import PropTypes from "prop-types";

export const Layout = ({children}) => (
  <>
    {children}
  </>
)

Layout.propTypes = {
  children: PropTypes.node
};