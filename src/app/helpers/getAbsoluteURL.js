let a

export default function getAbsoluteURL(url, document) {
  if (!a) a = document.createElement('a');
  a.href = url;
  return a.href;
}