import { useCallContext } from "../context/CallContext";

const useCall = () => {
  return useCallContext();
};

export default useCall;