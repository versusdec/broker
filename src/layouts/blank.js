import PropTypes from "prop-types";
import Head from "../components/head";

export const Layout = (props) => {
  const {children} = props;
  
  const title = props.title
    ? props.title
    : props.children?.props.title
      ? props.children.props.title
      : false
  
  return (<>
    <Head title={title}/>
    {children}
  </>)
}

Layout.propTypes = {
  children: PropTypes.node
};