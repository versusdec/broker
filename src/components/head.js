import Head from 'next/head'
import Favicon from './favicon'

const HeadJSX = ({ title, children }) => (
  <Head>
    <title>{title ? title + ' | Koala Call' : 'Koala Call'}</title>
    <Favicon />
    {children}
  </Head>
)

export default HeadJSX
