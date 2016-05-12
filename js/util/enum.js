export default function(...values) {
  const enumeration = {};
  values.forEach(name => enumeration[name] = Symbol(name));
  return enumeration;
}
