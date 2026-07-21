import PageTitle from '../common/PageTitle';

/**
 * Header - Page header with title, breadcrumbs, and actions.
 * Delegates to PageTitle for consistency.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.actions]
 * @param {Array<{label:string, href?:string}>} [props.breadcrumbs]
 * @param {boolean} [props.borderBottom=true]
 * @param {string} [props.className]
 */
function Header(props) {
  return <PageTitle {...props} />;
}

export default Header;
