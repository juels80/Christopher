import Shield from "../components/Shield.jsx";
import Terms from "./Terms.jsx";
import Privacy from "./Privacy.jsx";

const DOCS = {
  terms: { title: "Terms of Service", other: "privacy", otherTitle: "Privacy Policy", View: Terms },
  privacy: { title: "Privacy Policy", other: "terms", otherTitle: "Terms of Service", View: Privacy },
};

// Shown from the sign-up screen and the Help page, signed in or not.
export default function Legal({ doc, onBack, onOpen }) {
  const { title, other, otherTitle, View } = DOCS[doc];
  return (
    <div className="wrap legalpage">
      <header>
        <h1><Shield />{title}</h1>
        <button className="link" onClick={onBack}>Back</button>
      </header>
      <View />
      <button className="btn" onClick={() => onOpen(other)}>Read the {otherTitle}</button>
    </div>
  );
}
