import { useSelector } from "react-redux";

function useSelect(name) {
  return useSelector(state => state[name]);
}

export { useSelect };

