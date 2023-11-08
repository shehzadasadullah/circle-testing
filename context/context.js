import { createContext, useState } from "react";

export const Create_Event_Popup = createContext(null);

const Context = ({ children }) => {
  const [createEventPopup, setCreateEventPopup] = useState(false);
  return (
    <Create_Event_Popup.Provider
      value={[createEventPopup, setCreateEventPopup]}
    >
      {children}
    </Create_Event_Popup.Provider>
  );
};

export default Context;
