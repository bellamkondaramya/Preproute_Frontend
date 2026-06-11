export function Field({ label, children }) {
  return <label className="block"><span className="form-label">{label}</span>{children}</label>;
}

export function Input(props) {
  return <input className="form-input" {...props} />;
}

export function Select({ children, ...props }) {
  return <select className="form-input" {...props}>{children}</select>;
}

export function Textarea(props) {
  return <textarea className="form-input min-h-28 resize-y" {...props} />;
}
