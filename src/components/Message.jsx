function Message({ type, text }) {
  if (!text) return null;
  return <p className={type === "error" ? "msg error" : "msg ok"}>{text}</p>;
}

export default Message;
