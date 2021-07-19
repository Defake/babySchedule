const e = React.createElement;
const useState = React.useState;
const useEffect = React.useEffect;
const useContext = React.useContext;

function DangerText(props) {
  return (
    <span className="text-danger">{props.children}</span>
  );
}