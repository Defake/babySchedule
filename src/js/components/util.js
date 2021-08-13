const e = React.createElement;
const useState = React.useState;
const useEffect = React.useEffect;
const useContext = React.useContext;

function DangerText(props) {
  return (
    <span className="text-danger">{props.children}</span>
  );
}

function SuccessText(props) {
  return (
    <span className="text-success">{props.children}</span>
  );
}

function InfoText(props) {
  return (
    <span className="text-info">{props.children}</span>
  );
}

function CrossedText(props) {
  return (
    <s className="text-muted">{props.children}</s>
  );
}

